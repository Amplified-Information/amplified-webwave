
import { corsHeaders } from '../_shared/cors.ts';
import { OpenAI } from 'https://esm.sh/openai@4.28.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { extract } from 'https://esm.sh/@extractus/article-extractor@8.0.4';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

interface AnalysisRequest {
  articleId: string;
  content: string;
  url?: string;
}

interface AgentResponse {
  analysis: Record<string, any>;
  confidence: number;
}

async function extractArticleContent(url: string): Promise<string> {
  console.log('Starting URL extraction for:', url);
  
  if (!url) {
    console.log('No URL provided');
    throw new Error('No URL provided');
  }

  try {
    if (!url.startsWith('http')) {
      console.log('Invalid URL format:', url);
      throw new Error('Invalid URL format');
    }

    const article = await extract(url);
    
    if (!article) {
      console.log('No article data returned from extraction');
      throw new Error('No article content found');
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
    return cleanContent;
  } catch (error) {
    console.error('Article extraction error:', error);
    throw new Error('URL extraction failed: ' + error.message);
  }
}

async function runAgent(role: string, content: string, previousAnalyses: Record<string, any>[] = []): Promise<AgentResponse> {
  const systemPrompts: Record<string, string> = {
    bias_detection: `You are an expert in detecting bias in news articles. Analyze the following article for:
      - Political or ideological bias
      - Language that shows favoritism or prejudice
      - Emotional manipulation techniques
      - Loaded terms or rhetoric
      Provide specific examples from the text.
      DO NOT provide a template response. Only analyze the actual content provided.`,
    
    fact_checker: `You are a professional fact-checker. For the following article:
      - Identify key factual claims
      - Note any unsubstantiated claims
      - Check for misleading statistics or data
      - Point out any need for additional context
      Use specific quotes and examples from the text.
      DO NOT provide a template response. Only analyze the actual content provided.`,
    
    quality_assessor: `You are a journalism quality expert. Evaluate this article for:
      - Writing clarity and professionalism
      - Structure and organization
      - Use of sources and citations
      - Balance in reporting
      Provide specific examples from the text.
      DO NOT provide a template response. Only analyze the actual content provided.`,
    
    credibility_assessor: `You are a source credibility analyst. For this article:
      - Evaluate the credibility of quoted sources
      - Check author credentials if available
      - Assess the reliability of any data or statistics
      - Consider the publication's reputation
      Use specific examples from the text.
      DO NOT provide a template response. Only analyze the actual content provided.`,
    
    lead_editor: `You are a lead editor reviewing all previous analyses of this article. Create a comprehensive report that:
      - Synthesizes the key findings from all analyses
      - Highlights the most significant concerns or strengths
      - Provides specific recommendations for improvement
      Base your analysis on the actual content and previous analyses.
      DO NOT provide a template response.`
  };

  let prompt = systemPrompts[role] + "\n\nArticle content:\n" + content;
  
  if (previousAnalyses.length > 0) {
    prompt += "\n\nPrevious analyses:\n" + JSON.stringify(previousAnalyses, null, 2);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompts[role] },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    });

    if (!response.choices[0].message?.content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const analysis = JSON.parse(response.choices[0].message.content);
      return {
        analysis,
        confidence: 0.85
      };
    } catch (error) {
      // If the response isn't JSON, return it as a text field
      return {
        analysis: { text: response.choices[0].message.content },
        confidence: 0.7
      };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    if (error.status === 429) {
      throw new Error("OpenAI API rate limit exceeded. Please try again in a few minutes.");
    }
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { articleId, content, url } = await req.json() as AnalysisRequest;
    
    let articleContent = content;
    
    // Validate input
    if (!articleId) {
      return new Response(
        JSON.stringify({
          error: 'Missing article ID',
          details: 'Article ID is required'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Only attempt URL extraction if no direct content is provided
    if (url && !content) {
      try {
        articleContent = await extractArticleContent(url);
        console.log('Successfully extracted content from URL');
      } catch (error) {
        console.error('URL extraction error:', error);
        return new Response(
          JSON.stringify({
            error: 'URL extraction failed',
            details: 'Please paste the article content directly in the text box instead.'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Validate content
    if (!articleContent || articleContent.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No article content provided',
          details: 'Please provide either URL or article content.'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update article with extracted content if it came from URL
    if (url && articleContent !== content) {
      const { error: updateError } = await supabaseClient
        .from('articles')
        .update({ content: articleContent })
        .eq('id', articleId);

      if (updateError) {
        console.error('Error updating article content:', updateError);
      }
    }

    const { data: agents, error: agentsError } = await supabaseClient
      .from('agent_configurations')
      .select('*')
      .eq('is_active', true);

    if (agentsError) {
      throw new Error(`Failed to fetch agents: ${agentsError.message}`);
    }

    if (!agents || agents.length === 0) {
      throw new Error('No active agents found');
    }

    const analyses: Record<string, any>[] = [];
    
    for (const agent of agents) {
      try {
        console.log(`Running ${agent.name} analysis...`);
        const result = await runAgent(agent.type, articleContent, analyses);
        
        const { error } = await supabaseClient
          .from('analysis_results')
          .insert({
            article_id: articleId,
            agent_id: agent.id,
            analysis_data: result.analysis,
            confidence_score: result.confidence,
            status: 'completed'
          });

        if (error) throw error;
        analyses.push(result.analysis);
      } catch (error) {
        console.error(`Error in agent ${agent.name}:`, error);
        
        if (error.message.includes('rate limit')) {
          throw error; // Re-throw rate limit errors to be handled by outer catch
        }
        
        await supabaseClient
          .from('analysis_results')
          .insert({
            article_id: articleId,
            agent_id: agent.id,
            analysis_data: { error: error.message },
            confidence_score: 0,
            status: 'failed'
          });
      }
    }

    return new Response(JSON.stringify({ success: true, analyses }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in analyze-article function:', error);
    
    const status = error.message.includes('rate limit') ? 429 : 500;
    const details = status === 429 
      ? 'Please try again in a few minutes.'
      : 'An unexpected error occurred. Please try again.';

    return new Response(JSON.stringify({
      error: error.message,
      details
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    });
  }
});
