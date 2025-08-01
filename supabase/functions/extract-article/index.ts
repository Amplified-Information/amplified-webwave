import { corsHeaders } from '../_shared/cors.ts';
import { OpenAI } from 'https://esm.sh/openai@4.28.0';

interface ExtractRequest {
  url: string;
}

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
});

// Helper function to find the main content section using patterns
function findMainContentSection(html: string): { content: string; patternUsed: string } {
  const mainContentPatterns = [
    // Primary article patterns
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    // Common article container patterns
    /<div[^>]*(?:class|id)=['"](?:.*?post-content.*?|.*?article-content.*?|.*?entry-content.*?|.*?story-content.*?|.*?article-body.*?)['"][^>]*>([\s\S]*?)<\/div>/i,
    // News site specific patterns
    /<div[^>]*(?:class|id)=['"](?:.*?news-content.*?|.*?story-body.*?|.*?article-text.*?)['"][^>]*>([\s\S]*?)<\/div>/i,
    // Generic content patterns
    /<div[^>]*(?:class|id)=['"](?:.*?content.*?|.*?main.*?|.*?body.*?)['"][^>]*>([\s\S]*?)<\/div>/i,
  ];

  let content = '';
  let patternUsed = '';
  
  // Try each pattern until we find a match
  for (const pattern of mainContentPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      content = match[1];
      patternUsed = pattern.toString().slice(0, 50) + '...';
      console.log('Found content using pattern:', patternUsed);
      break;
    }
  }

  // If no main content found, try to extract from body
  if (!content) {
    console.log('No specific article container found, attempting body content extraction');
    const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
    if (bodyMatch && bodyMatch[1]) {
      content = bodyMatch[1];
      patternUsed = 'body tag';
      console.log('Extracted content from body tag');
    } else {
      content = html;
      patternUsed = 'full HTML';
      console.log('Using full HTML as content');
    }
  }

  return { content, patternUsed };
}

// Helper function to clean HTML content
function cleanHtmlContent(html: string): string {
  return html
    // Remove scripts
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove styles
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove navigation elements
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    // Remove headers (carefully)
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    // Remove footers (carefully)
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    // Remove social media widgets
    .replace(/<div[^>]*(?:class|id)=['"](?:.*?social.*?|.*?share.*?)['"][^>]*>[\s\S]*?<\/div>/gi, '')
    // Remove advertisements
    .replace(/<div[^>]*(?:class|id)=['"](?:.*?ad.*?|.*?advertisement.*?)['"][^>]*>[\s\S]*?<\/div>/gi, '')
    // Keep HTML tags for display
    .trim();
}

// Helper function to get text content length (without HTML tags)
function getTextContentLength(html: string): number {
  // Create a temporary string without HTML tags for length calculation
  const textContent = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return textContent.length;
}

// Main content extraction function
function extractMainContent(html: string): string {
  const { content, patternUsed } = findMainContentSection(html);
  const cleanedContent = cleanHtmlContent(content);
  const textLength = getTextContentLength(cleanedContent);

  console.log('Content extraction stats:', {
    originalLength: html.length,
    extractedLength: cleanedContent.length,
    textLength: textLength,
    patternUsed: patternUsed,
    hasContent: cleanedContent.length > 0,
    contentPreview: cleanedContent.slice(0, 200) + '...'
  });

  if (textLength < 50) {
    console.error('Extracted content is too short:', textLength, 'characters');
    throw new Error('Failed to extract meaningful content from the article');
  }

  return cleanedContent;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json() as ExtractRequest;
    
    if (!url) {
      console.log('No URL provided');
      return new Response(
        JSON.stringify({
          error: 'No URL provided',
          details: 'URL is required'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Attempting to extract content from URL:', url);
    
    try {
      // Validate URL format
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        console.log('Invalid URL protocol:', urlObj.protocol);
        throw new Error('Invalid URL protocol');
      }

      // Fetch the webpage content with more headers and logging
      console.log('Sending request to URL with headers...');
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error('Failed to fetch URL:', response.status, response.statusText);
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      console.log('Successfully fetched HTML content, length:', html.length);
      console.log('First 500 characters of HTML:', html.substring(0, 500));

      if (html.length < 100) {
        console.error('Received suspiciously short HTML content');
        throw new Error('Website returned invalid or empty content');
      }

      // Extract and clean main content with detailed logging
      console.log('Attempting to extract main content...');
      const mainContent = extractMainContent(html);
      console.log('Extracted main content length:', mainContent.length);
      console.log('First 500 characters of extracted content:', mainContent.substring(0, 500));

      if (mainContent.length < 50) {
        console.error('Extracted content is suspiciously short:', mainContent);
        throw new Error('Failed to extract meaningful content from the page');
      }

      // Use OpenAI to process the content
      console.log('Initiating OpenAI content extraction...');
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a precise article content extractor. Extract the main article content, title, description, and attribution details from the provided HTML. Return only the extracted information in this exact format:\n\n{\n\"title\": \"Article Title\",\n\"description\": \"Brief description or summary\",\n\"content\": \"Full article content with source attribution at the top\",\n\"author\": \"Author name or null\",\n\"published\": \"Publication date or null\",\n\"source\": \"Website name or source\"\n}"
          },
          {
            role: "user",
            content: `URL: ${url}\n\nContent:\n${mainContent}`
          }
        ],
        temperature: 0.3
      });

      console.log('OpenAI API response received');

      if (!completion.choices?.[0]?.message?.content) {
        console.error('OpenAI API returned invalid response format');
        throw new Error('Failed to extract content: Invalid API response');
      }

      let extractedData;
      try {
        extractedData = JSON.parse(completion.choices[0].message.content);
        console.log('Successfully parsed OpenAI response:', {
          hasTitle: !!extractedData.title,
          hasDescription: !!extractedData.description,
          contentPreview: extractedData.content?.slice(0, 100) + '...'
        });
      } catch (error) {
        console.error('Failed to parse OpenAI response:', error);
        throw new Error('Failed to parse extracted content format');
      }

      // Validate the extracted content
      if (!extractedData.content || extractedData.content.trim().length < 50) {
        console.error('Extracted content validation failed:', {
          contentLength: extractedData.content?.length || 0,
          content: extractedData.content?.slice(0, 100) + '...'
        });
        throw new Error('Failed to extract meaningful content from the article');
      }

      console.log('Successfully extracted article data:', {
        hasTitle: !!extractedData.title,
        hasDescription: !!extractedData.description,
        contentLength: extractedData.content?.length || 0
      });

      return new Response(
        JSON.stringify({
          ...extractedData,
          url,
          source: urlObj.hostname,
          rawContent: mainContent // Include the raw content in the response
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );

    } catch (error) {
      console.error('Article extraction error:', error);
      console.error('Full error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      
      let errorMessage = 'Failed to extract content from URL';
      let details = error.message;
      let status = 400;
      
      // Enhanced error messages based on specific error types
      if (error.message.includes('Invalid URL')) {
        errorMessage = 'Invalid URL format';
      } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
        errorMessage = 'Request timed out while trying to access the URL';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused by the server';
      } else if (error.message.includes('Failed to parse')) {
        errorMessage = 'Failed to parse article content';
        status = 500;
      } else if (error.message.includes('403')) {
        errorMessage = 'Access to the website is forbidden';
        details = 'The website is blocking our request. Try copying and pasting the article content directly.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Article not found';
        details = 'The URL provided does not exist or has been moved.';
      }

      return new Response(
        JSON.stringify({
          error: errorMessage,
          details: details
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: status,
        }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        details: error.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
