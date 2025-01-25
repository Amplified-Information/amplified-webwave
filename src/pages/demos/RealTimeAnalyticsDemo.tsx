import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const RealTimeAnalyticsDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Real-time Analytics</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor and analyze data streams in real-time
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
              alt="Real-time Analytics Demo"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Coming Soon</h2>
              <p className="text-gray-600">
                Our real-time analytics demonstration is being fine-tuned. 
                Soon you'll be able to see live data analysis in action.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalyticsDemo;