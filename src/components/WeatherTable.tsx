// This code creates a reusable WeatherTable component that displays weather data in a sortable table format. 
// It includes features like optional checkboxes for row selection, sortable columns, and dynamic rendering based on the provided props. 
// The component uses various UI components from a custom UI library and handles sorting and selection logic internally.

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { WeatherData } from '@/types/weather';
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define props interface for WeatherTable component
interface WeatherTableProps {
  weatherData: WeatherData[];
  selectedItems?: string[];
  onSelectionChange?: (items: string[]) => void;
  showCheckboxes?: boolean;
}

// Define types for sorting
type SortField = 'cityName' | 'province' | 'temperature' | 'humidity';
type SortDirection = 'asc' | 'desc';

const WeatherTable = ({ 
  weatherData, 
  selectedItems = [], 
  onSelectionChange,
  showCheckboxes = false 
}: WeatherTableProps) => {
  // State for sorting
  const [sortField, setSortField] = useState<SortField>('cityName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Handle sorting when a column header is clicked
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If the same field is clicked, toggle the sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If a new field is clicked, set it as the sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (cityName: string) => {
    if (!onSelectionChange) return;
    
    const newSelection = selectedItems.includes(cityName)
      ? selectedItems.filter(item => item !== cityName)
      : [...selectedItems, cityName];
    
    onSelectionChange(newSelection);
  };

  // Sort the data based on the current sort field and direction
  const sortedData = [...weatherData].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    if (sortField === 'temperature' || sortField === 'humidity') {
      return (a[sortField] - b[sortField]) * multiplier;
    }
    
    return a[sortField].localeCompare(b[sortField]) * multiplier;
  });

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render checkbox column if showCheckboxes is true */}
            {showCheckboxes && <TableHead className="w-[50px]" />}
            {/* Render sortable column headers */}
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('cityName')}
                className="h-8 w-full flex items-center justify-between"
              >
                City
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('province')}
                className="h-8 w-full flex items-center justify-between"
              >
                Province
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('temperature')}
                className="h-8 w-full flex items-center justify-between"
              >
                Temperature (°C)
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('humidity')}
                className="h-8 w-full flex items-center justify-between"
              >
                Humidity (%)
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Render table rows with sorted data */}
          {sortedData.map((city) => (
            <TableRow key={city.cityName}>
              {/* Render checkbox if showCheckboxes is true */}
              {showCheckboxes && (
                <TableCell className="w-[50px]">
                  <Checkbox
                    checked={selectedItems.includes(city.cityName)}
                    onCheckedChange={() => handleCheckboxChange(city.cityName)}
                  />
                </TableCell>
              )}
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