import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { WeatherData } from '@/types/weather';

const PROVINCE_ORDER = [
  "British Columbia",
  "Yukon",
  "Northwest Territories",
  "Alberta",
  "Saskatchewan",
  "Manitoba",
  "Nunavut",
  "Ontario",
  "Quebec",
  "New Brunswick",
  "Nova Scotia",
  "Prince Edward Island",
  "Newfoundland"
];

interface ProvinceAveragesChartProps {
  weatherData: WeatherData[];
}

const ProvinceAveragesChart = ({ weatherData }: ProvinceAveragesChartProps) => {
  const provinceAverages = useMemo(() => {
    const provinceData = PROVINCE_ORDER.map(province => {
      const provinceCities = weatherData.filter(city => city.province === province);
      if (provinceCities.length === 0) return null;

      const avgTemp = provinceCities.reduce((sum, city) => sum + city.temperature, 0) / provinceCities.length;
      const avgHumidity = provinceCities.reduce((sum, city) => sum + city.humidity, 0) / provinceCities.length;

      return {
        province,
        averageTemperature: Number(avgTemp.toFixed(1)),
        averageHumidity: Number(avgHumidity.toFixed(1))
      };
    }).filter(data => data !== null);

    return provinceData;
  }, [weatherData]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Real-time Aggregate Provincial Weather</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={provinceAverages}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 70
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="province"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="averageTemperature"
              name="Avg Temperature (°C)"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="averageHumidity"
              name="Avg Humidity (%)"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProvinceAveragesChart;