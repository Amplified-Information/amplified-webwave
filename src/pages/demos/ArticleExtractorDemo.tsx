
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleExtractionForm } from "@/components/demos/article-extractor/ArticleExtractionForm";
import { ExtractedArticle } from "@/components/demos/article-extractor/ExtractedArticle";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ArticleExtractorDemo = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedArticle, setExtractedArticle] = useState<any>(null);
  const [rawHtml, setRawHtml] = useState<string | null>(null);

  const handleSubmitUrl = async (url: string) => {
    try {
      // Validate URL
      new URL(url);
      setPreviewUrl(url);
      setError(null);
      setIsExtracting(true);
      setRawHtml(null);

      // Call the extract-article edge function
      const { data, error: extractError } = await supabase.functions.invoke('extract-article', {
        body: { url }
      });

      if (extractError) {
        console.error('Edge function error:', extractError);
        throw new Error(extractError.message);
      }

      if (!data) {
        throw new Error('No data returned from extraction');
      }

      // Set the raw HTML from the edge function response (which is now the cleaned content)
      setRawHtml(data.rawHtml);
      
      // Remove rawHtml from the data before setting extracted article
      const { rawHtml: _, ...articleData } = data;
      setExtractedArticle({
        id: Date.now().toString(), // temporary ID for the interface
        ...articleData
      });
    } catch (err: any) {
      console.error('Article extraction error:', err);
      const errorMessage = err.message || 'Failed to extract article';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsExtracting(false);
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
              isExtracting={isExtracting}
              error={error}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

          {rawHtml && (
            <Card className="h-[800px] overflow-hidden">
              <CardHeader>
                <CardTitle>Extracted Content</CardTitle>
                <CardDescription>Content that will be sent to AI for analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-4 h-full overflow-auto">
                <pre className="text-xs whitespace-pre-wrap break-words">
                  {rawHtml}
                </pre>
              </CardContent>
            </Card>
          )}

          {extractedArticle && (
            <ExtractedArticle article={extractedArticle} />
          )}
        </div>
      </main>
    </div>
  );
};

export default ArticleExtractorDemo;
