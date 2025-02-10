
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Newspaper, Upload, LinkIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  url: z.string().url().optional(),
  content: z.string().optional(),
}).refine(data => data.url || data.content, {
  message: "Please provide either a URL or paste content to analyze"
});

const MachineLearningDemo = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    try {
      // TODO: Implement analysis logic with CrewAI
      console.log("Analyzing:", values);
      toast({
        title: "Analysis started",
        description: "Your content is being analyzed. This may take a few moments."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start analysis. Please try again.",
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload or paste news articles for AI-powered analysis of bias and journalistic quality
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
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
