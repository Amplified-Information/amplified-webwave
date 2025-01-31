import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Rate {
  id: string;
  Terms: string;
  BankRate: string;
  OurRate: string;
  BankMonthly: string;
  OurMonthly: string;
  Savings: string;
  updated_at: string;
}

export interface RatesResponse {
  Rates: Rate[];
}

export const useRates = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["rates"],
    queryFn: async () => {
      console.log("Starting rates fetch from Edge Function...");
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mortgage-rates`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Edge Function error:", error);
        throw new Error(error.error || 'Failed to fetch rates');
      }

      const data: RatesResponse = await response.json();
      console.log("Rates data received:", data);
      return data;
    },
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load rates",
          variant: "destructive",
        });
      }
    }
  });
};