
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardPaste } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  url: z.string().url().optional(),
  content: z.string().optional(),
}).refine(data => data.url || data.content, {
  message: "Please provide either a URL or paste content to analyze"
});

interface ContentInputProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const ContentInput = ({ form }: ContentInputProps) => {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <ClipboardPaste className="w-4 h-4" />
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
  );
};
