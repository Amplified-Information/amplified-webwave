
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

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch detailed plant information for all selected plants
    const { data: plantDetails, error: plantError } = await supabaseClient
      .from('plants')
      .select(`
        *,
        botanical_family:botanical_family_id(
          name,
          description
        ),
        planting_dates(
          zone,
          sowing_dates
        )
      `)
      .in('name', selectedPlants);

    if (plantError) throw plantError;

    // Format plant details for the prompt
    const plantDetailsForPrompt = plantDetails.map(plant => ({
      name: plant.name,
      botanical_family: plant.botanical_family?.name,
      species: plant.species,
      binomial_name: plant.binomial_name,
      description: plant.description,
      sun_requirements: plant.sun_requirements,
      sowing_method: plant.sowing_method,
      height: plant.height,
      planting_dates: plant.planting_dates?.find(d => d.zone === hardinessZone)?.sowing_dates || 'Dates not available for this zone'
    }));

    // Generate the report using GPT-4
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
            
            Selected Plants Details:
            ${JSON.stringify(plantDetailsForPrompt, null, 2)}

            Include the following sections:
            1. Location & Hardiness Zone Analysis
               - Include typical frost dates and growing season length
               - Zone-specific considerations
            
            2. Garden Size & Layout Recommendations
               - Space allocation for each plant
               - Suggested bed layouts
               - Consider height and sun requirements
            
            3. Detailed Plant Analysis
               - Individual analysis for each selected plant
               - Scientific name and family information
               - Growing requirements
               - Optimal planting dates for the zone
            
            4. Companion Planting Strategy
               - Beneficial plant combinations
               - Plants to keep separated
               - Reasons for the recommendations
            
            5. Seasonal Planting Schedule
               - When to start seeds indoors (if applicable)
               - When to transplant or direct sow
               - Succession planting opportunities
            
            6. Care & Maintenance Guidelines
               - Watering requirements
               - Fertilization needs
               - Common issues to watch for
            
            7. Special Considerations
               - Soil preparation recommendations
               - Season extension opportunities
               - Crop rotation planning for future seasons

            Please provide specific, actionable advice based on the selected plants and conditions.
            Format the report with clear headings and bullet points for easy reading.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      }),
    });

    const data = await response.json();
    const reportContent = data.choices[0].message.content;

    // Store the report in the database
    const { data: report, error } = await supabaseClient
      .from('garden_reports')
      .insert({
        hardiness_zone: hardinessZone,
        garden_size: parseInt(gardenSize),
        selected_plants: selectedPlants,
        report_content: {
          full_report: reportContent,
          plant_details: plantDetailsForPrompt,
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
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
