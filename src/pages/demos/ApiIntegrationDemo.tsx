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
import { Code } from "lucide-react";

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

const ApiIntegrationDemo = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rates"],
    queryFn: async () => {
      const response = await fetch(
        "https://secure.dominionintranet.ca/rest/rates?apikey=ec13af76-366f-11e7-bb05-000c297aee86"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: RatesResponse = await response.json();
      return data;
    },
  });

  const filteredRates = data?.Rates.filter((rate) => parseInt(rate.id) <= 8) || [];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Code className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">API Integration</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with external services through our API platform
          </p>
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Rates Table{" "}
                {data && (
                  <span className="text-sm font-normal text-gray-500">
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
                    <TableRow>
                      <TableHead>Terms</TableHead>
                      <TableHead>Bank Rate</TableHead>
                      <TableHead>Our Rate</TableHead>
                      <TableHead>Bank Monthly</TableHead>
                      <TableHead>Our Monthly</TableHead>
                      <TableHead>Savings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRates.map((rate) => (
                      <TableRow
                        key={rate.id}
                        className="hover:bg-primary/5 cursor-pointer"
                      >
                        <TableCell>{rate.Terms}</TableCell>
                        <TableCell>{rate.BankRate}</TableCell>
                        <TableCell>{rate.OurRate}</TableCell>
                        <TableCell>{rate.BankMonthly}</TableCell>
                        <TableCell>{rate.OurMonthly}</TableCell>
                        <TableCell>{rate.Savings}</TableCell>
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