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

    // Process and transform the data
    const transformedData = data.data.map((item: any) => {
      const isCanada = item.reporterCode === '124';
      return {
        reporter_country: isCanada ? 'Canada' : 'United States',
        partner_country: isCanada ? 'United States' : 'Canada',
        commodity_code: item.cmdCode,
        commodity_name: item.cmdDesc,
        trade_value: item.primaryValue || 0,
        trade_year: parseInt(item.refYear),
        trade_flow: item.rgDesc,
      };
    });

    // Insert the transformed data into Supabase
    const { error } = await supabaseClient
      .from('trade_data')
      .insert(transformedData)

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Trade data updated successfully', count: transformedData.length }),
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