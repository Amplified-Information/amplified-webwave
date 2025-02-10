
import { Card } from "@/components/ui/card";

interface AnalysisResult {
  id: string;
  agent: {
    name: string;
  };
  analysis_data: any;
  confidence_score: number;
}

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="p-4">
            <h3 className="font-semibold text-lg mb-2">{result.agent.name}</h3>
            <div className="prose prose-sm">
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                {JSON.stringify(result.analysis_data, null, 2)}
              </pre>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Confidence Score: {(result.confidence_score * 100).toFixed(1)}%
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
