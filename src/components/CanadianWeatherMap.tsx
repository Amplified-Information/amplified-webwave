import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { WeatherData } from '@/types/weather';
import { CANADIAN_CITIES } from '@/data/canadianCities';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface CanadianWeatherMapProps {
  weatherData: WeatherData[];
}

const CanadianWeatherMap = ({ weatherData }: CanadianWeatherMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);
  const [token, setToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !weatherData.length || !token) return;

    // Initialize map
    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-96, 62],
        zoom: 3.5,
        minZoom: 2,
        maxZoom: 9,
        bounds: [
          [-141, 41.7], // Southwest coordinates
          [-52, 83.3]  // Northeast coordinates
        ],
        maxBounds: [
          [-180, 30], // Southwest coordinates
          [-30, 90]  // Northeast coordinates
        ]
      });

      // Add terrain control
      map.current.on('load', () => {
        map.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        map.current?.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      setIsMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      markers.current.forEach(marker => marker.remove());
      popups.current.forEach(popup => popup.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!isMapInitialized || !map.current || !weatherData.length) return;

    // Clean up existing markers and popups
    markers.current.forEach(marker => marker.remove());
    popups.current.forEach(popup => popup.remove());
    markers.current = [];
    popups.current = [];

    // Add markers for each city
    weatherData.forEach((cityWeather) => {
      const cityData = CANADIAN_CITIES.find(c => c.name === cityWeather.cityName);
      
      if (cityData) {
        // Create popup
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25
        }).setHTML(
          `<div class="p-2 text-sm bg-white/90 backdrop-blur-sm rounded shadow-lg">
            <h3 class="font-bold text-gray-900">${cityWeather.cityName}</h3>
            <p class="text-gray-700">Temperature: ${cityWeather.temperature}°C</p>
            <p class="text-gray-700">Humidity: ${cityWeather.humidity}%</p>
          </div>`
        );

        // Create marker
        const marker = new mapboxgl.Marker({
          color: cityWeather.temperature > 0 ? '#ef4444' : '#3b82f6'
        })
          .setLngLat([cityData.longitude, cityData.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        // Show popup on hover
        const markerElement = marker.getElement();
        markerElement.addEventListener('mouseenter', () => popup.addTo(map.current!));
        markerElement.addEventListener('mouseleave', () => popup.remove());

        markers.current.push(marker);
        popups.current.push(popup);
      }
    });
  }, [weatherData, isMapInitialized]);

  return (
    <div className="space-y-4">
      {!isMapInitialized && (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your Mapbox public token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={initializeMap} disabled={!token}>
            Initialize Map
          </Button>
        </div>
      )}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default CanadianWeatherMap;