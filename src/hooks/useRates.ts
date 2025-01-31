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
      console.log("Starting rates fetch...");
      
      // Fetch API key from Supabase secrets
      const { data: secrets, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'MORTGAGE_API_KEY')
        .single();

      if (secretError) {
        console.error("Failed to fetch API key:", secretError);
        throw new Error('Failed to fetch API key');
      }

      if (!secrets) {
        console.error("No API key found");
        throw new Error('API key not found');
      }

      console.log("Making API request to rates endpoint...");
      const response = await fetch(
        "https://secure.dominionintranet.ca/rest/rates",
        {
          headers: {
            'apikey': secrets.value,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API response error:", response.status, errorText);
        throw new Error(`Failed to fetch rates: ${response.status} ${errorText}`);
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