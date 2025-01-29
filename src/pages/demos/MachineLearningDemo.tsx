import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

const MachineLearningDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Machine Learning</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Implement AI/ML models for predictive analytics
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <img
              src="https://images.unsplash.com/photo-1501526029524-a8ea952b15be"
              alt="Machine Learning Demo"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Features Coming Soon</h2>
              <p className="text-gray-600">
                Our machine learning demonstration will showcase:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Predictive modeling and forecasting</li>
                <li>Natural language processing</li>
                <li>Automated model training</li>
                <li>AI-powered insights</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MachineLearningDemo;