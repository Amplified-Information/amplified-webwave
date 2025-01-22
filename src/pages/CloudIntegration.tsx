import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudUpload, CloudDownload, Server } from "lucide-react";
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