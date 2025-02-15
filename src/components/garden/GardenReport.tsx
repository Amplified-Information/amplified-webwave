
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GardenReportProps {
  isGenerating: boolean;
  report: string;
  onGenerate: () => void;
  disabled: boolean;
}

export const GardenReport = ({
  isGenerating,
  report,
  onGenerate,
  disabled,
}: GardenReportProps) => {
  return (
    <>
      <div className="mt-8">
        <Button
          onClick={onGenerate}
          disabled={isGenerating || disabled}
          className="w-full md:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            'Generate Garden Planning Report'
          )}
        </Button>
      </div>

      {report && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-4">Your Garden Planning Report</h3>
          <div className="prose max-w-none whitespace-pre-wrap">
            {report}
          </div>
        </div>
      )}
    </>
  );
};
