import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

export const Demo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience how our data systems can transform your business operations
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg border-2 border-[#86C232]/20">
          <CardContent className="p-6">
            <div className="bg-gray-100 rounded-lg aspect-video mb-6 flex items-center justify-center">
              <div className="text-xl text-gray-500">Interactive Demo Visualization</div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-[#86C232] text-[#86C232] hover:bg-[#86C232] hover:text-white"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <><Pause className="mr-2 h-4 w-4" /> Pause</>
                ) : (
                  <><Play className="mr-2 h-4 w-4" /> Play</>
                )}
              </Button>
              <Button
                variant="outline"
                className="border-gray-300"
                onClick={() => setIsPlaying(false)}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};