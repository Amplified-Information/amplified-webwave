
import { corsHeaders } from '../_shared/cors.ts';
import { extract } from 'https://esm.sh/@extractus/article-extractor@8.0.4';

interface ExtractRequest {
  url: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json() as ExtractRequest;
    
    if (!url) {
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

    console.log('Starting URL extraction for:', url);
    
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        console.log('Invalid URL protocol:', urlObj.protocol);
        throw new Error('Invalid URL protocol');
      }

      const article = await extract(url);
      
      if (!article) {
        console.log('No article data returned from extraction');
        throw new Error('Could not extract content from URL');
      }

      if (!article.content) {
        console.log('Article found but no content available:', article);
        throw new Error('No content found in article');
      }

      const cleanContent = article.content
        .replace(/<[^>]*>/g, '')  // Remove HTML tags
        .replace(/\s+/g, ' ')     // Normalize whitespace
        .trim();                  // Remove leading/trailing whitespace

      if (!cleanContent) {
        console.log('Content was empty after cleaning');
        throw new Error('Content was empty after cleaning');
      }

      console.log('Successfully extracted content from URL, length:', cleanContent.length);
      return new Response(
        JSON.stringify({ content: cleanContent }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (error) {
      console.error('Article extraction error:', error);
      if (error.message.includes('Invalid URL')) {
        throw new Error('Invalid URL format');
      }
      throw new Error('Failed to extract content from URL');
    }
  } catch (error) {
    console.error('Error in extract-article function:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to extract content from URL',
      details: 'Failed to extract article content. Please check the URL and try again.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
