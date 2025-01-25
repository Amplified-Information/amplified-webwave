import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const CloudInfrastructureDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Cloud Infrastructure</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scale your infrastructure with cloud-native solutions
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Cloud Infrastructure Demo"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Coming Soon</h2>
              <p className="text-gray-600">
                Our cloud infrastructure demonstration is being configured. 
                Check back soon to explore our scalable cloud solutions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CloudInfrastructureDemo;