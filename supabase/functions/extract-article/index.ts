
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

    console.log('Starting URL extraction for:', url);
    
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        console.log('Invalid URL protocol:', urlObj.protocol);
        throw new Error('Invalid URL protocol');
      }

      // Extract article data with full response
      const article = await extract(url, {
        timeout: 30000, // 30 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      
      if (!article) {
        console.log('No article data returned from extraction');
        throw new Error('Could not extract content from URL');
      }

      // Clean up content to remove problematic elements
      let cleanContent = article.content || '';
      // Remove iframe tags and their content
      cleanContent = cleanContent.replace(/<iframe[^>]*>.*?<\/iframe>/gs, '');
      // Remove script tags and their content
      cleanContent = cleanContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      // Remove style tags and their content
      cleanContent = cleanContent.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
      // Remove other potentially problematic elements
      cleanContent = cleanContent.replace(/<video[^>]*>.*?<\/video>/gs, '');
      cleanContent = cleanContent.replace(/<object[^>]*>.*?<\/object>/gs, '');
      cleanContent = cleanContent.replace(/<embed[^>]*>.*?<\/embed>/gs, '');

      // Log the full article object to understand what we're getting
      console.log('Full article data:', JSON.stringify({
        ...article,
        content: cleanContent.substring(0, 200) + '...' // Log only first 200 chars of content
      }, null, 2));

      // Return cleaned article data
      return new Response(
        JSON.stringify({
          title: article.title,
          description: article.description,
          author: article.author,
          published: article.published,
          content: cleanContent,
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
      if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
        throw new Error('Request timed out while trying to access the URL');
      }
      if (error.message.includes('ECONNREFUSED')) {
        throw new Error('Connection refused by the server');
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
