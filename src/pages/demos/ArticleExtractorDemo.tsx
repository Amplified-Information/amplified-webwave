
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleExtractionForm } from "@/components/demos/article-extractor/ArticleExtractionForm";
import { ExtractedArticle } from "@/components/demos/article-extractor/ExtractedArticle";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ArticleData {
  id: string;
  title: string | null;
  description: string | null;
  author: string | null;
  published: string | null;
  content: string;
  url: string | null;
  source: string | null;
  ttr: number | null;
}

const ArticleExtractorDemo = () => {
  const [extractedArticle, setExtractedArticle] = useState<ArticleData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtraction = async (url: string) => {
    setIsExtracting(true);
    setError(null);
    
    try {
      const { data: extractionData, error: extractionError } = await supabase.functions
        .invoke('extract-article', {
          body: { url }
        });

      if (extractionError) throw extractionError;

      if (!extractionData?.content) {
        throw new Error('No content found in the article');
      }

      // Store the extracted article in the database
      const { data: savedArticle, error: saveError } = await supabase
        .from('extracted_articles')
        .insert({
          url: extractionData.url,
          title: extractionData.title,
          description: extractionData.description,
          author: extractionData.author,
          published: extractionData.published,
          content: extractionData.content,
          source: extractionData.source,
          ttr: extractionData.ttr
        })
        .select()
        .single();

      if (saveError) throw saveError;
      
      setExtractedArticle(savedArticle);
    } catch (err: any) {
      console.error('Article extraction error:', err);
      setError(err.message || 'Failed to extract article content');
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
              onSubmit={handleExtraction}
              isExtracting={isExtracting}
              error={error}
            />
          </CardContent>
        </Card>

        {extractedArticle && (
          <ExtractedArticle article={extractedArticle} />
        )}
      </main>
    </div>
  );
};

export default ArticleExtractorDemo;
