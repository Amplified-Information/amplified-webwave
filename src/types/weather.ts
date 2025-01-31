export interface City {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  cityName: string;
  province: string;
  temperature: number;
  humidity: number;
}