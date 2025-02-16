
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  // Function to process the report text and convert markdown-style sections to HTML
  const formatReport = (text: string) => {
    if (!text) return "";
    
    // Split the report into sections
    const sections = text.split(/(?=\d+\.\s+[A-Z])/);
    
    return sections.map((section, index) => {
      // Extract the section title and content
      const [title, ...content] = section.split('\n');
      
      return (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {title.trim()}
          </h2>
          <div className="space-y-4">
            {content.map((line, lineIndex) => {
              // Convert bullet points
              if (line.trim().startsWith('-')) {
                return (
                  <li key={lineIndex} className="ml-6 list-disc text-gray-700">
                    {line.trim().substring(1).trim()}
                  </li>
                );
              }
              // Handle subsections (indicated by multiple dashes or asterisks)
              if (line.trim().startsWith('*')) {
                return (
                  <h3 key={lineIndex} className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                    {line.trim().substring(1).trim()}
                  </h3>
                );
              }
              // Regular paragraphs
              if (line.trim()) {
                return (
                  <p key={lineIndex} className="text-gray-700">
                    {line.trim()}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    });
  };

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
        <Card className="mt-8 p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-6">Your Garden Planning Report</h1>
          <div className="prose max-w-none">
            {formatReport(report)}
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Generated on: {new Date().toLocaleDateString()}</p>
          </div>
        </Card>
      )}
    </>
  );
};
