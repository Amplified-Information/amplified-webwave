
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

  const formatAnalysisData = (data: any) => {
    if (typeof data === 'string') return data;
    if (data.text) return data.text;
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Analysis Results</h2>
      <div className="space-y-6">
        {results.map((result) => (
          <Card key={result.id} className="p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-primary">
                {result.agent.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Confidence Score:</span>
                <span className={`font-medium ${
                  result.confidence_score >= 0.8 ? 'text-green-600' :
                  result.confidence_score >= 0.6 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {(result.confidence_score * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div className="bg-gray-50 rounded-lg p-4 text-gray-800 whitespace-pre-wrap font-medium leading-relaxed">
                {formatAnalysisData(result.analysis_data)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
