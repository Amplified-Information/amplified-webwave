
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { hardinessZone, gardenSize, selectedPlants } = await req.json();

    // Generate the report using GPT-4
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional garden planning expert. Create a detailed garden report based on the provided information.'
          },
          {
            role: 'user',
            content: `Please create a detailed garden report with the following information:
            Hardiness Zone: ${hardinessZone}
            Garden Size: ${gardenSize} sq ft
            Selected Plants: ${selectedPlants.join(', ')}

            Include the following sections:
            1. Location & Hardiness Zone (including frost dates)
            2. Garden Size & Layout (including recommendations)
            3. Plant Selection Analysis (including companion planting)
            4. Seasonal Planting Schedule
            5. Garden Maintenance Plan
            6. Special Considerations

            Please provide specific, actionable advice based on the selected plants and conditions.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    const data = await response.json();
    const reportContent = data.choices[0].message.content;

    // Store the report in the database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: report, error } = await supabaseClient
      .from('garden_reports')
      .insert({
        hardiness_zone: hardinessZone,
        garden_size: parseInt(gardenSize),
        selected_plants: selectedPlants,
        report_content: {
          full_report: reportContent,
          generated_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ report }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
