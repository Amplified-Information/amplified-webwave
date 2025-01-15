import { Database, Cloud, Shield, BarChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Data Architecture",
    description: "Design and implement scalable data infrastructure solutions",
    icon: Database,
    path: "/services/data-architecture",
  },
  {
    title: "Cloud Integration",
    description: "Seamless migration and management of cloud-based systems",
    icon: Cloud,
    path: "/services/cloud-integration",
  },
  {
    title: "Security Solutions",
    description: "Robust security measures to protect your valuable data",
    icon: Shield,
    path: "/services/security-solutions",
  },
  {
    title: "Analytics & Insights",
    description: "Transform raw data into actionable business intelligence",
    icon: BarChart,
    path: "/services/analytics-insights",
  },
];

export const Services = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Link key={service.title} to={service.path}>
              <Card className="border-2 border-gray-100 hover:border-primary transition-colors duration-300 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};