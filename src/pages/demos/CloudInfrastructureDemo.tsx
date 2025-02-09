
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud } from "lucide-react";
import CloudGlobe from "@/components/CloudGlobe";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const CloudInfrastructureDemo = () => {
  const { toast } = useToast();

  // Fetch cloud metrics from Supabase
  const { data: cloudMetrics } = useQuery({
    queryKey: ['cloudMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cloud_provider_metrics')
        .select('*')
      
      if (error) throw error
      return data
    }
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('cloud-metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cloud_provider_metrics'
        },
        (payload) => {
          toast({
            title: "Infrastructure Update",
            description: `${payload.new.provider} ${payload.new.location_name} metrics updated`,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [toast]);

  // Trigger metrics update every 5 minutes
  useEffect(() => {
    const updateMetrics = async () => {
      try {
        await supabase.functions.invoke('fetch-cloud-metrics')
      } catch (error) {
        console.error('Error updating metrics:', error)
      }
    }

    // Initial fetch
    updateMetrics()

    // Set up interval
    const interval = setInterval(updateMetrics, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Cloud className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Cloud Infrastructure</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time visualization of cloud infrastructure and performance metrics
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <CloudGlobe cloudMetrics={cloudMetrics} />
            <div className="mt-6 space-y-4">
              <h2 className="text-2xl font-semibold">Global Cloud Provider Locations</h2>
              <p className="text-gray-600">
                Live visualization of major cloud provider data centers and CDN edge locations.
                Includes real-time performance metrics and service health status.
              </p>
              
              <div className="flex gap-4 justify-center mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF9900' }}></div>
                  <span className="text-sm">AWS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF0000' }}></div>
                  <span className="text-sm">Google Cloud</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00A4EF' }}></div>
                  <span className="text-sm">Azure</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Features</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Real-time infrastructure health monitoring</li>
                <li>Live performance metrics and service status</li>
                <li>Server capacity and utilization tracking</li>
                <li>Sustainability and renewable energy metrics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CloudInfrastructureDemo;
