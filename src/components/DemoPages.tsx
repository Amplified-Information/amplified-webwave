import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const DemoPages = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Interactive Demos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience our platform's capabilities firsthand through our interactive demonstrations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/demo/overview" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:bg-primary/10">
              <CardHeader>
                <CardTitle>Data Integration Demo</CardTitle>
                <CardDescription>
                  See how our platform seamlessly connects and synchronizes data from multiple sources
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/demo/overview" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:bg-primary/10">
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Explore our real-time analytics and visualization capabilities
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/demo/overview" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:bg-primary/10">
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
                <CardDescription>
                  Experience our comprehensive security implementations in action
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};