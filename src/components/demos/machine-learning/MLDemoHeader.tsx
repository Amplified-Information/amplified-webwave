
import { Newspaper } from "lucide-react";

export const MLDemoHeader = () => {
  return (
    <div className="text-center mb-12">
      <Newspaper className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h1 className="text-4xl font-bold mb-4">News Article Analysis with AI</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
        Upload or paste news articles for AI-powered analysis of bias and journalistic quality
      </p>
      <div className="flex items-center justify-center gap-8 mt-6">
        <div className="flex items-center gap-2">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" 
            alt="OpenAI Logo" 
            className="h-8 w-8"
          />
          <a 
            href="https://openai.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-gray-500 hover:text-primary underline"
          >
            Powered by OpenAI
          </a>
        </div>
        <div className="flex items-center gap-2">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Crewai.png" 
            alt="CrewAI Logo" 
            className="h-8 w-8"
          />
          <a 
            href="https://github.com/joaomdmoura/crewAI" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-gray-500 hover:text-primary underline"
          >
            Built with CrewAI
          </a>
        </div>
      </div>
    </div>
  );
};
