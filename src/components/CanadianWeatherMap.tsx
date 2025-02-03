import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { WeatherData } from '@/types/weather';
import { CANADIAN_CITIES } from '@/data/canadianCities';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from './ui/alert';

interface CanadianWeatherMapProps {
  weatherData: WeatherData[];
}

const CanadianWeatherMap = ({ weatherData }: CanadianWeatherMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeMap = async () => {
    if (!mapContainer.current || !weatherData.length) {
      console.log('Container or weather data not ready:', {
        container: !!mapContainer.current,
        weatherDataLength: weatherData.length
      });
      return;
    }

    try {
      console.log('Fetching Mapbox token...');
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'MAPBOX_PUBLIC_TOKEN')
        .single();

      if (secretError) {
        console.error('Supabase error:', secretError);
        throw new Error(`Failed to fetch Mapbox token: ${secretError.message}`);
      }
      
      if (!secretData?.value) {
        console.error('No token found in secrets');
        throw new Error('Mapbox token not found in secrets');
      }

      console.log('Token retrieved successfully');

      // Initialize map
      mapboxgl.accessToken = secretData.value;
      
      console.log('Initializing Mapbox map...');
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
        console.log('Map loaded, adding terrain...');
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

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError(`Map error: ${e.error.message}`);
      });

      setIsLoading(false);
      addMarkersToMap();
      console.log('Map initialization complete');
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
      setIsLoading(false);
    }
  };

  const addMarkersToMap = () => {
    if (!map.current || !weatherData.length) return;

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
  };

  useEffect(() => {
    console.log('Component mounted, initializing map...');
    initializeMap();
    return () => {
      console.log('Component unmounting, cleaning up...');
      markers.current.forEach(marker => marker.remove());
      popups.current.forEach(popup => popup.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !error) {
      addMarkersToMap();
    }
  }, [weatherData, isLoading]);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default CanadianWeatherMap;