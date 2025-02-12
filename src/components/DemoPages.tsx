import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle, Wrench, Clock, FileSearch } from "lucide-react";

interface DemoPagesProps {
  showHeader?: boolean;
  className?: string;
}

export const DemoPages = ({ showHeader = true, className = "" }: DemoPagesProps) => {
  // Active demos
  const activeDemos = [
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
      title: "News Article Analysis with AI",
      description: "Analyze news articles with AI for key insights and summaries",
      path: "/demo/machine-learning",
      isActive: true
    },
    {
      title: "Article Content Extractor",
      description: "Extract and analyze content from any article URL",
      path: "/demo/article-extractor",
      isActive: true
    },
    {
      title: "Find A Mortgage That Saves You Money",
      description: "Connect with external services through our API platform",
      path: "/demo/api-integration",
      isActive: true
    }
  ];

  // In development demos
  const inDevelopmentDemos = [
    {
      title: "Trade Data Analysis",
      description: "Explore international trade flows and patterns",
      path: "/demo/trade-data",
      status: "in development"
    },
    {
      title: "Short Squeeze Finder",
      description: "Identify potential short squeeze opportunities in the market",
      path: "/demo/short-squeeze",
      status: "in development"
    },
    {
      title: "Find a Used Car with AI",
      description: "Let our AI crew help you find the perfect used car in Canada",
      path: "/demo/automated-workflows",
      status: "in development"
    },
    {
      title: "Data Visualization Sandbox",
      description: "Create interactive dashboards and reports",
      path: "/demo/data-visualization",
      status: "in development"
    },
    {
      title: "Investment Research",
      description: "AI-powered investment research and analysis platform",
      path: "/demo/investment-research",
      status: "in development"
    }
  ];

  // Coming soon demos
  const comingSoonDemos = [
    {
      title: "Cloud Infrastructure",
      description: "Scale your infrastructure with cloud-native solutions",
      path: "/demo/cloud-infrastructure"
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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About This Site</CardTitle>
            <CardDescription>Welcome to our interactive demonstration platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This demo section showcases our various capabilities and solutions through hands-on, interactive examples. 
              Each demo is carefully crafted to demonstrate specific features and functionalities of our platform. 
              From AI-powered garden planning to real-time analytics and financial tools, you can explore and 
              experience our technology firsthand. Select any demo below to get started.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-12">
          {/* Active Demos Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Active Demos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeDemos.map((demo) => (
                <Link 
                  to={demo.path}
                  key={demo.path} 
                  className="group relative"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:bg-[#F2FCE2]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        {demo.title}
                      </CardTitle>
                      <CardDescription>{demo.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* In Development Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-orange-500" />
              In Development
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inDevelopmentDemos.map((demo) => (
                <Link 
                  to={demo.path}
                  key={demo.path} 
                  className="group relative"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:bg-orange-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-orange-500" />
                        {demo.title}
                      </CardTitle>
                      <CardDescription>{demo.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Coming Soon Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-gray-500" />
              Coming Soon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonDemos.map((demo) => (
                <Link 
                  to={demo.path}
                  key={demo.path} 
                  className="group relative"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:bg-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        {demo.title}
                      </CardTitle>
                      <CardDescription>{demo.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
