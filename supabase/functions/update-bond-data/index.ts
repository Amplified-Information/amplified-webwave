
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BondYieldResponse {
  observations: {
    d: string;  // date
    V36683: number; // 2-year
    V36684: number; // 5-year
    V36685: number; // 10-year
    V36686: number; // 30-year
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch data from Bank of Canada API
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
      .toISOString().split('T')[0];

    const response = await fetch(
      `https://www.bankofcanada.ca/valet/observations/group/bond_yields/json?start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: BondYieldResponse = await response.json();
    
    // Transform and store the data
    const now = new Date().toISOString();
    const bondYields = data.observations.map(obs => ({
      date: obs.d,
      yield_2yr: obs.V36683,
      yield_5yr: obs.V36684,
      yield_10yr: obs.V36685,
      yield_30yr: obs.V36686,
      last_update: now
    }));

    // Batch insert/update the data
    const { error } = await supabaseClient
      .from('bond_yields')
      .upsert(
        bondYields,
        { onConflict: 'date' }
      );

    if (error) {
      throw error;
    }

    console.log(`Successfully updated ${bondYields.length} bond yield records`);

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
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
