
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Sparkles } from "lucide-react";
import { useState } from "react";
import { ExtractButton } from "./form/ExtractButton";
import { UrlInput } from "./form/UrlInput";

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

  const [isExtractingWithAI, setIsExtractingWithAI] = useState(false);
  const [isExtractingWithCode, setIsExtractingWithCode] = useState(false);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsExtractingWithCode(true);
    try {
      await onSubmit(values.url, false);
    } finally {
      setIsExtractingWithCode(false);
    }
  };

  const handleAISubmit = async () => {
    const values = form.getValues();
    if (!form.formState.isValid) {
      form.trigger();
      return;
    }
    setIsExtractingWithAI(true);
    try {
      await onSubmit(values.url, true);
    } finally {
      setIsExtractingWithAI(false);
    }
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
          <UrlInput form={form} />
          
          <div className="space-y-2">
            <ExtractButton 
              isExtracting={isExtractingWithCode}
              disabled={isExtractingWithCode || isExtractingWithAI}
              className="w-full"
            >
              Extract Article with Code
            </ExtractButton>

            <ExtractButton 
              type="button"
              onClick={handleAISubmit}
              isExtracting={isExtractingWithAI}
              disabled={isExtractingWithCode || isExtractingWithAI}
              className="w-full bg-[#61892F] hover:bg-[#86C232]"
              variant="secondary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Extract Article with AI
            </ExtractButton>
          </div>
        </form>
      </Form>
    </div>
  );
};
