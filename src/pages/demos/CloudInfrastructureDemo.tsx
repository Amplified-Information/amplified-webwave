
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud } from "lucide-react";
import CloudGlobe from "@/components/CloudGlobe";
import { cloudLocations } from "@/data/cloudProviderLocations";

const CloudInfrastructureDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Cloud className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Cloud Infrastructure</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scale your infrastructure with cloud-native solutions
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <CloudGlobe />
            <div className="mt-6 space-y-4">
              <h2 className="text-2xl font-semibold">Global Cloud Provider Locations</h2>
              <p className="text-gray-600">
                Interactive 3D visualization of major cloud provider data centers and CDN edge locations.
                Includes AWS, Google Cloud, and Azure infrastructure points across the globe.
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
                <li>Interactive 3D globe visualization</li>
                <li>Real-time cloud provider location mapping</li>
                <li>CDN edge location performance metrics</li>
                <li>Region and availability zone overview</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CloudInfrastructureDemo;
