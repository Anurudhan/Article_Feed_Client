import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../types/Article';
import ArticleForm from '../components/Article/ArticleForm';


const CreateArticle: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (articleData: Partial<Article>) => {
    setIsSubmitting(true);
    try {
      await CreateArticle(articleData);
      navigate('/');
    } catch (error) {
      console.error('Failed to create article:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Create New Article</h1>
      <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6">
        <ArticleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateArticle;