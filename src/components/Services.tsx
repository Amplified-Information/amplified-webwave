import { Database, Cloud, Shield, BarChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const services = [
  {
    title: "Data Architecture",
    description: "Design and implement scalable data infrastructure solutions",
    icon: Database,
  },
  {
    title: "Cloud Integration",
    description: "Seamless migration and management of cloud-based systems",
    icon: Cloud,
  },
  {
    title: "Security Solutions",
    description: "Robust security measures to protect your valuable data",
    icon: Shield,
  },
  {
    title: "Analytics & Insights",
    description: "Transform raw data into actionable business intelligence",
    icon: BarChart,
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
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="border-2 border-gray-100 hover:border-primary transition-colors duration-300"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};