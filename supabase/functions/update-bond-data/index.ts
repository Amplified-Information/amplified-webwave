
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

    // Step 1: Make a test request to the Bank of Canada API
    const testEndDate = new Date().toISOString().split('T')[0];
    const testStartDate = '2024-01-01';
    
    console.log(`Making test request for date range: ${testStartDate} to ${testEndDate}`);
    
    const testResponse = await fetch(
      `https://www.bankofcanada.ca/valet/observations/group/GOVERNMENT_BOND_YIELDS/json?start_date=${testStartDate}&end_date=${testEndDate}`
    );

    if (!testResponse.ok) {
      throw new Error(`Test request failed: ${testResponse.status} ${testResponse.statusText}`);
    }

    const testData = await testResponse.json();
    console.log('Raw API Response:', JSON.stringify(testData, null, 2));

    // Step 2: Fetch full dataset
    const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5))
      .toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    console.log(`Fetching full dataset from ${startDate} to ${endDate}`);

    const response = await fetch(
      `https://www.bankofcanada.ca/valet/observations/group/GOVERNMENT_BOND_YIELDS/json?start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) {
      throw new Error(`Bank of Canada API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.observations || !Array.isArray(data.observations)) {
      console.error('Unexpected data structure:', data);
      throw new Error('Invalid API response format');
    }

    // Step 3: Transform the data
    console.log('Sample observation:', data.observations[0]);
    
    const bondYields = data.observations
      .filter(obs => {
        const isValid = obs.d && 
          obs["2YR.1300"] !== undefined && // 2-year
          obs["5YR.1300"] !== undefined && // 5-year
          obs["10YR.1300"] !== undefined && // 10-year
          obs["30YR.1300"] !== undefined;   // 30-year (long-term)
        
        if (!isValid) {
          console.log('Filtered out invalid observation:', obs);
        }
        return isValid;
      })
      .map(obs => {
        const yield_2yr = Number(obs["2YR.1300"].v);
        const yield_5yr = Number(obs["5YR.1300"].v);
        const yield_10yr = Number(obs["10YR.1300"].v);
        const yield_30yr = Number(obs["30YR.1300"].v);
        
        // Log any potential parsing issues
        if (isNaN(yield_2yr) || isNaN(yield_5yr) || isNaN(yield_10yr) || isNaN(yield_30yr)) {
          console.log('Warning: NaN values in observation:', obs);
        }
        
        return {
          date: obs.d,
          yield_2yr,
          yield_5yr,
          yield_10yr,
          yield_30yr,
          last_update: new Date().toISOString()
        };
      });

    console.log(`Processed ${bondYields.length} records`);
    console.log('Sample processed record:', bondYields[0]);

    if (bondYields.length === 0) {
      throw new Error('No valid records found in API response');
    }

    // Step 4: Store in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Attempting to store data in Supabase...');

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
