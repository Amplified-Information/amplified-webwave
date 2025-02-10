
export interface City {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  cityname: string;  // Changed from cityName to match DB
  province: string;
  temperature: number;
  humidity: number;
}
