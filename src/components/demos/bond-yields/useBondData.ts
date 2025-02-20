
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Mock data generator for demo purposes
const generateMockData = () => {
  const startDate = new Date(2019, 0, 1);
  const endDate = new Date();
  const data = [];
  
  let current2yr = 2;
  let current5yr = 2.5;
  let current10yr = 3;
  let current30yr = 3.5;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Add some random variation to simulate market movements
    current2yr += (Math.random() - 0.5) * 0.1;
    current5yr += (Math.random() - 0.5) * 0.1;
    current10yr += (Math.random() - 0.5) * 0.1;
    current30yr += (Math.random() - 0.5) * 0.1;

    data.push({
      date: d.toISOString().split('T')[0],
      "2yr": Number(current2yr.toFixed(2)),
      "5yr": Number(current5yr.toFixed(2)),
      "10yr": Number(current10yr.toFixed(2)),
      "30yr": Number(current30yr.toFixed(2)),
    });
  }

  return data;
};

export const useBondData = () => {
  return useQuery({
    queryKey: ['bondYields'],
    queryFn: async () => {
      // In a real application, we would fetch this data from an API or database
      // For now, we'll use mock data
      return generateMockData();
    },
  });
};
