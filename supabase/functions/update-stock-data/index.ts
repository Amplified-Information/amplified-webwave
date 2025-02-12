
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('Alpha Vantage API key not found');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Example: Fetch data for S&P 500 companies (you would need to maintain a list)
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];
    
    for (const symbol of symbols) {
      const overview = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      ).then(res => res.json());

      if (overview && overview.Symbol) {
        const stockData = {
          symbol: overview.Symbol,
          company_name: overview.Name,
          sector: overview.Sector,
          industry: overview.Industry,
          market_cap: parseFloat(overview.MarketCapitalization),
          pe_ratio: parseFloat(overview.PERatio),
          price_to_book: parseFloat(overview.PriceToBookRatio),
          dividend_yield: parseFloat(overview.DividendYield),
          fifty_day_ma: parseFloat(overview['50DayMovingAverage']),
          two_hundred_day_ma: parseFloat(overview['200DayMovingAverage']),
          year_high: parseFloat(overview['52WeekHigh']),
          year_low: parseFloat(overview['52WeekLow']),
          volume: parseInt(overview.Volume),
          avg_volume: parseInt(overview.AverageVolume),
        };

        const { error } = await supabaseClient
          .from('stock_screener')
          .upsert([stockData], {
            onConflict: 'symbol'
          });

        if (error) {
          console.error(`Error updating data for ${symbol}:`, error);
        }
      }

      // Respect Alpha Vantage's rate limit (5 requests per minute)
      await new Promise(resolve => setTimeout(resolve, 12000));
    }

    return new Response(
      JSON.stringify({ message: 'Stock data updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
