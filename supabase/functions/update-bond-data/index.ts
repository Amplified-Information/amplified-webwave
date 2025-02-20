
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting bond data update process...');

    // Test Bank of Canada API first
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
      .toISOString().split('T')[0];

    console.log(`Fetching data from ${startDate} to ${endDate}`);

    // Step 1: Fetch from Bank of Canada
    const bankResponse = await fetch(
      `https://www.bankofcanada.ca/valet/observations/group/bond_yields/json?start_date=${startDate}&end_date=${endDate}`
    );

    if (!bankResponse.ok) {
      throw new Error(`Bank of Canada API failed with status ${bankResponse.status}: ${bankResponse.statusText}`);
    }

    const rawData = await bankResponse.json();
    console.log('Successfully fetched data from Bank of Canada');

    if (!rawData.observations || !Array.isArray(rawData.observations)) {
      console.error('Unexpected API response format:', rawData);
      throw new Error('Invalid response format from Bank of Canada API');
    }

    // Step 2: Transform the data
    const now = new Date().toISOString();
    const bondYields = rawData.observations
      .filter(obs => 
        obs.d && 
        typeof obs.V36683 === 'number' && 
        typeof obs.V36684 === 'number' && 
        typeof obs.V36685 === 'number' && 
        typeof obs.V36686 === 'number'
      )
      .map(obs => ({
        date: obs.d,
        yield_2yr: Number(obs.V36683),
        yield_5yr: Number(obs.V36684),
        yield_10yr: Number(obs.V36685),
        yield_30yr: Number(obs.V36686),
        last_update: now
      }));

    console.log(`Processed ${bondYields.length} valid records`);

    if (bondYields.length === 0) {
      throw new Error('No valid bond yield data found in the response');
    }

    // Step 3: Store in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('Inserting data into Supabase...');

    const { error: upsertError } = await supabaseClient
      .from('bond_yields')
      .upsert(bondYields, {
        onConflict: 'date'
      });

    if (upsertError) {
      console.error('Database error:', upsertError);
      throw new Error(`Failed to store data: ${upsertError.message}`);
    }

    console.log(`Successfully stored ${bondYields.length} records`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Bond yield data updated successfully',
        recordsProcessed: bondYields.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
