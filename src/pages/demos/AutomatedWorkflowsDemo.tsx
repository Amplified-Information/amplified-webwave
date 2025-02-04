import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Bot, Car, DollarSign } from "lucide-react";

const AutomatedWorkflowsDemo = () => {
  const [budget, setBudget] = useState([25000]);
  const [location, setLocation] = useState("");
  const [preferences, setPreferences] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    // We'll implement the CrewAI integration in the next step
    setTimeout(() => setIsSearching(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Car className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Used Car Finder AI Crew</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI crew will help you find the perfect used car based on your preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Your Car Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range (USD)</Label>
                <div className="flex items-center gap-4">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <Slider
                    id="budget"
                    max={100000}
                    step={1000}
                    value={budget}
                    onValueChange={setBudget}
                  />
                  <span className="min-w-[80px] text-right">
                    ${budget[0].toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter your city or ZIP code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences">Additional Preferences</Label>
                <Input
                  id="preferences"
                  placeholder="e.g., SUV, low mileage, specific brands"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                />
              </div>

              <Button 
                className="w-full"
                onClick={handleSearch}
                disabled={isSearching || !location}
              >
                {isSearching ? "Searching..." : "Find My Perfect Car"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Crew Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  The AI crew will consist of:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Market Research Specialist</li>
                  <li>Vehicle Inspector</li>
                  <li>Price Negotiator</li>
                  <li>Safety Analyst</li>
                </ul>
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Status: {isSearching ? "Crew is working..." : "Ready to start search"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AutomatedWorkflowsDemo;