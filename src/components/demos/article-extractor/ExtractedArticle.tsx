
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Calendar, Link as LinkIcon } from "lucide-react";

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

interface ExtractedArticleProps {
  article: ArticleData;
}

export const ExtractedArticle = ({ article }: ExtractedArticleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{article.title || "Extracted Article"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {article.author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
          )}
          {article.published && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.published).toLocaleDateString()}</span>
            </div>
          )}
          {article.ttr && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.ttr} min read</span>
            </div>
          )}
          {article.url && (
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Original Article
              </a>
            </div>
          )}
        </div>

        {article.description && (
          <div className="text-lg text-gray-600 italic">
            {article.description}
          </div>
        )}

        <div className="prose max-w-none">
          {article.content}
        </div>
      </CardContent>
    </Card>
  );
};
