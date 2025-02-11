
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleExtractionForm } from "@/components/demos/article-extractor/ArticleExtractionForm";
import { ExtractedArticle } from "@/components/demos/article-extractor/ExtractedArticle";
import { ArticleExtractorDiagram } from "@/components/demos/article-extractor/ArticleExtractorDiagram";
import { ArticleDatabaseDiagram } from "@/components/demos/article-extractor/ArticleDatabaseDiagram";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ArticleExtractorDemo = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedArticle, setExtractedArticle] = useState<any>(null);
  const [rawContent, setRawContent] = useState<string | null>(null);
  const [rawHtml, setRawHtml] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Effect to get HTML content from iframe after it loads
  useEffect(() => {
    if (previewUrl && iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        try {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDocument) {
            const html = iframeDocument.documentElement.outerHTML;
            setRawHtml(html);
          }
        } catch (err) {
          console.error('Error accessing iframe content:', err);
          toast.error('Unable to access page content due to security restrictions');
        }
      };
    }
  }, [previewUrl]);

  const handleSubmit = async (url: string) => {
    try {
      // Validate URL
      new URL(url);
      setPreviewUrl(url);
      setError(null);
      setIsExtracting(true);
      setExtractedArticle(null);
      setRawContent(null);
      setRawHtml(null);

      // Call the extract-article edge function
      const { data, error: extractError } = await supabase.functions.invoke('extract-article', {
        body: { url }
      });

      if (extractError) {
        console.error('Edge function error:', extractError);
        const errorDetails = typeof extractError === 'object' && extractError.message 
          ? extractError.message 
          : 'Failed to extract article content';
        setError(errorDetails);
        setRawContent(`Error extracting content: ${errorDetails}`);
        toast.error(errorDetails);
        return;
      }

      if (!data) {
        throw new Error('No data returned from extraction');
      }

      // Set the raw content from the response
      setRawContent(data.rawContent);
      setExtractedArticle({
        id: Date.now().toString(), // temporary ID for the interface
        ...data
      });
    } catch (err: any) {
      console.error('Article extraction error:', err);
      const errorMessage = err.message || 'Failed to extract article';
      setError(errorMessage);
      setRawContent(`Error: ${errorMessage}`);
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
          <CardContent className="space-y-6">
            <ArticleExtractionForm 
              onSubmit={handleSubmit}
              isExtracting={isExtracting}
              error={error}
            />

            <Tabs defaultValue="process" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="process">Process Flow</TabsTrigger>
                <TabsTrigger value="datamodel">Data Model</TabsTrigger>
              </TabsList>
              <TabsContent value="process">
                <ArticleExtractorDiagram />
              </TabsContent>
              <TabsContent value="datamodel">
                <ArticleDatabaseDiagram />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {previewUrl && (
            <Card className="h-[800px] overflow-hidden">
              <CardHeader>
                <CardTitle>Original Page</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <iframe 
                  ref={iframeRef}
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
                <CardTitle>Raw HTML</CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono p-4 bg-gray-50 rounded">
                  {rawHtml}
                </pre>
              </CardContent>
            </Card>
          )}

          {rawContent && (
            <Card className="h-[800px] overflow-hidden">
              <CardHeader>
                <CardTitle>
                  {error ? (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      Extraction Error
                    </div>
                  ) : (
                    "Raw Extracted Content"
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-auto">
                {error ? (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{rawContent}</AlertDescription>
                  </Alert>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm font-mono p-4 bg-gray-50 rounded">
                    {rawContent}
                  </pre>
                )}
              </CardContent>
            </Card>
          )}

          {extractedArticle && !error && (
            <ExtractedArticle article={extractedArticle} />
          )}
        </div>
      </main>
    </div>
  );
};

export default ArticleExtractorDemo;
