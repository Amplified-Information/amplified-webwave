import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface City {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
}

const CANADIAN_CITIES: City[] = [
  { name: "Toronto", province: "Ontario", latitude: 43.6532, longitude: -79.3832 },
  { name: "Montreal", province: "Quebec", latitude: 45.5017, longitude: -73.5673 },
  { name: "Vancouver", province: "British Columbia", latitude: 49.2827, longitude: -123.1207 },
  { name: "Calgary", province: "Alberta", latitude: 51.0447, longitude: -114.0719 },
  { name: "Ottawa", province: "Ontario", latitude: 45.4215, longitude: -75.6972 },
  { name: "Edmonton", province: "Alberta", latitude: 53.5461, longitude: -113.4938 },
  { name: "Winnipeg", province: "Manitoba", latitude: 49.8951, longitude: -97.1384 },
  { name: "Halifax", province: "Nova Scotia", latitude: 44.6488, longitude: -63.5752 },
  { name: "St. John's", province: "Newfoundland", latitude: 47.5615, longitude: -52.7126 },
  { name: "Regina", province: "Saskatchewan", latitude: 50.4452, longitude: -104.6189 }
];

interface WeatherData {
  cityName: string;
  province: string;
  temperature: number;
}

const fetchWeatherData = async (): Promise<WeatherData[]> => {
  const promises = CANADIAN_CITIES.map(async (city) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m`
    );
    const data = await response.json();
    return {
      cityName: city.name,
      province: city.province,
      temperature: data.current.temperature_2m,
    };
  });

  return Promise.all(promises);
};

const CanadianCitiesWeather = () => {
  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ['canadianWeather'],
    queryFn: fetchWeatherData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading weather data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading weather data</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Temperature (°C)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weatherData?.map((city) => (
              <TableRow key={city.cityName}>
                <TableCell className="font-medium">{city.cityName}</TableCell>
                <TableCell>{city.province}</TableCell>
                <TableCell>{city.temperature}°C</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="relative w-full h-[400px] rounded-lg border overflow-hidden">
        <svg
          viewBox="0 0 1000 800"
          className="w-full h-full"
          style={{ background: '#f0f9ff' }}
        >
          {/* Simplified map of Canada */}
          <path
            d="M50,400 C100,350 200,300 300,250 C400,200 500,150 600,200 C700,250 800,300 900,350 L950,750 L50,750 Z"
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth="2"
          />
          
          {weatherData?.map((city, index) => {
            const x = CANADIAN_CITIES[index].longitude * -5 + 500;
            const y = CANADIAN_CITIES[index].latitude * -8 + 800;
            
            return (
              <g key={city.cityName} transform={`translate(${x},${y})`}>
                <circle r="5" fill="#6E59A5" />
                <text
                  x="10"
                  y="5"
                  fontSize="12"
                  fill="#374151"
                  className="font-medium"
                >
                  {city.cityName} ({city.temperature}°C)
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default CanadianCitiesWeather;