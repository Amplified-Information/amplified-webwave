
import { Newspaper } from "lucide-react";

export const MLDemoHeader = () => {
  return (
    <div className="text-center mb-12">
      <Newspaper className="w-12 h-12 mx-auto mb-4 text-primary" />
      <h1 className="text-4xl font-bold mb-4">News Article Analysis with AI</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        Upload or paste news articles for AI-powered analysis of bias and journalistic quality
      </p>
    </div>
  );
};
