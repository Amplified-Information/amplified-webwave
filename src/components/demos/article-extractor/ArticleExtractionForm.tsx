
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL")
});

interface ArticleExtractionFormProps {
  onSubmit: (url: string) => Promise<void>;
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
    await onSubmit(values.url);
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
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isExtracting}
          >
            {isExtracting ? "Extracting..." : "Extract Article"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
