
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, Clock } from "lucide-react";
import { ArticleData } from "../AnalysisForm";

interface AlertMessagesProps {
  error: string | null;
  retryDelay: number;
  articleData: ArticleData | null;
}

export const AlertMessages = ({ error, retryDelay, articleData }: AlertMessagesProps) => {
  return (
    <>
      <Alert variant="default" className="mb-6 border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-600">Important Note About News Articles</AlertTitle>
        <AlertDescription className="text-blue-700">
          Many news providers actively block automated access to their content. If you&apos;re trying to extract content from a news website, you might encounter access restrictions. For best results, try using publicly accessible blog posts or articles, or consider copying and pasting the article content directly into the analysis tool.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {retryDelay > 0 ? "Please Wait" : "Error"}
          </AlertTitle>
          <AlertDescription>
            {retryDelay > 0 
              ? `${error} (${retryDelay} seconds remaining)`
              : error
            }
          </AlertDescription>
        </Alert>
      )}

      {articleData && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>{articleData.title || 'Article Extracted'}</AlertTitle>
          <AlertDescription className="space-y-2">
            {articleData.author && <p>Author: {articleData.author}</p>}
            {articleData.published && <p>Published: {new Date(articleData.published).toLocaleDateString()}</p>}
            {articleData.ttr && (
              <p className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Reading time: {articleData.ttr} minutes
              </p>
            )}
            {articleData.description && <p>{articleData.description}</p>}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
