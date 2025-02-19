import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudUpload, CloudDownload, Server, Shield } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const CloudIntegration = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">Cloud Integration</h1>
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Cloud className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Cloud Migration Strategy</h2>
                  <p className="text-muted-foreground">
                    Develop and execute comprehensive cloud migration strategies tailored to your
                    business needs and objectives.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Assessment</strong> – Comprehensive evaluation of existing infrastructure and applications</li>
                    <li><strong>Planning</strong> – Detailed roadmap development with clear milestones and success criteria</li>
                    <li><strong>Risk Management</strong> – Identification and mitigation of potential migration risks</li>
                    <li><strong>Cost Optimization</strong> – Strategic resource allocation to maximize ROI</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <CloudUpload className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Data Migration</h2>
                  <p className="text-muted-foreground">
                    Seamlessly transfer your data to cloud platforms while ensuring data integrity
                    and minimal business disruption.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Data Security</strong> – Encrypted transfer and storage of sensitive information</li>
                    <li><strong>Data Validation</strong> – Comprehensive checking of data accuracy and completeness</li>
                    <li><strong>Performance Optimization</strong> – Efficient transfer mechanisms for large datasets</li>
                    <li><strong>Rollback Planning</strong> – Contingency measures for unexpected issues</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <CloudDownload className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Cloud-Native Solutions</h2>
                  <p className="text-muted-foreground">
                    Design and implement solutions that leverage cloud-native services for
                    maximum efficiency and scalability.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Containerization</strong> – Deployment of applications in portable, scalable containers</li>
                    <li><strong>Microservices</strong> – Building modular, independently deployable services</li>
                    <li><strong>Auto-scaling</strong> – Dynamic resource allocation based on demand</li>
                    <li><strong>Service Mesh</strong> – Advanced service-to-service communication and monitoring</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Server className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Hybrid Cloud Architecture</h2>
                  <p className="text-muted-foreground">
                    Create flexible hybrid cloud solutions that combine the best of on-premises
                    and cloud infrastructure.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Resource Distribution</strong> – Optimal workload placement across environments</li>
                    <li><strong>Network Integration</strong> – Seamless connectivity between cloud and on-premises systems</li>
                    <li><strong>Identity Management</strong> – Unified access control across hybrid environments</li>
                    <li><strong>Disaster Recovery</strong> – Cross-platform backup and recovery solutions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Continuity of Service</h2>
                  <p className="text-muted-foreground">
                    Ensure uninterrupted business operations with robust service continuity 
                    strategies and implementation.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>High Availability</strong> – Multi-region deployment for continuous service uptime</li>
                    <li><strong>Failover Systems</strong> – Automated backup systems for critical services</li>
                    <li><strong>Load Distribution</strong> – Geographic distribution of workloads for optimal performance</li>
                    <li><strong>Monitoring Solutions</strong> – Real-time tracking of service health and performance</li>
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

export default CloudIntegration;
