
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
    const { hardinessZone, selectedPlants, growingSpaces } = await req.json();

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
      return {
        plant,
        companions: [], // This would be populated from your companion planting data
        avoids: [],    // This would be populated from your companion planting data
      };
    });

    // Fetch frost dates and climate data based on hardiness zone
    const zoneData = {
      '3': { lastFrost: 'May 15-31', firstFrost: 'September 1-15' },
      '4': { lastFrost: 'May 1-15', firstFrost: 'September 15-30' },
      '5': { lastFrost: 'April 15-30', firstFrost: 'October 1-15' },
      '6': { lastFrost: 'April 1-15', firstFrost: 'October 15-31' },
      '7': { lastFrost: 'March 15-31', firstFrost: 'November 1-15' },
      '8': { lastFrost: 'March 1-15', firstFrost: 'November 15-30' },
      '9': { lastFrost: 'February 15-28', firstFrost: 'December 1-15' }
    };

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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a team of gardening experts:
            1. Climate Specialist - Expert in zone-specific growing conditions and frost dates
            2. Master Gardener - Expert in plant care and cultivation
            3. Garden Layout Designer - Expert in spatial planning and companion planting
            4. Soil Scientist - Specialist in soil requirements and amendments
            5. Irrigation Expert - Specialist in water management
            6. Pest Management Specialist - Expert in organic and conventional pest control
            
            Work together to create a comprehensive garden plan that covers all aspects of garden planning and maintenance.`
          },
          {
            role: 'user',
            content: `Create a detailed garden report with the following structure:

            1. Location & Hardiness Zone
            - USDA Zone ${hardinessZone}
            - Frost dates: ${JSON.stringify(zoneData[hardinessZone])}
            - Analyze appropriate sunlight exposure needs
            
            2. Growing Spaces Available (analyze each space type and provide specific recommendations)
            ${Object.entries(growingSpaces)
              .map(([key, value]) => `- ${key.replace(/_/g, ' ')}: ${value.size} sq ft`)
              .join('\n')}
            
            3. Plant Selection Analysis for:
            ${JSON.stringify(plantDetailsForPrompt, null, 2)}
            
            4. Seasonal Planting Schedule
            - Create a detailed calendar based on frost dates
            - Include succession planting opportunities
            - Plan crop rotation
            
            5. Garden Maintenance Plan
            - Create monthly maintenance schedules
            - Include soil amendment timing
            - Detail pest management strategies
            
            6. Special Considerations
            - Analyze each growing space type and provide specific recommendations
            - Suggest season extension techniques
            - Include companion planting strategies
            
            Format the report with clear sections, bullet points, and tables where appropriate. Make specific recommendations based on the growing spaces available and selected plants.
            
            For each plant, provide detailed growing instructions considering the specific growing spaces available. If a plant requires special care in any of the available growing spaces, highlight those requirements.`
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
        garden_size: Object.values(growingSpaces).reduce((sum, space) => sum + space.size, 0),
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
