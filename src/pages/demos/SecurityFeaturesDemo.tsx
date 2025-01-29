import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

const SecurityFeaturesDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Security Features</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive security implementations
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <img
              src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb"
              alt="Security Features Demo"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Features Coming Soon</h2>
              <p className="text-gray-600">
                Our security features demonstration will showcase:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Advanced encryption protocols</li>
                <li>Multi-factor authentication</li>
                <li>Access control and permissions</li>
                <li>Security audit logging</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityFeaturesDemo;