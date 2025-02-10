
import { corsHeaders } from '../_shared/cors.ts';
import { extract } from 'npm:@extractus/article-extractor';

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

      // Extract article data
      const article = await extract(url);
      
      if (!article) {
        console.log('No article data returned from extraction');
        throw new Error('Could not extract content from URL');
      }

      console.log('Successfully extracted article data:', {
        title: article.title,
        description: article.description?.substring(0, 100),
        content: article.content?.substring(0, 100) + '...'
      });

      return new Response(
        JSON.stringify({
          title: article.title,
          description: article.description,
          author: article.author,
          published: article.published,
          content: article.content,
          url: article.url,
          source: article.source,
          links: article.links,
          ttr: article.ttr
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );

    } catch (error) {
      console.error('Article extraction error:', error);
      let errorMessage = 'Failed to extract content from URL';
      
      if (error.message.includes('Invalid URL')) {
        errorMessage = 'Invalid URL format';
      } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
        errorMessage = 'Request timed out while trying to access the URL';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused by the server';
      }

      return new Response(
        JSON.stringify({
          error: errorMessage,
          details: error.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
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
