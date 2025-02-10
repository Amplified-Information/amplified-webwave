
import { corsHeaders } from '../_shared/cors.ts';
import { OpenAI } from 'https://esm.sh/openai@4.28.0';

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

async function runAgent(role: string, content: string, previousAnalyses: Record<string, any>[] = []): Promise<AgentResponse> {
  const systemPrompts: Record<string, string> = {
    bias_detection: "You are an expert in detecting bias in news articles. Analyze the text for potential biases, loaded terms, and emotional manipulation.",
    fact_checker: "You are a professional fact-checker. Verify factual claims and identify potential inaccuracies.",
    quality_assessor: "You are a journalism quality expert. Evaluate the writing quality, structure, and adherence to journalistic standards.",
    credibility_assessor: "You are a source credibility analyst. Evaluate the reliability of sources and author credentials if available.",
    lead_editor: "You are a lead editor. Review all previous analyses and compile a comprehensive final report."
  };

  let prompt = systemPrompts[role] + "\n\nArticle content:\n" + content;
  
  if (previousAnalyses.length > 0) {
    prompt += "\n\nPrevious analyses:\n" + JSON.stringify(previousAnalyses, null, 2);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompts[role] },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
  });

  try {
    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    return {
      analysis,
      confidence: 0.85 // This could be calculated based on various factors
    };
  } catch (error) {
    return {
      analysis: { text: response.choices[0].message.content },
      confidence: 0.7
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { articleId, content, url } = await req.json() as AnalysisRequest;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get agent configurations
    const { data: agents } = await supabaseClient
      .from('agent_configurations')
      .select('*')
      .eq('is_active', true);

    if (!agents) {
      throw new Error('No active agents found');
    }

    const analyses: Record<string, any>[] = [];
    
    // Run each agent in sequence
    for (const agent of agents) {
      console.log(`Running ${agent.name} analysis...`);
      const result = await runAgent(agent.type, content, analyses);
      
      // Store the analysis result
      const { data, error } = await supabaseClient
        .from('analysis_results')
        .insert({
          article_id: articleId,
          agent_id: agent.id,
          analysis_data: result.analysis,
          confidence_score: result.confidence,
          status: 'completed'
        })
        .select()
        .single();

      if (error) throw error;
      analyses.push(result.analysis);
    }

    return new Response(JSON.stringify({ success: true, analyses }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
