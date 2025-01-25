import { Navigation } from "@/components/Navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DemoOverview = () => {
  const demos = [
    {
      title: "Data Integration",
      description: "Connect and synchronize data from multiple sources seamlessly"
    },
    {
      title: "Real-time Analytics",
      description: "Monitor and analyze data streams in real-time"
    },
    {
      title: "Security Features",
      description: "Explore our comprehensive security implementations"
    },
    {
      title: "Cloud Infrastructure",
      description: "Scale your infrastructure with cloud-native solutions"
    },
    {
      title: "Machine Learning",
      description: "Implement AI/ML models for predictive analytics"
    },
    {
      title: "Data Visualization",
      description: "Create interactive dashboards and reports"
    },
    {
      title: "API Integration",
      description: "Connect with external services through our API platform"
    },
    {
      title: "Automated Workflows",
      description: "Build and manage automated data processing pipelines"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Demo</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our platform's capabilities through these interactive demonstrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demos.map((demo, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{demo.title}</CardTitle>
                <CardDescription>{demo.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoOverview;