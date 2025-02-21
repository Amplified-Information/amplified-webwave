
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const grokApiKey = Deno.env.get('GROK_API_KEY');
    if (!grokApiKey) {
      throw new Error('Grok API key not configured');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get recent bond data
    const { data: bondData, error: bondError } = await supabaseClient
      .from('bond_yields')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (bondError) throw bondError;

    const { prompt = '' } = await req.json();
    
    // Format bond data for analysis
    const formattedData = bondData.map(record => ({
      date: record.date,
      yields: {
        '2yr': record.yield_2yr,
        '5yr': record.yield_5yr,
        '10yr': record.yield_10yr,
        '30yr': record.yield_30yr,
      }
    }));

    // Call Grok API
    const response = await fetch('https://api.grok.com/v1/analyze', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst specializing in bond markets. Analyze the provided bond yield data and generate insights.'
          },
          {
            role: 'user',
            content: `Analyze this bond yield data and ${prompt || 'provide key insights'}:\n${JSON.stringify(formattedData, null, 2)}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const analysis = await response.json();

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-bonds function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
