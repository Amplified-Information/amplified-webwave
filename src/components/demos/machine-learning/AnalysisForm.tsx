
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, LinkIcon, AlertTriangle, Info, Clock, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  url: z.string().url().optional(),
  content: z.string().optional(),
}).refine(data => data.url || data.content, {
  message: "Please provide either a URL or paste content to analyze"
});

interface AnalysisFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isAnalyzing: boolean;
  error: string | null;
  retryDelay: number;
}

interface ArticleData {
  title?: string;
  description?: string;
  author?: string;
  published?: string;
  content: string;
  url?: string;
  source?: string;
  ttr?: number;
}

export const AnalysisForm = ({ onSubmit, isAnalyzing, error, retryDelay }: AnalysisFormProps) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      content: ""
    }
  });

  const handleExtractArticle = async () => {
    const url = form.getValues("url");
    if (!url) return;

    setIsExtracting(true);
    setArticleData(null);
    
    try {
      const { data: extractionData, error: extractionError } = await supabase.functions
        .invoke('extract-article', {
          body: { url }
        });

      if (extractionError) {
        console.error('Extraction error:', extractionError);
        try {
          const errorBody = typeof extractionError.message === 'string' 
            ? JSON.parse(extractionError.message)
            : extractionError;
          
          toast({
            variant: "destructive",
            title: "Extraction Failed",
            description: "We couldn't extract the article content. Please try pasting the article text directly in the box below."
          });
          
          form.setError('url', { 
            type: 'manual',
            message: 'Unable to extract article. Please paste the content manually.'
          });

          // Fix: Properly type the textarea element
          setTimeout(() => {
            const contentTextarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement | null;
            if (contentTextarea) {
              contentTextarea.focus();
            }
          }, 0);

        } catch (parseError) {
          form.setError('url', { 
            type: 'manual',
            message: 'Unable to extract article. Please paste the content manually.'
          });
        }
        return;
      }

      if (extractionData?.content) {
        setArticleData(extractionData);
        form.setValue("content", extractionData.content);
        form.clearErrors('url');
      } else {
        toast({
          variant: "destructive",
          title: "No Content Found",
          description: "We couldn't find any content in this article. Please try pasting the text directly."
        });
        form.setError('url', { 
          type: 'manual',
          message: 'No content found. Please paste the article manually.'
        });
      }
    } catch (error: any) {
      console.error('Article extraction error:', error);
      toast({
        variant: "destructive",
        title: "Extraction Error",
        description: "Failed to extract article content. Please paste the text directly below."
      });
      form.setError('url', { 
        type: 'manual',
        message: 'Failed to extract content. Please paste the article manually.'
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Alert variant="default" className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-600">Important Note About News Articles</AlertTitle>
          <AlertDescription className="text-blue-700">
            Many news providers actively block automated access to their content. If you&apos;re trying to extract content from a news website, you might encounter access restrictions. For best results, try using publicly accessible blog posts or articles, or consider copying and pasting the article content directly into the analysis tool.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {retryDelay > 0 ? "Please Wait" : "Error"}
            </AlertTitle>
            <AlertDescription>
              {retryDelay > 0 
                ? `${error} (${retryDelay} seconds remaining)`
                : error
              }
            </AlertDescription>
          </Alert>
        )}

        {articleData && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>{articleData.title || 'Article Extracted'}</AlertTitle>
            <AlertDescription className="space-y-2">
              {articleData.author && <p>Author: {articleData.author}</p>}
              {articleData.published && <p>Published: {new Date(articleData.published).toLocaleDateString()}</p>}
              {articleData.ttr && (
                <p className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Reading time: {articleData.ttr} minutes
                </p>
              )}
              {articleData.description && <p>{articleData.description}</p>}
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
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
              <Button
                type="button"
                variant="secondary"
                onClick={handleExtractArticle}
                disabled={isExtracting || !form.getValues("url")}
                className="w-full"
              >
                {isExtracting ? (
                  <span className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Extracting...
                  </span>
                ) : (
                  "Extract Article"
                )}
              </Button>
            </div>

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
              disabled={isAnalyzing || retryDelay > 0}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Analyzing...
                </span>
              ) : retryDelay > 0 ? (
                `Try again in ${retryDelay}s`
              ) : (
                "Analyze Article"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

