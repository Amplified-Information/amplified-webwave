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
  { name: "Quebec City", province: "Quebec", latitude: 46.8139, longitude: -71.2080 },
  { name: "Hamilton", province: "Ontario", latitude: 43.2557, longitude: -79.8711 },
  { name: "Halifax", province: "Nova Scotia", latitude: 44.6488, longitude: -63.5752 },
  { name: "Victoria", province: "British Columbia", latitude: 48.4284, longitude: -123.3656 },
  { name: "St. John's", province: "Newfoundland", latitude: 47.5615, longitude: -52.7126 },
  { name: "Saskatoon", province: "Saskatchewan", latitude: 52.1332, longitude: -106.6700 },
  { name: "Regina", province: "Saskatchewan", latitude: 50.4452, longitude: -104.6189 },
  { name: "Charlottetown", province: "Prince Edward Island", latitude: 46.2382, longitude: -63.1311 },
  { name: "Fredericton", province: "New Brunswick", latitude: 45.9636, longitude: -66.6431 },
  { name: "Yellowknife", province: "Northwest Territories", latitude: 62.4540, longitude: -114.3718 },
  { name: "Whitehorse", province: "Yukon", latitude: 60.7212, longitude: -135.0568 },
  { name: "Iqaluit", province: "Nunavut", latitude: 63.7467, longitude: -68.5170 }
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
  );
};

export default CanadianCitiesWeather;