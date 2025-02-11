
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface UrlInputProps {
  form: UseFormReturn<{
    url: string;
  }>;
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
