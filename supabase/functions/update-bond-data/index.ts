
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BondYieldResponse {
  observations: Array<{
    d: string;  // date
    V36683: number; // 2-year
    V36684: number; // 5-year
    V36685: number; // 10-year
    V36686: number; // 30-year
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting bond data update process...');
    
    // Initialize Supabase client with explicit error handling
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Fetch data from Bank of Canada API
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
      .toISOString().split('T')[0];

    console.log(`Fetching data from ${startDate} to ${endDate}`);

    const response = await fetch(
      `https://www.bankofcanada.ca/valet/observations/group/bond_yields/json?start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) {
      throw new Error(`Bank of Canada API failed: ${response.statusText}`);
    }

    const data: BondYieldResponse = await response.json();
    
    if (!data.observations || !Array.isArray(data.observations)) {
      throw new Error('Invalid response format from Bank of Canada API');
    }

    console.log(`Retrieved ${data.observations.length} observations`);

    // Transform and store the data
    const now = new Date().toISOString();
    const bondYields = data.observations
      .filter(obs => obs.V36683 && obs.V36684 && obs.V36685 && obs.V36686) // Filter out incomplete data
      .map(obs => ({
        date: obs.d,
        yield_2yr: Number(obs.V36683),
        yield_5yr: Number(obs.V36684),
        yield_10yr: Number(obs.V36685),
        yield_30yr: Number(obs.V36686),
        last_update: now
      }));

    console.log(`Processing ${bondYields.length} valid records`);

    // Batch insert/update the data
    const { error: upsertError } = await supabaseClient
      .from('bond_yields')
      .upsert(bondYields, {
        onConflict: 'date',
        ignoreDuplicates: false
      });

    if (upsertError) {
      console.error('Database upsert error:', upsertError);
      throw upsertError;
    }

    console.log('Successfully updated bond yield data');

    return new Response(
      JSON.stringify({ 
        message: 'Bond yield data updated successfully',
        records: bondYields.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in update-bond-data function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
