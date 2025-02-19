
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, Activity, Database } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const AnalyticsInsights = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
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
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Interactive Dashboards</strong> – Customizable visualizations for real-time monitoring</li>
                    <li><strong>KPI Tracking</strong> – Comprehensive metrics and performance indicators</li>
                    <li><strong>Data Discovery</strong> – Self-service analytics for business users</li>
                    <li><strong>Automated Reporting</strong> – Scheduled reports and insights delivery</li>
                  </ul>
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
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Trend Analysis</strong> – Advanced pattern recognition and forecasting</li>
                    <li><strong>Machine Learning Models</strong> – Custom AI solutions for your business needs</li>
                    <li><strong>Risk Assessment</strong> – Proactive identification of business risks</li>
                    <li><strong>Market Intelligence</strong> – Competitive analysis and market insights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Activity className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Real-Time Analytics</h2>
                  <p className="text-muted-foreground">
                    Monitor and analyze data streams in real-time to enable immediate
                    insights and rapid decision-making.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Stream Processing</strong> – Instant analysis of live data feeds</li>
                    <li><strong>Event Monitoring</strong> – Real-time alerts and notifications</li>
                    <li><strong>Performance Metrics</strong> – Live system and application monitoring</li>
                    <li><strong>Dynamic Visualization</strong> – Real-time data visualization updates</li>
                  </ul>
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
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Interactive Charts</strong> – Dynamic and responsive data visualizations</li>
                    <li><strong>Custom Dashboards</strong> – Tailored visualization layouts</li>
                    <li><strong>Data Storytelling</strong> – Narrative-driven data presentations</li>
                    <li><strong>Export Capabilities</strong> – Multiple format support for reports</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Database className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Data Integration</h2>
                  <p className="text-muted-foreground">
                    Seamlessly combine data from multiple sources to create comprehensive
                    insights and unified analytics views.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                    <li><strong>Data Connectors</strong> – Wide range of source system integrations</li>
                    <li><strong>ETL Processing</strong> – Automated data transformation pipelines</li>
                    <li><strong>Data Quality</strong> – Validation and cleansing procedures</li>
                    <li><strong>Master Data Management</strong> – Unified view of business data</li>
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

export default AnalyticsInsights;
