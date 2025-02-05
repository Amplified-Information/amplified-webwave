import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from './ui/alert';

const CanadianMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      if (!mapContainer.current || mapInitialized) return;

      try {
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .maybeSingle();

        if (secretError) {
          console.error('Error fetching Mapbox token:', secretError);
          throw new Error(`Failed to fetch Mapbox token: ${secretError.message}`);
        }

        if (!secretData?.value) {
          console.error('No Mapbox token found in secrets');
          throw new Error('Mapbox token not found in secrets');
        }

        mapboxgl.accessToken = secretData.value;

        if (!mounted) return;

        console.log('Creating new map instance');
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
          if (!mounted) return;
          
          console.log('Map loaded successfully');
          setIsLoading(false);
          setMapInitialized(true);
          
          map.current?.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          });

          map.current?.setTerrain({ 
            source: 'mapbox-dem', 
            exaggeration: 1.5 
          });
        });

      } catch (err) {
        console.error('Error initializing map:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize map');
          setIsLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      mounted = false;
      console.log('Cleaning up map instance');
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapInitialized]);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
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

export default CanadianMap;