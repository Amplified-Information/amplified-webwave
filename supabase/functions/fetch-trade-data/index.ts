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

    // Fetch data from Comtrade API (using their sample API for demonstration)
    const response = await fetch(
      'https://comtradeapi.un.org/public/v1/preview/C/A/HS?freq=M&px=HS&ps=2022&r=124&p=842&rg=all&cc=TOTAL',
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
    const transformedData = data.data.map((item: any) => ({
      reporter_country: 'Canada',
      partner_country: 'United States',
      commodity_code: item.cmdCode || 'TOTAL',
      commodity_name: item.cmdDesc || 'Total Trade',
      trade_value: item.primaryValue || 0,
      trade_year: parseInt(item.period.substring(0, 4)),
      trade_flow: item.rgDesc,
    }))

    // Insert the transformed data into Supabase
    const { error } = await supabaseClient
      .from('trade_data')
      .insert(transformedData)

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Trade data updated successfully' }),
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