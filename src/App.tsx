import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import WhyUs from "./pages/WhyUs";
import Contact from "./pages/Contact";
import DataArchitecture from "./pages/DataArchitecture";
import CloudIntegration from "./pages/CloudIntegration";
import SecuritySolutions from "./pages/SecuritySolutions";
import AnalyticsInsights from "./pages/AnalyticsInsights";
import DemoOverview from "./pages/demos/DemoOverview";
import DemoIntegration from "./pages/demos/DemoIntegration";
import DemoAnalytics from "./pages/demos/DemoAnalytics";
import DemoSecurity from "./pages/demos/DemoSecurity";
import DataIntegrationDemo from "./pages/demos/DataIntegrationDemo";
import RealTimeAnalyticsDemo from "./pages/demos/RealTimeAnalyticsDemo";
import SecurityFeaturesDemo from "./pages/demos/SecurityFeaturesDemo";
import CloudInfrastructureDemo from "./pages/demos/CloudInfrastructureDemo";
import MachineLearningDemo from "./pages/demos/MachineLearningDemo";
import DataVisualizationDemo from "./pages/demos/DataVisualizationDemo";
import ApiIntegrationDemo from "./pages/demos/ApiIntegrationDemo";
import AutomatedWorkflowsDemo from "./pages/demos/AutomatedWorkflowsDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services/data-architecture" element={<DataArchitecture />} />
          <Route path="/services/cloud-integration" element={<CloudIntegration />} />
          <Route path="/services/security-solutions" element={<SecuritySolutions />} />
          <Route path="/services/analytics-insights" element={<AnalyticsInsights />} />
          <Route path="/demo/overview" element={<DemoOverview />} />
          <Route path="/demo/integration" element={<DemoIntegration />} />
          <Route path="/demo/analytics" element={<DemoAnalytics />} />
          <Route path="/demo/security" element={<DemoSecurity />} />
          <Route path="/demo/data-integration" element={<DataIntegrationDemo />} />
          <Route path="/demo/real-time-analytics" element={<RealTimeAnalyticsDemo />} />
          <Route path="/demo/security-features" element={<SecurityFeaturesDemo />} />
          <Route path="/demo/cloud-infrastructure" element={<CloudInfrastructureDemo />} />
          <Route path="/demo/machine-learning" element={<MachineLearningDemo />} />
          <Route path="/demo/data-visualization" element={<DataVisualizationDemo />} />
          <Route path="/demo/api-integration" element={<ApiIntegrationDemo />} />
          <Route path="/demo/automated-workflows" element={<AutomatedWorkflowsDemo />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;