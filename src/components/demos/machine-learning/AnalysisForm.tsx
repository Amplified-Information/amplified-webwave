
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, LinkIcon, AlertTriangle, InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

export const AnalysisForm = ({ onSubmit, isAnalyzing, error, retryDelay }: AnalysisFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      content: ""
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Recommendation</AlertTitle>
          <AlertDescription>
            For better analysis results, we recommend pasting the article content directly rather than using a URL. URL analysis currently processes the entire webpage instead of just the article content.
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
              disabled={isAnalyzing || retryDelay > 0}
            >
              {isAnalyzing 
                ? "Analyzing..." 
                : retryDelay > 0 
                  ? `Try again in ${retryDelay}s` 
                  : "Analyze Article"
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
