
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL")
});

type FormData = z.infer<typeof formSchema>;

interface UrlInputProps {
  form: UseFormReturn<FormData>;
}

export const UrlInput = ({ form }: UrlInputProps) => {
  return (
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
  );
};

