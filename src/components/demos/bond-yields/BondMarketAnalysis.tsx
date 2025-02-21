
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Brain, Loader2 } from "lucide-react";

export const BondMarketAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const analyzeMarket = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/functions/v1/analyze-bonds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze bond market');
      }

      const data = await response.json();
      setAnalysis(data.choices[0].message.content);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the bond market data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">AI Market Analysis</h2>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Ask a question about the bond market trends..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />

          <Button
            onClick={analyzeMarket}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Market'
            )}
          </Button>

          {analysis && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="whitespace-pre-wrap">{analysis}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
