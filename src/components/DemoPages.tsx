
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface DemoPagesProps {
  showHeader?: boolean;
  className?: string;
}

export const DemoPages = ({ showHeader = true, className = "" }: DemoPagesProps) => {
  const demos = [
    {
      title: "Smart Garden Planning",
      description: "Plan and optimize your garden with AI-powered companion planting",
      path: "/demo/data-integration",
      isActive: true
    },
    {
      title: "Real-time Weather Analytics",
      description: "Monitor and analyze data streams in real-time",
      path: "/demo/real-time-analytics",
      isActive: true
    },
    {
      title: "Trade Data Analysis",
      description: "Explore international trade flows and patterns",
      path: "/demo/trade-data",
      status: "in development"
    },
    {
      title: "Cloud Infrastructure",
      description: "Scale your infrastructure with cloud-native solutions",
      path: "/demo/cloud-infrastructure"
    },
    {
      title: "Machine Learning",
      description: "Implement AI/ML models for predictive analytics",
      path: "/demo/machine-learning"
    },
    {
      title: "Data Visualization",
      description: "Create interactive dashboards and reports",
      path: "/demo/data-visualization"
    },
    {
      title: "Find a Mortgage that saves you money",
      description: "Connect with external services through our API platform",
      path: "/demo/api-integration",
      isActive: true
    },
    {
      title: "Find a Used Car with AI",
      description: "Let our AI crew help you find the perfect used car in Canada",
      path: "/demo/automated-workflows",
      status: "in development"
    },
    {
      title: "Supply Chain Optimization",
      description: "Streamline logistics and inventory management with AI",
      path: "/demo/supply-chain"
    },
    {
      title: "Predictive Maintenance",
      description: "Forecast equipment maintenance needs using IoT sensors",
      path: "/demo/predictive-maintenance"
    },
    {
      title: "Customer Segmentation",
      description: "Advanced customer analytics and behavior prediction",
      path: "/demo/customer-segmentation"
    },
    {
      title: "Energy Management",
      description: "Monitor and optimize energy consumption patterns",
      path: "/demo/energy-management"
    }
  ];

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-6">
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Interactive Demos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our platform's capabilities through these interactive demonstrations
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <Link 
              to={demo.path}
              key={demo.path} 
              className="group relative"
            >
              <Card className={`h-full transition-all duration-300 ${
                demo.status === "in development" 
                  ? 'hover:shadow-lg hover:bg-orange-50' 
                  : demo.isActive 
                    ? 'hover:shadow-lg hover:bg-[#F2FCE2]' 
                    : 'hover:shadow-lg hover:bg-primary/10'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {demo.isActive && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {demo.title}
                  </CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
                {!demo.isActive && !demo.status && (
                  <div className="absolute bottom-4 left-0 right-0 text-center text-sm font-medium text-gray-500">
                    Coming Soon
                  </div>
                )}
                {demo.status === "in development" && (
                  <div className="absolute bottom-4 left-0 right-0 text-center text-sm font-medium text-orange-600">
                    In Development
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

