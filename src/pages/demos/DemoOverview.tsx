import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { useNavigate } from "react-router-dom";

const DemoOverview = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-50">
      <Menubar className="border-b px-6 py-3">
        <MenubarMenu>
          <MenubarTrigger>Categories</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => navigate("/demo/data-integration")}>
              Data Integration
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/demo/real-time-analytics")}>
              Real-time Analytics
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/demo/security-features")}>
              Security Features
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Features</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => navigate("/demo/cloud-infrastructure")}>
              Cloud Infrastructure
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/demo/machine-learning")}>
              Machine Learning
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/demo/data-visualization")}>
              Data Visualization
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Tools</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => navigate("/demo/api-integration")}>
              API Integration
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/demo/automated-workflows")}>
              Automated Workflows
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Interactive Demos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our platform's capabilities through these interactive demonstrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demos.map((demo) => (
              <Link to={demo.path} key={demo.path} className="group">
                <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:bg-primary/10">
                  <CardHeader>
                    <CardTitle>{demo.title}</CardTitle>
                    <CardDescription>{demo.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoOverview;