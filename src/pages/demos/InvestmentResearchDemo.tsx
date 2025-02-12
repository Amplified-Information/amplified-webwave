
import { Navigation } from "@/components/Navigation";
import { EnhancedStockScreener } from "@/components/demos/investment-research/stock-screener/EnhancedStockScreener";
import { Card, CardContent } from "@/components/ui/card";
import { SlidersHorizontal } from "lucide-react";

const InvestmentResearchDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Advanced Stock Screener</h3>
            </div>
            <EnhancedStockScreener />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestmentResearchDemo;
