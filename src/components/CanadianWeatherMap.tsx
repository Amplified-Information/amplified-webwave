import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { WeatherData } from '@/types/weather';

interface CanadianWeatherMapProps {
  weatherData: WeatherData[];
}

const CanadianWeatherMap = ({ weatherData }: CanadianWeatherMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !weatherData.length) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z2V2NWowMGRqMmtvNWR4NHB0aXF5In0.qY4WMqXfGgxkUNyRzBFJPg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-96, 55], // Center of Canada
      zoom: 3
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each city
    weatherData.forEach((city) => {
      const { cityName, temperature, humidity } = city;
      const cityData = CANADIAN_CITIES.find(c => c.name === cityName);
      
      if (cityData) {
        // Create popup
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        }).setHTML(
          `<div class="p-2 text-sm">
            <h3 class="font-bold">${cityName}</h3>
            <p>Temperature: ${temperature}°C</p>
            <p>Humidity: ${humidity}%</p>
          </div>`
        );

        // Create marker
        const marker = new mapboxgl.Marker({
          color: temperature > 0 ? '#ef4444' : '#3b82f6'
        })
          .setLngLat([cityData.longitude, cityData.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        markers.current.push(marker);
        popups.current.push(popup);
      }
    });

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      popups.current.forEach(popup => popup.remove());
      map.current?.remove();
    };
  }, [weatherData]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-6">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default CanadianWeatherMap;