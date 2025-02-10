
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import CanadianCitiesWeather from "@/components/CanadianCitiesWeather";
import CanadianWeatherMap from "@/components/CanadianWeatherMap";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WeatherData } from "@/types/weather";
import { Alert, AlertDescription } from "@/components/ui/alert";

const fetchWeatherData = async (): Promise<WeatherData[]> => {
  const { data, error } = await supabase
    .from('weather_data')
    .select('*')
    .order('cityName', { ascending: true });

  if (error) {
    throw new Error('Failed to fetch weather data');
  }

  return data || [];
};

const RealTimeAnalyticsDemo = () => {
  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ['weather-data'],
    queryFn: fetchWeatherData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <ChartBar className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Real-time Analytics</h1>
          <div className="max-w-3xl mx-auto space-y-4 text-gray-600">
            <p className="text-lg">
              This demo showcases real-time data processing and visualization capabilities using live weather data from across Canada. 
              The dashboard updates automatically every 5 minutes, displaying current temperatures and humidity levels for major Canadian cities.
            </p>
            <p className="text-lg">
              Features include dynamic temperature extremes tracking, provincial averages visualization, and a sortable data table - 
              demonstrating our platform's ability to handle live data streams, perform real-time calculations, and present insights through 
              interactive visualizations.
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>
              Failed to load weather data. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-8">
          <CardContent className="p-6">
            {!isLoading && weatherData && <CanadianWeatherMap weatherData={weatherData} />}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <CanadianCitiesWeather />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalyticsDemo;
