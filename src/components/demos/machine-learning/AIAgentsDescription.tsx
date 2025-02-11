
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
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> Orchestrates the analysis and compiles the final report</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Goal:</span> Ensure comprehensive and well-structured analysis by coordinating other agents</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Backstory:</span> A veteran editor with decades of experience in coordinating investigative journalism teams</p>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Bias Detection Agent</h3>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> Identifies potential biases, loaded terms, and rhetoric</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Goal:</span> Ensure objectivity and fairness in reporting</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Backstory:</span> Former media watchdog specializing in identifying subtle forms of bias in journalism</p>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-400">
          <h3 className="font-medium text-primary">Fact-Checking Agent</h3>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> Analyzes factual claims and identifies areas needing verification</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Goal:</span> Flag claims that require external verification</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Note:</span> This agent identifies claims that need fact-checking but does not perform real-time internet research</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Capabilities:</span> Identifies unsubstantiated claims, analyzes internal consistency, and suggests areas needing additional context or verification</p>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Quality Assessment Agent</h3>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> Evaluates writing quality, structure, and journalistic standards</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Goal:</span> Ensure content meets professional journalism standards</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Backstory:</span> Former journalism professor specializing in writing quality and storytelling</p>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Source Credibility Agent</h3>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> Analyzes source reliability and author credentials</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Goal:</span> Validate the credibility of information sources</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Backstory:</span> Expert in source verification with experience in digital forensics</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-primary mb-2">Understanding Confidence Scores</h3>
        <p className="text-sm text-gray-600">
          Each agent provides a confidence score (0-100%) indicating how certain they are about their analysis:
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          <li className="text-green-700">• ≥80%: High confidence - Very certain about the analysis</li>
          <li className="text-amber-600">• 60-79%: Moderate confidence - Some uncertainty but reasonably confident</li>
          <li className="text-red-600">• &lt;60%: Low confidence - Less certain about the analysis</li>
        </ul>
      </div>
    </div>
  );
};
