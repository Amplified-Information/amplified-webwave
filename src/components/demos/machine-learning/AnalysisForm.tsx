
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertMessages } from "./form/AlertMessages";
import { UrlInput } from "./form/UrlInput";
import { ExtractionButtons } from "./form/ExtractionButtons";
import { ContentInput } from "./form/ContentInput";

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

export interface ArticleData {
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
  const [isExtractingWithAI, setIsExtractingWithAI] = useState(false);
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      content: ""
    }
  });

  const handleExtractArticle = async (useAI: boolean = false) => {
    const url = form.getValues("url");
    if (!url) return;

    if (useAI) {
      setIsExtractingWithAI(true);
    } else {
      setIsExtracting(true);
    }
    setArticleData(null);
    
    try {
      const { data: extractionData, error: extractionError } = await supabase.functions
        .invoke(useAI ? 'analyze-article-with-ai' : 'extract-article', {
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
      if (useAI) {
        setIsExtractingWithAI(false);
      } else {
        setIsExtracting(false);
      }
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <AlertMessages 
          error={error}
          retryDelay={retryDelay}
          articleData={articleData}
        />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <UrlInput form={form} />
              <ExtractionButtons 
                onExtract={handleExtractArticle}
                isExtracting={isExtracting}
                isExtractingWithAI={isExtractingWithAI}
                isUrlProvided={!!form.getValues("url")}
              />
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

            <ContentInput form={form} />

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
