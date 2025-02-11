
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  url: z.string().url().optional(),
  content: z.string().optional(),
}).refine(data => data.url || data.content, {
  message: "Please provide either a URL or paste content to analyze"
});

interface UrlInputProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const UrlInput = ({ form }: UrlInputProps) => {
  return (
    <FormField
      control={form.control}
      name="url"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Article URL <span className="text-sm text-gray-500 ml-1">(Mandatory even if pasting the article manually)</span>
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
  );
};
