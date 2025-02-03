import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Use proper headers and follow redirects
    const response = await fetch(
      'https://comtradeapi.un.org/public/v1/preview/C/A/HS?freq=A&px=HS&ps=2022&r=124,842&p=124,842&rg=all&cc=AG,EN,MF',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        redirect: 'follow', // Explicitly follow redirects
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}, ${await response.text()}`)
    }

    const data = await response.json()
    console.log('Fetched trade data count:', data.data?.length || 0)

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format received from API')
    }

    // Transform the data
    const transformedData = data.data.map((item: any) => ({
      reporter_code: item.reporterCode?.toString() || '',
      reporter_desc: item.reporterDesc || '',
      partner_code: item.partnerCode?.toString() || '',
      partner_desc: item.partnerDesc || '',
      ref_year: parseInt(item.refYear) || 2022,
      trade_flow_code: parseInt(item.rgCode) || 0,
      trade_flow_desc: item.rgDesc || '',
      commodity_code: item.cmdCode?.toString() || '',
      commodity_desc: item.cmdDesc || '',
      qty: item.qty || null,
      qty_unit: item.qtyUnit || null,
      trade_value: parseFloat(item.primaryValue) || 0
    }))

    // Clear existing data
    const { error: deleteError } = await supabaseClient
      .from('trade_data')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
      console.error('Error deleting existing data:', deleteError)
      throw deleteError
    }

    // Insert new data
    const { error: insertError } = await supabaseClient
      .from('trade_data')
      .insert(transformedData)

    if (insertError) {
      console.error('Error inserting data:', insertError)
      throw insertError
    }

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
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})