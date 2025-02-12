
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockData {
  symbol: string;
  company_name: string | null;
  short_interest_ratio: number | null;
  relative_volume: number | null;
  price_momentum: number | null;
  rsi: number | null;
  days_to_cover: number | null;
  distance_from_high: number | null;
  volume_surge: number | null;
}

function calculateRSI(prices: number[]): number {
  if (prices.length < 14) return 0;
  
  const changes = prices.slice(1).map((price, index) => price - prices[index]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);
  
  const avgGain = gains.slice(0, 14).reduce((a, b) => a + b) / 14;
  const avgLoss = losses.slice(0, 14).reduce((a, b) => a + b) / 14;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

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

    // First, get stocks with high relative volume
    const topVolUrl = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const volResponse = await fetch(topVolUrl);
    const volData = await volResponse.json();
    
    const candidates: StockData[] = [];
    const processedSymbols = new Set();

    // Process most active stocks
    const activeStocks = [...(volData.top_gainers || []), ...(volData.most_actively_traded || [])];
    
    for (const stock of activeStocks) {
      if (processedSymbols.has(stock.ticker)) continue;
      processedSymbols.add(stock.ticker);
      
      console.log(`Analyzing ${stock.ticker}...`);
      
      try {
        const [overviewResponse, quoteResponse, timeSeriesResponse] = await Promise.all([
          fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock.ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`),
          fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`),
          fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`)
        ]);

        const [overviewData, quoteData, timeSeriesData] = await Promise.all([
          overviewResponse.json(),
          quoteResponse.json(),
          timeSeriesResponse.json()
        ]);

        if (!overviewData || !quoteData["Global Quote"] || !timeSeriesData["Time Series (Daily)"]) {
          console.log(`Skipping ${stock.ticker}: Incomplete data`);
          continue;
        }

        const quote = quoteData["Global Quote"];
        const timeSeries = timeSeriesData["Time Series (Daily)"];
        const timeSeriesDates = Object.keys(timeSeries).sort().reverse();
        
        // Calculate RSI
        const prices = timeSeriesDates.slice(0, 14).map(date => parseFloat(timeSeries[date]["4. close"]));
        const rsi = calculateRSI(prices);

        // Calculate volume metrics
        const current_volume = parseInt(quote["06. volume"]);
        const avg_volume = parseInt(overviewData.AverageVolume) || 0;
        const relative_volume = avg_volume > 0 ? current_volume / avg_volume : null;

        // Calculate price momentum
        const current_price = parseFloat(quote["05. price"]);
        const previous_close = parseFloat(quote["08. previous close"]);
        const price_momentum = ((current_price - previous_close) / previous_close) * 100;

        // Calculate distance from 52-week high
        const year_high = parseFloat(overviewData["52WeekHigh"]);
        const distance_from_high = year_high ? ((year_high - current_price) / year_high) * 100 : null;

        // Calculate days to cover (if short interest data is available)
        const short_interest = parseFloat(overviewData.ShortInterest) || 0;
        const days_to_cover = avg_volume > 0 ? short_interest / avg_volume : null;

        // Volume surge (comparing to 10-day average volume)
        const tenDayVolumes = timeSeriesDates.slice(0, 10).map(date => parseInt(timeSeries[date]["5. volume"]));
        const avgTenDayVolume = tenDayVolumes.reduce((a, b) => a + b, 0) / tenDayVolumes.length;
        const volume_surge = avgTenDayVolume > 0 ? current_volume / avgTenDayVolume : null;

        const stockData: StockData = {
          symbol: stock.ticker,
          company_name: overviewData.Name || null,
          short_interest_ratio: parseFloat(overviewData.ShortPercentFloat) || null,
          relative_volume,
          price_momentum,
          rsi,
          days_to_cover,
          distance_from_high,
          volume_surge
        };

        // Check for short squeeze potential
        const hasHighShortInterest = stockData.short_interest_ratio && stockData.short_interest_ratio > 20;
        const hasHighDaysToCover = stockData.days_to_cover && stockData.days_to_cover > 5;
        const hasStrongMomentum = stockData.rsi && stockData.rsi > 70;
        const hasVolumeSurge = stockData.volume_surge && stockData.volume_surge > 1.5;
        const isNearYearHigh = stockData.distance_from_high && stockData.distance_from_high < 10;

        if ((hasHighShortInterest || hasHighDaysToCover) && 
            (hasStrongMomentum || isNearYearHigh) && 
            hasVolumeSurge) {
          candidates.push(stockData);
          
          // Store in database
          const { error } = await supabaseClient
            .from('short_squeeze_candidates')
            .upsert([stockData], {
              onConflict: 'symbol',
              ignoreDuplicates: false
            });

          if (error) {
            console.error(`Error storing data for ${stock.ticker}:`, error);
          }
        }

      } catch (error) {
        console.error(`Error processing ${stock.ticker}:`, error);
      }

      // Respect Alpha Vantage's rate limit (5 requests per minute)
      await new Promise(resolve => setTimeout(resolve, 12000));
    }

    return new Response(
      JSON.stringify({ 
        message: 'Analysis complete', 
        candidates_found: candidates.length,
        candidates 
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
