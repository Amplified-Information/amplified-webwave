
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { findCompanionData } from '@/data/companionPlanting';

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
    const { hardinessZone, gardenSize, selectedPlants, growingSpaces } = await req.json();

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

    // Get companion planting data for each plant
    const companionPlantingDetails = selectedPlants.map(plant => {
      const companionData = findCompanionData(plant);
      return {
        plant,
        companions: companionData?.companions || [],
        avoids: companionData?.avoids || [],
        benefits: companionData?.benefits || ''
      };
    });

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
            content: `You are a skilled garden planning team consisting of multiple experts:
            1. Master Gardener - Expert in plant care and cultivation
            2. Soil Scientist - Specialist in soil requirements and fertilization
            3. Garden Layout Designer - Expert in spatial planning and companion planting
            4. Climate Specialist - Expert in zone-specific growing conditions
            
            Work together to create a comprehensive garden plan that maximizes success for the gardener.`
          },
          {
            role: 'user',
            content: `Create a detailed garden report with the following information:
            Hardiness Zone: ${hardinessZone}
            Garden Size: ${gardenSize} sq ft
            Growing Spaces Available:
            ${Object.entries(growingSpaces)
              .filter(([_, value]) => value)
              .map(([key]) => `- ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`)
              .join('\n')}
            
            Selected Plants Details:
            ${JSON.stringify(plantDetailsForPrompt, null, 2)}
            
            Companion Planting Information:
            ${JSON.stringify(companionPlantingDetails, null, 2)}

            Please provide a comprehensive report with these sections:

            1. Garden Overview
            - Summary of available growing spaces and their best uses
            - General climate considerations for Zone ${hardinessZone}
            - Total space requirements and allocation recommendations
            
            2. Individual Plant Analysis (for each selected plant):
            - Detailed growing requirements
            - Specific fertilization needs and schedule
            - Optimal growing space allocation (from available spaces)
            - Special care instructions
            - Disease prevention tips
            
            3. Companion Planting Strategy
            - Detailed interplanting opportunities
            - Specific combinations to avoid
            - Scientific reasoning for recommendations
            - Space-sharing strategies
            
            4. Season-by-Season Planting Schedule
            - When to start seeds (if applicable)
            - Optimal transplanting times
            - Succession planting opportunities
            - Expected harvest periods
            
            5. Soil Preparation and Maintenance
            - Specific soil amendments needed for each plant
            - pH requirements and adjustments
            - Organic matter recommendations
            - Mulching strategies
            
            6. Irrigation and Water Management
            - Water requirements for each plant
            - Irrigation scheduling
            - Drought tolerance considerations
            - Water conservation strategies
            
            7. Space Optimization Recommendations
            - Vertical growing opportunities
            - Intercropping strategies
            - Season extension techniques
            - Crop rotation planning
            
            Format each section with clear headings and bullet points. Provide specific, actionable advice based on the selected plants, growing conditions, and available spaces.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
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
        growing_spaces: growingSpaces,
        report_content: {
          full_report: reportContent,
          plant_details: plantDetailsForPrompt,
          companion_planting: companionPlantingDetails,
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
