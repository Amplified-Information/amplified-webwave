
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Newspaper, Upload, LinkIcon, CheckCircle2, Clock, Users, AlertCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProcessDiagram } from "@/components/ProcessDiagram";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  url: z.string().url().optional(),
  content: z.string().optional(),
}).refine(data => data.url || data.content, {
  message: "Please provide either a URL or paste content to analyze"
});

const MachineLearningDemo = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      content: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert({
          content: values.content || '',
          url: values.url || null
        })
        .select()
        .single();

      if (articleError) throw articleError;

      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('analyze-article', {
          body: {
            articleId: article.id,
            content: values.content || '',
            url: values.url || null
          }
        });

      if (analysisError) {
        // Check if it's a rate limit error
        if (analysisError.status === 429) {
          setError("Our AI service is currently at capacity. Please wait a few minutes and try again.");
          toast({
            title: "Rate Limit Exceeded",
            description: "Please wait a few minutes before trying again.",
            variant: "destructive"
          });
          return;
        }
        throw analysisError;
      }

      const { data: results, error: resultsError } = await supabase
        .from('analysis_results')
        .select(`
          *,
          agent:agent_configurations(*)
        `)
        .eq('article_id', article.id);

      if (resultsError) throw resultsError;

      setAnalysisResults(results);
      
      toast({
        title: "Analysis completed",
        description: "The article has been analyzed successfully."
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(error.message || "Failed to analyze the article. Please try again.");
      toast({
        title: "Error",
        description: error.message || "Failed to analyze the article. Please try again.",
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
        <div className="text-center mb-12">
          <Newspaper className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">News Article Analysis with AI</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Upload or paste news articles for AI-powered analysis of bias and journalistic quality
          </p>

          {/* Process Diagram */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ProcessDiagram />
          </div>

          {/* AI Agents Description */}
          <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
              <Users className="w-6 h-6" />
              AI Analysis Crew
            </h2>
            <div className="grid gap-4 text-left">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-medium text-primary">Lead Editor Agent</h3>
                <p className="text-sm text-gray-600">Orchestrates the analysis and compiles the final report</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-medium text-primary">Bias Detection Agent</h3>
                <p className="text-sm text-gray-600">Identifies potential biases, loaded terms, and emotional manipulation</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-medium text-primary">Fact-Checking Agent</h3>
                <p className="text-sm text-gray-600">Verifies factual claims and cross-references with reliable sources</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-medium text-primary">Quality Assessment Agent</h3>
                <p className="text-sm text-gray-600">Evaluates writing quality, structure, and journalistic standards</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-medium text-primary">Source Credibility Agent</h3>
                <p className="text-sm text-gray-600">Analyzes source reliability and author credentials</p>
              </div>
            </div>
          </div>

          {/* Implementation Roadmap */}
          <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg mb-12">
            <h2 className="text-xl font-semibold mb-4">Implementation Roadmap</h2>
            <div className="grid gap-4 text-left">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1 text-orange-500" />
                <div>
                  <h3 className="font-medium">1. Database Setup</h3>
                  <p className="text-sm text-gray-600">Creating tables for article analyses, user submissions, and results tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1 text-orange-500" />
                <div>
                  <h3 className="font-medium">2. Backend Infrastructure</h3>
                  <p className="text-sm text-gray-600">Edge functions for article processing, URL scraping, and CrewAI integration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1 text-orange-500" />
                <div>
                  <h3 className="font-medium">3. Analysis Components</h3>
                  <p className="text-sm text-gray-600">AI agents for bias detection, fact-checking, quality assessment, and credibility evaluation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-1 text-green-500" />
                <div>
                  <h3 className="font-medium">4. Frontend Implementation</h3>
                  <p className="text-sm text-gray-600">Basic form interface complete, pending results display and historical view</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1 text-orange-500" />
                <div>
                  <h3 className="font-medium">5. Integrations</h3>
                  <p className="text-sm text-gray-600">Supabase connection, OpenAI setup, and real-time updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Article URL
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://news-source.com/article" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Or
                    </span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Paste Article Content
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Paste the article content here..." 
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Article"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {analysisResults.length > 0 && (
          <div className="mt-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
            <div className="space-y-4">
              {analysisResults.map((result) => (
                <Card key={result.id} className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{result.agent.name}</h3>
                  <div className="prose prose-sm">
                    <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                      {JSON.stringify(result.analysis_data, null, 2)}
                    </pre>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Confidence Score: {(result.confidence_score * 100).toFixed(1)}%
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

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
