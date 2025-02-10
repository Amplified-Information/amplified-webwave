
import { corsHeaders } from '../_shared/cors.ts';
import { OpenAI } from 'https://esm.sh/openai@4.28.0';

interface ExtractRequest {
  url: string;
}

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
});

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

      // Fetch the webpage content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      console.log('Successfully fetched HTML content, length:', html.length);

      // Use OpenAI to extract the article content
      console.log('Initiating OpenAI content extraction...');
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a precise article content extractor. Extract the main article content, title, and description from the provided HTML. Return ONLY a JSON object with the following fields: title (string), description (string), content (string), author (string or null), published (string or null). Make sure to clean any advertisements or irrelevant content."
          },
          {
            role: "user",
            content: html
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      if (!completion.choices?.[0]?.message?.content) {
        console.error('OpenAI API returned invalid response format');
        throw new Error('Failed to extract content: Invalid API response');
      }

      const extractedData = JSON.parse(completion.choices[0].message.content);
      console.log('Successfully extracted article data:', {
        hasTitle: !!extractedData.title,
        hasDescription: !!extractedData.description,
        hasContent: !!extractedData.content,
        contentLength: extractedData.content?.length || 0
      });

      return new Response(
        JSON.stringify({
          ...extractedData,
          url,
          source: urlObj.hostname
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );

    } catch (error) {
      console.error('Article extraction error:', error);
      let errorMessage = 'Failed to extract content from URL';
      let details = error.message;
      let status = 400;
      
      if (error.message.includes('Invalid URL')) {
        errorMessage = 'Invalid URL format';
      } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
        errorMessage = 'Request timed out while trying to access the URL';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused by the server';
      } else if (error.message.includes('Failed to parse as JSON')) {
        errorMessage = 'Failed to parse AI response';
        status = 500;
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
