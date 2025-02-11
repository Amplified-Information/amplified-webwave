
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Sparkles, Loader } from "lucide-react";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL")
});

interface ArticleExtractionFormProps {
  onSubmit: (url: string, useAI?: boolean) => Promise<void>;
  isExtracting: boolean;
  error: string | null;
}

export const ArticleExtractionForm = ({ 
  onSubmit, 
  isExtracting, 
  error 
}: ArticleExtractionFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: ""
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values.url, false);
  };

  const handleAISubmit = async () => {
    const values = form.getValues();
    if (!form.formState.isValid) {
      form.trigger();
      return;
    }
    await onSubmit(values.url, true);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Article URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/article" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isExtracting}
            >
              {isExtracting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                "Extract Article with Code"
              )}
            </Button>

            <Button 
              type="button"
              onClick={handleAISubmit}
              className="w-full bg-[#86C232] hover:bg-[#61892F]"
              disabled={isExtracting}
              variant="secondary"
            >
              {isExtracting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Extracting with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Extract Article with AI
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
