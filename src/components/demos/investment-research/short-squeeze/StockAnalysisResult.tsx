
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { StockData } from "./types";

interface StockAnalysisResultProps {
  stockData: StockData;
  calculateShortSqueezePotential: (data: StockData) => string;
}

export const StockAnalysisResult = ({ stockData, calculateShortSqueezePotential }: StockAnalysisResultProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{stockData.company_name || stockData.symbol}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="font-medium">${stockData.current_price?.toFixed(2) || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Short % of Float</p>
                <p className="font-medium">{stockData.short_percent_float?.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Relative Volume</p>
                <p className="font-medium">{stockData.relative_volume?.toFixed(2)}x</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">RSI (14)</p>
                <p className="font-medium">{stockData.rsi?.toFixed(2) || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price Change</p>
                <p className={`font-medium ${
                  stockData.price_change_percent && stockData.price_change_percent > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {stockData.price_change_percent?.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Squeeze Potential</p>
                <p className="font-medium">{calculateShortSqueezePotential(stockData)}</p>
              </div>
            </div>
          </div>

          {stockData.short_percent_float === null && (
            <Alert className="mt-4 border-yellow-300 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Short interest data is not available for this stock. This may affect the accuracy of the squeeze analysis.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
