
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

      // Extract article data with full response
      const article = await extract(url);
      
      if (!article) {
        console.log('No article data returned from extraction');
        throw new Error('Could not extract content from URL');
      }

      // Log the full article object to understand what we're getting
      console.log('Full article data:', JSON.stringify(article, null, 2));

      // Return more complete article data
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
          ttr: article.ttr // time to read
        }), {
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
