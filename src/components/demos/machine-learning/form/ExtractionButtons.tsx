
import { Button } from "@/components/ui/button";
import { Loader, Sparkles } from "lucide-react";

interface ExtractionButtonsProps {
  onExtract: (useAI: boolean) => Promise<void>;
  isExtracting: boolean;
  isExtractingWithAI: boolean;
  isUrlProvided: boolean;
}

export const ExtractionButtons = ({ 
  onExtract, 
  isExtracting, 
  isExtractingWithAI, 
  isUrlProvided 
}: ExtractionButtonsProps) => {
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        onClick={() => onExtract(false)}
        disabled={isExtracting || isExtractingWithAI || !isUrlProvided}
        className="w-full"
      >
        {isExtracting ? (
          <span className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            Extracting...
          </span>
        ) : (
          "Extract Article with Code"
        )}
      </Button>

      <Button
        type="button"
        onClick={() => onExtract(true)}
        disabled={isExtracting || isExtractingWithAI || !isUrlProvided}
        className="w-full bg-[#61892F] hover:bg-[#86C232]"
        variant="secondary"
      >
        {isExtractingWithAI ? (
          <span className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            Extracting with AI...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Extract Article with AI
          </span>
        )}
      </Button>
    </div>
  );
};
