
import { Users } from "lucide-react";

export const AIAgentsDescription = () => {
  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg mb-12">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
        <Users className="w-6 h-6" />
        AI Analysis Crew
      </h2>
      <div className="grid gap-4 text-left">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Lead Editor Agent</h3>
          <p className="text-sm text-gray-600">Orchestrates the analysis and compiles the final report</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Bias Detection Agent</h3>
          <p className="text-sm text-gray-600">Identifies potential biases, loaded terms, and emotional manipulation</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Fact-Checking Agent</h3>
          <p className="text-sm text-gray-600">Verifies factual claims and cross-references with reliable sources</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Quality Assessment Agent</h3>
          <p className="text-sm text-gray-600">Evaluates writing quality, structure, and journalistic standards</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Source Credibility Agent</h3>
          <p className="text-sm text-gray-600">Analyzes source reliability and author credentials</p>
        </div>
      </div>
    </div>
  );
};
