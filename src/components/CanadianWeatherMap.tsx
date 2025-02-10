
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { WeatherData } from '@/types/weather';
import { CANADIAN_CITIES } from '@/data/canadianCities';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from './ui/alert';
import { useQuery } from '@tanstack/react-query';
import { useToast } from './ui/use-toast';

interface CanadianWeatherMapProps {
  weatherData: WeatherData[];
}

const fetchMapboxToken = async () => {
  const { data, error } = await supabase
    .from('secrets')
    .select('value')
    .eq('name', 'MAPBOX_PUBLIC_TOKEN')
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch Mapbox token:', error);
    throw new Error(`Failed to fetch Mapbox token: ${error.message}`);
  }

  if (!data?.value) {
    console.error('Mapbox token not found in Supabase secrets');
    throw new Error('Mapbox token not found in database');
  }

  return data.value;
};

const CanadianWeatherMap = ({ weatherData }: CanadianWeatherMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const { toast } = useToast();

  const { data: mapboxToken, isLoading, error } = useQuery({
    queryKey: ['mapbox-token'],
    queryFn: fetchMapboxToken,
    retry: 1,
    meta: {
      onSettled: (_, error) => {
        if (error) {
          toast({
            variant: "destructive",
            title: "Error loading map",
            description: error instanceof Error ? error.message : 'Failed to initialize map'
          });
        }
      }
    }
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapInitialized) return;

    try {
      console.log('Initializing map with token');
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-96, 62],
        zoom: 3.5,
        minZoom: 2,
        maxZoom: 9,
        bounds: [
          [-141, 41.7],
          [-52, 83.3]
        ],
        maxBounds: [
          [-180, 30],
          [-30, 90]
        ]
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapInitialized(true);
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      toast({
        variant: "destructive",
        title: "Map Error",
        description: err instanceof Error ? err.message : 'Failed to initialize map'
      });
    }

    return () => {
      console.log('Cleaning up map instance');
      markers.current.forEach(marker => marker.remove());
      popups.current.forEach(popup => popup.remove());
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      setMapInitialized(false);
    };
  }, [mapboxToken, mapInitialized, toast]);

  // Add markers when weather data changes
  useEffect(() => {
    if (!map.current || !mapInitialized || !weatherData.length) return;

    console.log('Adding markers to map:', weatherData.length);
    
    // Clear existing markers and popups
    markers.current.forEach(marker => marker.remove());
    popups.current.forEach(popup => popup.remove());
    markers.current = [];
    popups.current = [];

    weatherData.forEach((cityWeather) => {
      const cityData = CANADIAN_CITIES.find(c => c.name === cityWeather.cityname);
      
      if (cityData) {
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25
        }).setHTML(
          `<div class="p-2 text-sm bg-white/90 backdrop-blur-sm rounded shadow-lg">
            <h3 class="font-bold text-gray-900">${cityWeather.cityname}</h3>
            <p class="text-gray-700">Temperature: ${cityWeather.temperature}°C</p>
            <p class="text-gray-700">Humidity: ${cityWeather.humidity}%</p>
          </div>`
        );

        const marker = new mapboxgl.Marker({
          color: cityWeather.temperature > 0 ? '#ef4444' : '#3b82f6'
        })
          .setLngLat([cityData.longitude, cityData.latitude])
          .setPopup(popup)
          .addTo(map.current);

        const markerElement = marker.getElement();
        markerElement.addEventListener('mouseenter', () => popup.addTo(map.current!));
        markerElement.addEventListener('mouseleave', () => popup.remove());

        markers.current.push(marker);
        popups.current.push(popup);
      }
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      popups.current.forEach(popup => popup.remove());
    };
  }, [weatherData, mapInitialized]);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to initialize map'}
          <div className="mt-2 text-sm">
            Please ensure the MAPBOX_PUBLIC_TOKEN is set in your Supabase secrets.
          </div>
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
