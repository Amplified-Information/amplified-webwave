import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WeatherData } from '@/types/weather';

interface WeatherTableProps {
  weatherData: WeatherData[];
}

const WeatherTable = ({ weatherData }: WeatherTableProps) => {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>City</TableHead>
            <TableHead>Province</TableHead>
            <TableHead>Temperature (°C)</TableHead>
            <TableHead>Humidity (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weatherData?.map((city) => (
            <TableRow key={city.cityName}>
              <TableCell className="font-medium">{city.cityName}</TableCell>
              <TableCell>{city.province}</TableCell>
              <TableCell>{city.temperature}°C</TableCell>
              <TableCell>{city.humidity}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WeatherTable;