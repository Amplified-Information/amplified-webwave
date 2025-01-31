import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { WeatherData } from '@/types/weather';

interface TemperatureHeatMapProps {
  weatherData: WeatherData[];
}

const TemperatureHeatMap = ({ weatherData }: TemperatureHeatMapProps) => {
  const heatMapData = useMemo(() => {
    return weatherData.map((city, index) => ({
      x: index % 5, // Create a grid layout
      y: Math.floor(index / 5),
      z: city.temperature,
      name: city.cityName,
      province: city.province,
    }));
  }, [weatherData]);

  const minTemp = Math.min(...weatherData.map(city => city.temperature));
  const maxTemp = Math.max(...weatherData.map(city => city.temperature));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Temperature Heat Map</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <XAxis type="number" dataKey="x" name="grid" hide />
            <YAxis type="number" dataKey="y" name="grid" hide />
            <ZAxis
              type="number"
              dataKey="z"
              range={[400, 2000]}
              name="temperature"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 rounded shadow-lg border">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-sm text-gray-600">{data.province}</p>
                      <p className="text-sm">
                        Temperature: {data.z}°C
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              data={heatMapData}
              fill="#8884d8"
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureHeatMap;