
import { Card, CardContent } from "@/components/ui/card";
import { Database, Server, Network, CircuitBoard, FileJson } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const DataArchitecture = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
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
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Horizontal Scalability</strong> – Ability to add more nodes to distribute load</li>
                    <li><strong>High Availability</strong> – Ensuring continuous system operation with minimal downtime</li>
                    <li><strong>Fault Tolerance</strong> – Graceful handling of system failures and data recovery</li>
                    <li><strong>Load Balancing</strong> – Efficient distribution of workloads across resources</li>
                  </ul>
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
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Normalization</strong> – Organizing data to reduce redundancy and improve integrity</li>
                    <li><strong>Entity Relationships</strong> – Clear definition of connections between data entities</li>
                    <li><strong>Data Consistency</strong> – Maintaining uniform data representation across systems</li>
                    <li><strong>Extensibility</strong> – Allowing for future additions without major restructuring</li>
                  </ul>
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
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>API Management</strong> – Standardized interfaces for system communication</li>
                    <li><strong>Data Synchronization</strong> – Maintaining consistency across integrated systems</li>
                    <li><strong>Error Handling</strong> – Robust mechanisms for handling integration failures</li>
                    <li><strong>Monitoring</strong> – Real-time visibility into integration performance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <FileJson className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Open Data Standards</h2>
                  <p className="text-muted-foreground">
                    Key characteristics of open data standards include:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Interoperability</strong> – Ensuring data can be seamlessly exchanged and integrated across diverse systems and applications.</li>
                    <li><strong>Transparency</strong> – Providing clear documentation and open access to data structures and methodologies.</li>
                    <li><strong>Accessibility</strong> – Enabling public access to data without proprietary restrictions.</li>
                    <li><strong>Reusability</strong> – Allowing data to be reused for multiple purposes without requiring significant transformation.</li>
                  </ul>
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
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Query Optimization</strong> – Efficient data retrieval and processing</li>
                    <li><strong>Caching Strategies</strong> – Smart data caching to reduce latency</li>
                    <li><strong>Resource Management</strong> – Optimal allocation of computing resources</li>
                    <li><strong>Performance Monitoring</strong> – Continuous tracking of system metrics</li>
                  </ul>
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
