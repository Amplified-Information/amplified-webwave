import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DemoOverview = () => {
  const demos = [
    {
      title: "Data Integration",
      description: "Connect and synchronize data from multiple sources seamlessly",
      path: "/demo/data-integration"
    },
    {
      title: "Real-time Analytics",
      description: "Monitor and analyze data streams in real-time",
      path: "/demo/real-time-analytics"
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
      path: "/demo/api-integration"
    },
    {
      title: "Automated Workflows",
      description: "Build and manage automated data processing pipelines",
      path: "/demo/automated-workflows"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Demos</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our platform's capabilities through these interactive demonstrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demos.map((demo) => (
            <Link to={demo.path} key={demo.path}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{demo.title}</CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoOverview;