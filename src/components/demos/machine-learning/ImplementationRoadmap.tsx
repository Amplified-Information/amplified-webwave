
import { Clock, CheckCircle2 } from "lucide-react";

export const ImplementationRoadmap = () => {
  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg mb-12">
      <h2 className="text-xl font-semibold mb-4">Implementation Roadmap</h2>
      <div className="grid gap-4 text-left">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 mt-1 text-orange-500" />
          <div>
            <h3 className="font-medium">1. Database Setup</h3>
            <p className="text-sm text-gray-600">Creating tables for article analyses, user submissions, and results tracking</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 mt-1 text-orange-500" />
          <div>
            <h3 className="font-medium">2. Backend Infrastructure</h3>
            <p className="text-sm text-gray-600">Edge functions for article processing, URL scraping, and CrewAI integration</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 mt-1 text-orange-500" />
          <div>
            <h3 className="font-medium">3. Analysis Components</h3>
            <p className="text-sm text-gray-600">AI agents for bias detection, fact-checking, quality assessment, and credibility evaluation</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 mt-1 text-green-500" />
          <div>
            <h3 className="font-medium">4. Frontend Implementation</h3>
            <p className="text-sm text-gray-600">Basic form interface complete, pending results display and historical view</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 mt-1 text-orange-500" />
          <div>
            <h3 className="font-medium">5. Integrations</h3>
            <p className="text-sm text-gray-600">Supabase connection, OpenAI setup, and real-time updates</p>
          </div>
        </div>
      </div>
    </div>
  );
};
