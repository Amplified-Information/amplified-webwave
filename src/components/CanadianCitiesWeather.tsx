import React from 'react';
import { useQuery } from '@tanstack/react-query';
import WeatherTable from './WeatherTable';
import ProvinceAveragesChart from './ProvinceAveragesChart';
import { CANADIAN_CITIES } from '@/data/canadianCities';
import { WeatherData } from '@/types/weather';

const fetchWeatherData = async (): Promise<WeatherData[]> => {
  const promises = CANADIAN_CITIES.map(async (city) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m`
    );
    const data = await response.json();
    return {
      cityName: city.name,
      province: city.province,
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m
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

  const getTemperatureExtremes = (data: WeatherData[]) => {
    const sortedByTemp = [...data].sort((a, b) => a.temperature - b.temperature);
    return {
      coldest: sortedByTemp[0],
      warmest: sortedByTemp[sortedByTemp.length - 1]
    };
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading weather data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading weather data</div>;
  }

  if (!weatherData) return null;

  const { coldest, warmest } = getTemperatureExtremes(weatherData);

  return (
    <div>
      <ProvinceAveragesChart weatherData={weatherData} />
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg">
          <span className="text-blue-600">The coldest city right now is {coldest.cityName} ({coldest.temperature}°C)</span>
        </div>
        <div className="text-lg">
          <span className="text-red-600">The warmest city right now is {warmest.cityName} ({warmest.temperature}°C)</span>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Real-time Canadian Cities Weather Data</h2>
      <div className="mt-8">
        <WeatherTable weatherData={weatherData} />
      </div>
    </div>
  );
};

export default CanadianCitiesWeather;