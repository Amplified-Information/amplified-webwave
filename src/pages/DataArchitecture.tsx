import { Card, CardContent } from "@/components/ui/card";
import { Database, Server, Network, CircuitBoard } from "lucide-react";

const DataArchitecture = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">Data Architecture</h1>
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Database className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Scalable Infrastructure Design</h2>
                  <p className="text-muted-foreground">
                    We design and implement robust data architectures that grow with your business,
                    ensuring seamless scalability and optimal performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Server className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Data Modeling</h2>
                  <p className="text-muted-foreground">
                    Create efficient data models that accurately represent your business domain
                    and support your analytical needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Network className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">System Integration</h2>
                  <p className="text-muted-foreground">
                    Seamlessly connect different data sources and systems to create a unified
                    data ecosystem that drives business value.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <CircuitBoard className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Performance Optimization</h2>
                  <p className="text-muted-foreground">
                    Optimize your data infrastructure for maximum efficiency and minimal latency,
                    ensuring fast and reliable data access.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataArchitecture;