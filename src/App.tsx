import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Demo from "./pages/Demo";
import WhyUs from "./pages/WhyUs";
import Contact from "./pages/Contact";
import DataArchitecture from "./pages/DataArchitecture";
import CloudIntegration from "./pages/CloudIntegration";
import SecuritySolutions from "./pages/SecuritySolutions";
import AnalyticsInsights from "./pages/AnalyticsInsights";

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
          <Route path="/demo" element={<Demo />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services/data-architecture" element={<DataArchitecture />} />
          <Route path="/services/cloud-integration" element={<CloudIntegration />} />
          <Route path="/services/security-solutions" element={<SecuritySolutions />} />
          <Route path="/services/analytics-insights" element={<AnalyticsInsights />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;