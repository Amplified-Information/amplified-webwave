import React from 'react';
import { useQuery } from '@tanstack/react-query';
import WeatherTable from './WeatherTable';
import ProvinceAveragesChart from './ProvinceAveragesChart';
import CanadianMap from './CanadianMap';
import { CANADIAN_CITIES } from '@/data/canadianCities';
import { WeatherData } from '@/types/weather';
import { Thermometer } from 'lucide-react';
import { format } from 'date-fns';
import { PROVINCIAL_FLAGS } from '@/data/provincialFlags';
import { Table, TableBody, TableCell, TableRow } from './ui/table';

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20"></div>
          <div className="text-lg">Loading weather data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading weather data</div>;
  }

  if (!weatherData) return null;

  const { coldest, warmest } = getTemperatureExtremes(weatherData);
  const currentTime = format(new Date(), "MMMM d, yyyy 'at' h:mm aa");

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="rounded-lg bg-white/50 dark:bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm">
        <CanadianMap />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow-lg animate-fadeIn transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-4">
            <Thermometer className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Coldest City in Canada Right Now</h3>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="border-0">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{coldest.cityName}</div>
                    <div className="text-xl text-blue-500">{coldest.temperature}°C</div>
                  </div>
                </TableCell>
                <TableCell className="border-0 text-right">
                  <div className="flex flex-col items-end">
                    {PROVINCIAL_FLAGS[coldest.province] && (
                      <img 
                        src={PROVINCIAL_FLAGS[coldest.province]} 
                        alt={`${coldest.province} flag`}
                        className="h-16 w-24 object-cover rounded shadow-sm"
                        onError={(e) => {
                          console.error('Error loading flag:', e.currentTarget.src);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="text-sm text-blue-400 mt-2">{coldest.province}</div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="p-6 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 shadow-lg animate-fadeIn transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-4">
            <Thermometer className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Warmest City in Canada Right Now</h3>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="border-0">
                  <div>
                    <div className="text-3xl font-bold text-red-600">{warmest.cityName}</div>
                    <div className="text-xl text-red-500">{warmest.temperature}°C</div>
                  </div>
                </TableCell>
                <TableCell className="border-0 text-right">
                  <div className="flex flex-col items-end">
                    {PROVINCIAL_FLAGS[warmest.province] && (
                      <img 
                        src={PROVINCIAL_FLAGS[warmest.province]} 
                        alt={`${warmest.province} flag`}
                        className="h-16 w-24 object-cover rounded shadow-sm"
                        onError={(e) => {
                          console.error('Error loading flag:', e.currentTarget.src);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="text-sm text-red-400 mt-2">{warmest.province}</div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="rounded-lg bg-white/50 dark:bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
        <ProvinceAveragesChart weatherData={weatherData} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Real-time Canadian Cities Weather Data as of {currentTime}</h2>
        <div className="rounded-lg bg-white/50 dark:bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm">
          <WeatherTable weatherData={weatherData} />
        </div>
      </div>
    </div>
  );
};

export default CanadianCitiesWeather;