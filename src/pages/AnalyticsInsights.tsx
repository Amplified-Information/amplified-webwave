import { Card, CardContent } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";

const AnalyticsInsights = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">Analytics & Insights</h1>
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <BarChart className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Business Intelligence</h2>
                  <p className="text-muted-foreground">
                    Transform raw data into actionable insights through advanced analytics
                    and visualization tools.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <LineChart className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Predictive Analytics</h2>
                  <p className="text-muted-foreground">
                    Leverage machine learning and statistical modeling to forecast trends
                    and make data-driven decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <PieChart className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Data Visualization</h2>
                  <p className="text-muted-foreground">
                    Create intuitive and interactive dashboards that make complex data
                    easy to understand and act upon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <BarChart className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Custom Reporting</h2>
                  <p className="text-muted-foreground">
                    Develop tailored reporting solutions that deliver the right insights
                    to the right stakeholders at the right time.
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

export default AnalyticsInsights;