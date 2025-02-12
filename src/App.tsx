
import { StrictMode, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import Index from "./pages/Index";
import Services from "./pages/Services";
import WhyUs from "./pages/WhyUs";
import Contact from "./pages/Contact";
import DataArchitecture from "./pages/DataArchitecture";
import CloudIntegration from "./pages/CloudIntegration";
import SecuritySolutions from "./pages/SecuritySolutions";
import AnalyticsInsights from "./pages/AnalyticsInsights";
import Methodologies from "./pages/Methodologies";

// Lazy load demo routes
const DemoOverview = lazy(() => import("./pages/demos/DemoOverview"));
const DemoIntegration = lazy(() => import("./pages/demos/DemoIntegration"));
const DemoAnalytics = lazy(() => import("./pages/demos/DemoAnalytics"));
const DemoSecurity = lazy(() => import("./pages/demos/DemoSecurity"));
const DataIntegrationDemo = lazy(() => import("./pages/demos/DataIntegrationDemo"));
const RealTimeAnalyticsDemo = lazy(() => import("./pages/demos/RealTimeAnalyticsDemo"));
const SecurityFeaturesDemo = lazy(() => import("./pages/demos/SecurityFeaturesDemo"));
const CloudInfrastructureDemo = lazy(() => import("./pages/demos/CloudInfrastructureDemo"));
const MachineLearningDemo = lazy(() => import("./pages/demos/MachineLearningDemo"));
const DataVisualizationDemo = lazy(() => import("./pages/demos/DataVisualizationDemo"));
const ApiIntegrationDemo = lazy(() => import("./pages/demos/ApiIntegrationDemo"));
const AutomatedWorkflowsDemo = lazy(() => import("./pages/demos/AutomatedWorkflowsDemo"));
const TradeDataDemo = lazy(() => import("./pages/demos/TradeDataDemo"));
const SupplyChainDemo = lazy(() => import("./pages/demos/SupplyChainDemo"));
const PredictiveMaintenanceDemo = lazy(() => import("./pages/demos/PredictiveMaintenanceDemo"));
const CustomerSegmentationDemo = lazy(() => import("./pages/demos/CustomerSegmentationDemo"));
const EnergyManagementDemo = lazy(() => import("./pages/demos/EnergyManagementDemo"));
const ArticleExtractorDemo = lazy(() => import("./pages/demos/ArticleExtractorDemo"));
const InvestmentResearchDemo = lazy(() => import("./pages/demos/InvestmentResearchDemo"));

const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/why-us" element={<WhyUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services/data-architecture" element={<DataArchitecture />} />
            <Route path="/services/cloud-integration" element={<CloudIntegration />} />
            <Route path="/services/security-solutions" element={<SecuritySolutions />} />
            <Route path="/services/analytics-insights" element={<AnalyticsInsights />} />
            <Route path="/methodologies" element={<Methodologies />} />
            
            {/* Wrap demo routes in Suspense */}
            <Route path="/demo/*" element={
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-pulse text-center">
                    <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
                  </div>
                </div>
              }>
                <Routes>
                  <Route path="overview" element={<DemoOverview />} />
                  <Route path="integration" element={<DemoIntegration />} />
                  <Route path="analytics" element={<DemoAnalytics />} />
                  <Route path="security" element={<DemoSecurity />} />
                  <Route path="data-integration" element={<DataIntegrationDemo />} />
                  <Route path="real-time-analytics" element={<RealTimeAnalyticsDemo />} />
                  <Route path="security-features" element={<SecurityFeaturesDemo />} />
                  <Route path="cloud-infrastructure" element={<CloudInfrastructureDemo />} />
                  <Route path="machine-learning" element={<MachineLearningDemo />} />
                  <Route path="data-visualization" element={<DataVisualizationDemo />} />
                  <Route path="api-integration" element={<ApiIntegrationDemo />} />
                  <Route path="automated-workflows" element={<AutomatedWorkflowsDemo />} />
                  <Route path="trade-data" element={<TradeDataDemo />} />
                  <Route path="supply-chain" element={<SupplyChainDemo />} />
                  <Route path="predictive-maintenance" element={<PredictiveMaintenanceDemo />} />
                  <Route path="customer-segmentation" element={<CustomerSegmentationDemo />} />
                  <Route path="energy-management" element={<EnergyManagementDemo />} />
                  <Route path="article-extractor" element={<ArticleExtractorDemo />} />
                  <Route path="investment-research" element={<InvestmentResearchDemo />} />
                </Routes>
              </Suspense>
            } />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
