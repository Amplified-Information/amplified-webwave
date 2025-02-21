
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
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check for existing data
    const { data: existingData, error: existingDataError } = await supabaseClient
      .from('bond_yields')
      .select('date')
      .order('date', { ascending: false })
      .limit(1);

    if (existingDataError) {
      throw new Error(`Failed to check existing data: ${existingDataError.message}`);
    }

    const endDate = new Date().toISOString().split('T')[0];
    let startDate;

    if (!existingData || existingData.length === 0) {
      // No existing data - fetch last 5 years
      console.log('No existing data found. Fetching historical data...');
      startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5))
        .toISOString().split('T')[0];
    } else {
      // Fetch only new data since last record
      startDate = new Date(existingData[0].date);
      startDate.setDate(startDate.getDate() + 1); // Start from next day
      startDate = startDate.toISOString().split('T')[0];
      
      if (startDate > endDate) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Data is already up to date',
            recordsProcessed: 0 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
    }

    console.log(`Fetching data from ${startDate} to ${endDate}`);

    // Fetch data from Bank of Canada API
    const response = await fetch(
      `https://www.bankofcanada.ca/valet/observations/V122531,V122533,V122539,V122543/json?start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) {
      throw new Error(`Bank of Canada API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.observations || !Array.isArray(data.observations)) {
      console.error('Unexpected data structure:', data);
      throw new Error('Invalid API response format');
    }

    // Transform the data
    const bondYields = data.observations
      .filter(obs => {
        const isValid = obs.d && 
          obs.V122531 !== undefined && // 2-year
          obs.V122533 !== undefined && // 5-year
          obs.V122539 !== undefined && // 10-year
          obs.V122543 !== undefined;   // 30-year
        
        if (!isValid) {
          console.log('Filtered out invalid observation:', obs);
        }
        return isValid;
      })
      .map(obs => ({
        date: obs.d,
        yield_2yr: Number(obs.V122531.v),
        yield_5yr: Number(obs.V122533.v),
        yield_10yr: Number(obs.V122539.v),
        yield_30yr: Number(obs.V122543.v),
        last_update: new Date().toISOString()
      }));

    console.log(`Processing ${bondYields.length} records`);

    if (bondYields.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No new data available',
          recordsProcessed: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Store in Supabase
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
