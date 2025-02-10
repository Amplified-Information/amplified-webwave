
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProcessDiagram } from "@/components/ProcessDiagram";
import { MLDemoHeader } from "@/components/demos/machine-learning/MLDemoHeader";
import { AIAgentsDescription } from "@/components/demos/machine-learning/AIAgentsDescription";
import { AnalysisForm } from "@/components/demos/machine-learning/AnalysisForm";
import { AnalysisResults } from "@/components/demos/machine-learning/AnalysisResults";

const MachineLearningDemo = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryDelay, setRetryDelay] = useState(0);
  const { toast } = useToast();

  const onSubmit = async (values: { url?: string; content?: string }) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // Create the article first
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert({
          content: values.content || '',
          url: values.url || null
        })
        .select()
        .single();

      if (articleError) {
        console.error('Article creation error:', articleError);
        throw articleError;
      }

      // Call the analyze-article function
      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('analyze-article', {
          body: {
            articleId: article.id,
            content: values.content || '',
            url: values.url || null
          }
        });

      if (analysisError) {
        let errorMessage = "Failed to analyze the article.";
        let errorDetails = "";
        
        try {
          // Try to parse the error response
          const errorBody = JSON.parse(analysisError.message);
          
          // Check if we have a structured error response
          if (typeof errorBody === 'object' && errorBody.body) {
            const parsedBody = JSON.parse(errorBody.body);
            errorMessage = parsedBody.error || errorMessage;
            errorDetails = parsedBody.details || "";
          }

          // Handle specific error cases
          if (analysisError.status === 400) {
            setError(errorMessage);
            toast({
              title: "URL Processing Failed",
              description: errorDetails || "Please paste the article content directly instead.",
              variant: "destructive"
            });
            return;
          }

          if (analysisError.status === 429) {
            const retryAfter = 60;
            setRetryDelay(retryAfter);
            setError(`Our AI service is currently at capacity. Please try again in ${retryAfter} seconds.`);
            
            const timer = setInterval(() => {
              setRetryDelay((prev) => {
                if (prev <= 1) {
                  clearInterval(timer);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);

            toast({
              title: "Rate Limit Exceeded",
              description: "Please wait a minute before trying again.",
              variant: "destructive"
            });
            return;
          }

          setError(errorMessage);
          toast({
            title: "Analysis Failed",
            description: errorDetails || errorMessage,
            variant: "destructive"
          });
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          setError("An unexpected error occurred. Please try again.");
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }

      // Fetch the analysis results
      const { data: results, error: resultsError } = await supabase
        .from('analysis_results')
        .select(`
          *,
          agent:agent_configurations(*)
        `)
        .eq('article_id', article.id);

      if (resultsError) throw resultsError;

      setAnalysisResults(results || []);
      
      toast({
        title: "Analysis completed",
        description: "The article has been analyzed successfully."
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(error.message || "Failed to analyze the article. Please try again.");
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <MLDemoHeader />

        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ProcessDiagram />
        </div>

        <AIAgentsDescription />

        <AnalysisForm 
          onSubmit={onSubmit}
          isAnalyzing={isAnalyzing}
          error={error}
          retryDelay={retryDelay}
        />

        <AnalysisResults results={analysisResults} />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Our AI system analyzes articles for:</p>
          <ul className="mt-2 space-y-1">
            <li>• Potential bias indicators</li>
            <li>• Source credibility assessment</li>
            <li>• Fact-checking suggestions</li>
            <li>• Writing quality metrics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MachineLearningDemo;
