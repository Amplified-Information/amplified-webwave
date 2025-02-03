import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch data from Comtrade API (public API endpoint)
    const response = await fetch(
      'https://comtradeapi.un.org/public/v1/preview/C/A/HS?freq=A&px=HS&ps=2022&r=124,842&p=124,842&rg=all&cc=AG,EN,MF',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Fetched trade data:', data)

    // Process and transform the data to match our new schema
    const transformedData = data.data.map((item: any) => ({
      reporter_code: item.reporterCode,
      reporter_desc: item.reporterDesc,
      partner_code: item.partnerCode,
      partner_desc: item.partnerDesc,
      ref_year: parseInt(item.refYear),
      trade_flow_code: item.rgCode,
      trade_flow_desc: item.rgDesc,
      commodity_code: item.cmdCode,
      commodity_desc: item.cmdDesc,
      qty: item.qty || null,
      qty_unit: item.qtyUnit || null,
      trade_value: item.primaryValue || 0
    }));

    // Clear existing data before inserting new data
    const { error: deleteError } = await supabaseClient
      .from('trade_data')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (deleteError) {
      throw deleteError;
    }

    // Insert the transformed data into Supabase
    const { error: insertError } = await supabaseClient
      .from('trade_data')
      .insert(transformedData);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ 
        message: 'Trade data updated successfully', 
        count: transformedData.length,
        sample: transformedData[0] 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})