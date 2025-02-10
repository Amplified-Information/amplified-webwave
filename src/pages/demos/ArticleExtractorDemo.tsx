
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleExtractionForm } from "@/components/demos/article-extractor/ArticleExtractionForm";
import { useState } from "react";

const ArticleExtractorDemo = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitUrl = async (url: string) => {
    try {
      // Validate URL
      new URL(url);
      setPreviewUrl(url);
      setError(null);
    } catch (err) {
      setError("Please enter a valid URL");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-6 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Article Extractor</CardTitle>
            <CardDescription>
              Extract and analyze content from any article URL. Simply paste the URL 
              and our system will extract the main content, metadata, and other relevant information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ArticleExtractionForm 
              onSubmit={handleSubmitUrl}
              isExtracting={false}
              error={error}
            />
          </CardContent>
        </Card>

        {previewUrl && (
          <Card className="h-[800px] overflow-hidden">
            <CardHeader>
              <CardTitle>Original Page</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <iframe 
                src={previewUrl}
                className="w-full h-full border-0"
                title="Original article preview"
                sandbox="allow-same-origin allow-scripts"
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ArticleExtractorDemo;
