import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const DemoPages = () => {
  const demos = [
    {
      title: "Overview",
      description: "Get a comprehensive look at our platform capabilities",
      path: "/demo/overview"
    },
    {
      title: "Data Integration",
      description: "See how we seamlessly connect different data sources",
      path: "/demo/integration"
    },
    {
      title: "Analytics Dashboard",
      description: "Experience our powerful analytics visualization tools",
      path: "/demo/analytics"
    },
    {
      title: "Security Features",
      description: "Explore our robust security implementation",
      path: "/demo/security"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Demos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our platform's capabilities through these interactive demonstrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demos.map((demo) => (
            <Link to={demo.path} key={demo.path}>
              <Card className="h-full hover:shadow-lg transition-shadow">
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
  );
};