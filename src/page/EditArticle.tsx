import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import type { Article } from '../types/Article';
import ArticleForm from '../components/Article/ArticleForm';
import { fetchArticleById, updateArticle } from '../service/articleService';


const EditArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) {
        setError('Article ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const articleId = id
        const data = await fetchArticleById(articleId);
        
        if (!data) {
          setError('Article not found');
        } else {
          setArticle(data);
        }
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleSubmit = async (articleData: Partial<Article>) => {
    if (!id || !article) return;
    
    setIsSubmitting(true);
    try {
      await updateArticle(id, articleData);
      navigate('/');
    } catch (err) {
      console.error('Failed to update article:', err);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <Loader className="h-8 w-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Article</h1>
      <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6">
        {article && (
          <ArticleForm 
            initialArticle={article} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default EditArticle;