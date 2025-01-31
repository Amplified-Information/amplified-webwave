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
      
      const { data: secrets, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'MORTGAGE_API_KEY')
        .limit(1);

      if (secretError) {
        console.error("Supabase secret error:", secretError);
        throw new Error('Failed to fetch API key');
      }

      if (!secrets || secrets.length === 0) {
        console.error("No API key found");
        throw new Error('API key not found in Supabase');
      }

      const apiKey = secrets[0].value;

      console.log("Making API request to rates endpoint...");
      const response = await fetch(
        "https://secure.dominionintranet.ca/rest/rates",
        {
          headers: {
            'apikey': apiKey
          }
        }
      );
      
      if (!response.ok) {
        console.error("API response error:", response.status, response.statusText);
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
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