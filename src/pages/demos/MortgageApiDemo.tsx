import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Rate {
  id: string;
  Terms: string;
  BankRate: string;
  OurRate: string;
  BankMonthly: string;
  OurMonthly: string;
  Savings: string;
  updated_at: string;
}

interface RatesResponse {
  Rates: Rate[];
}

const formatPercentage = (value: string) => {
  const num = parseFloat(value);
  return num.toFixed(2) + '%';
};

const formatMoney = (value: string) => {
  const num = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

const ApiIntegrationDemo = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["rates"],
    queryFn: async () => {
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'MORTGAGE_API_KEY')
        .single();

      if (secretError) {
        throw new Error("Failed to fetch API key from Supabase");
      }

      if (!secretData?.value) {
        throw new Error("API key not found");
      }

      const response = await fetch(
        `https://secure.dominionintranet.ca/rest/rates?apikey=${secretData.value}`
      );
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data: RatesResponse = await response.json();
      return data;
    },
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error: subscribeError } = await supabase.functions.invoke('send-mortgage-report', {
        body: {
          email,
          phone,
          name: "Mortgage Report Subscriber",
          question
        }
      });

      if (subscribeError) {
        console.error("Subscription error:", subscribeError);
        throw new Error(subscribeError.message);
      }

      toast({
        title: "Thank you for subscribing!",
        description: "We'll send your complimentary BC mortgage trends report shortly.",
      });
      
      setEmail("");
      setPhone("");
      setQuestion("");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRates = data?.Rates.filter((rate) => parseInt(rate.id) <= 8) || [];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <Card className="mt-4">
          <CardContent className="p-6">
            <a 
              href="https://cuttingedgemortgage.ca/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mb-8 hover:opacity-95 transition-opacity"
            >
              <img
                src="/uploads/87c4bef0-cf92-4982-8c47-e07cce2a7334.png"
                alt="West Coast Cutting Edge Mortgage Banner"
                className="w-full rounded-lg shadow-md"
              />
            </a>

            <div className="bg-[#00B6DE]/5 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-[#003876] mb-4">
                Ask Questions and Get Your Free BC Mortgage Trends Report
              </h3>
              <p className="text-gray-600 mb-4">
                Subscribe to receive a complimentary report on current mortgage trends in British Columbia, 
                including market analysis and rate predictions.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="max-w-md"
                    disabled={isSubmitting}
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#003876] hover:bg-[#00B6DE] text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⠋</span>
                        Sending...
                      </>
                    ) : (
                      "Get Free Report"
                    )}
                  </Button>
                </div>
                <div className="max-w-md">
                  <Input
                    type="tel"
                    placeholder="Phone number for quick reply (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="max-w-md">
                  <Input
                    type="text"
                    placeholder="Any specific questions about mortgages?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </form>
            </div>

            <div className="bg-[#00B6DE]/5 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#003876] mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-[#00B6DE]" />
                    Download My Mortgage Toolbox App
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get instant access to mortgage calculators, rate comparisons, and expert advice right on your mobile device.
                  </p>
                  <Button 
                    onClick={() => window.open('https://dlcapp.ca/app/beata-wojtalik', '_blank')}
                    className="flex items-center gap-2 bg-[#003876] hover:bg-[#00B6DE] text-white"
                  >
                    <Download className="w-4 h-4" />
                    Download App
                  </Button>
                </div>
                <div className="flex-1 max-w-[200px]">
                  <img
                    src="/lovable-uploads/645e0339-4570-4293-a9f9-626ada77c9e3.png"
                    alt="Mortgage Toolbox App Pre-qualification Screenshot"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Current Canadian Mortgage Rates{" "}
                {data && (
                  <span className="text-sm font-normal text-[#00B6DE]">
                    (Updated on: {filteredRates[0]?.updated_at})
                  </span>
                )}
              </h2>
            </div>

            {isLoading && <p className="text-center py-4">Loading rates...</p>}
            
            {error && (
              <p className="text-center text-red-500 py-4">
                Error loading rates. Please try again later.
              </p>
            )}

            {data && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#00B6DE]/10">
                      <TableHead className="font-semibold text-[#003876]">Terms</TableHead>
                      <TableHead className="font-semibold text-[#003876]">Bank Rate</TableHead>
                      <TableHead className="font-semibold text-[#003876]">Our Rate</TableHead>
                      <TableHead className="font-semibold text-[#003876]">Monthly Bank Payment</TableHead>
                      <TableHead className="font-semibold text-[#003876]">Your Monthly Payment</TableHead>
                      <TableHead className="font-semibold text-[#003876]">Your Monthly Savings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRates.map((rate, index) => (
                      <TableRow
                        key={rate.id}
                        className={`
                          transition-colors
                          hover:bg-[#00B6DE]/5 
                          cursor-pointer
                          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        `}
                      >
                        <TableCell className="font-medium">{rate.Terms}</TableCell>
                        <TableCell>{formatPercentage(rate.BankRate)}</TableCell>
                        <TableCell>{formatPercentage(rate.OurRate)}</TableCell>
                        <TableCell>{formatMoney(rate.BankMonthly)}</TableCell>
                        <TableCell>{formatMoney(rate.OurMonthly)}</TableCell>
                        <TableCell className="text-[#00B6DE] font-medium">
                          {formatMoney(rate.Savings)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiIntegrationDemo;
