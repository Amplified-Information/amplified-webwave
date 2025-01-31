import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const DemoPages = () => {
  const demos = [
    {
      title: "Data Integration",
      description: "Connect and synchronize data from multiple sources seamlessly",
      path: "/demo/data-integration"
    },
    {
      title: "Real-time Analytics",
      description: "Monitor and analyze data streams in real-time",
      path: "/demo/real-time-analytics",
      isActive: true
    },
    {
      title: "Security Features",
      description: "Explore our comprehensive security implementations",
      path: "/demo/security-features"
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
      title: "API Integration",
      description: "Connect with external services through our API platform",
      path: "/demo/api-integration",
      isActive: true
    },
    {
      title: "Automated Workflows",
      description: "Build and manage automated data processing pipelines",
      path: "/demo/automated-workflows"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Interactive Demos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our platform's capabilities through these interactive demonstrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demos.map((demo) => (
            <Link 
              to={demo.path}
              key={demo.path} 
              className="group relative"
            >
              <Card className={`h-full transition-all duration-300 ${
                demo.isActive 
                  ? 'hover:shadow-lg hover:bg-[#F2FCE2]' 
                  : 'hover:shadow-lg hover:bg-primary/10'
              }`}>
                <CardHeader>
                  <CardTitle>{demo.title}</CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
                {!demo.isActive && (
                  <div className="absolute bottom-4 left-0 right-0 text-center text-sm font-medium text-gray-500">
                    Coming Soon
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