
import { CheckCircle, Wrench, Clock } from "lucide-react";
import { DemoSection } from "./demos/DemoSection";
import { AboutSection } from "./demos/AboutSection";
import type { Demo } from "./demos/types";

interface DemoPagesProps {
  showHeader?: boolean;
  className?: string;
}

export const DemoPages = ({ showHeader = true, className = "" }: DemoPagesProps) => {
  // Active demos
  const activeDemos: Demo[] = [
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
      description: "Analyze news articles for key insights and summaries",
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
      title: "Find a Mortgage That Saves You Money (with this API)",
      description: "Connect with external services through our API platform",
      path: "/demo/mortgage-api",
      isActive: true
    }
  ];

  // In development demos
  const inDevelopmentDemos: Demo[] = [
    {
      title: "Canadian Bond Yields",
      description: "Track and analyze Canadian government bond yields and market trends",
      path: "/demo/bond-yields",
      status: "in development"
    },
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
  const comingSoonDemos: Demo[] = [
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

        <AboutSection />

        <div className="space-y-12">
          <DemoSection
            title="Active Demos"
            icon={<CheckCircle className="w-6 h-6 text-green-500" />}
            demos={activeDemos}
            iconClassName="text-green-500"
            hoverClassName="hover:bg-[#F2FCE2]"
          />

          <DemoSection
            title="In Development"
            icon={<Wrench className="w-6 h-6 text-orange-500" />}
            demos={inDevelopmentDemos}
            iconClassName="text-orange-500"
            hoverClassName="hover:bg-orange-50"
          />

          <DemoSection
            title="Coming Soon"
            icon={<Clock className="w-6 h-6 text-gray-500" />}
            demos={comingSoonDemos}
            iconClassName="text-gray-500"
            hoverClassName="hover:bg-primary/10"
          />
        </div>
      </div>
    </section>
  );
};
