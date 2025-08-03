import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';
import type { Article } from '../types/Article';
import ArticleForm from '../components/Article/ArticleForm';
import { getArticleById, updateArticle } from '../service/articleService';
import { useToast } from '../contexts/ToastContext';

const EditArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // Try to get article from router state first
  const articleFromState = location.state?.article as Article | undefined;

  const [article, setArticle] = useState<Article | null>(articleFromState || null);
  const [isLoading, setIsLoading] = useState(!articleFromState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Only fetch if we don't have article from state
    if (!articleFromState && id) {
      setIsLoading(true);
      getArticleById(id)
        .then(data => {
          setArticle(data);
          setIsLoading(false);
        })
        .catch(() => {
          setError('Failed to load article');
          setIsLoading(false);
        });
    }
  }, [id, articleFromState]);

  const handleSubmit = async (articleData: Partial<Article>, isPublished?: boolean) => {


    setIsSubmitting(true);
    try {
      const updatedData: Partial<Article> = {
        ...articleData,
        isPublished: isPublished ?? false, // Respect isPublished from ArticleForm
        publishedAt: isPublished ? new Date().toISOString() : undefined, // Update publishedAt only if publishing
      };
      await updateArticle(articleData._id as string, updatedData);
      showToast('Article updated successfully!', 'success');
      navigate('/myarticle');
    } catch {
      setError('Failed to update article');
      showToast('Failed to update article', 'error');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/my-articles')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      {article && (
        <ArticleForm
          initialArticle={article}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default EditArticle;