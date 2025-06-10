import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article, createArticleEntity } from '../types/Article';
import ArticleForm from '../components/Article/ArticleForm';
import { createArticle } from '../service/articleService';
import { useToast } from '../contexts/ToastContext';



const CreateArticle: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const handleSubmit = async (formData: Partial<Article>) => {
    console.log("this is submitting")

    setIsSubmitting(true);

    const enrichedData: createArticleEntity = {
      title: formData.title ?? '',
      content: formData.content ?? '',
      publishedAt: new Date().toISOString(),
      category: formData.category ?? '',
      image: formData.image ?? '',
      readTime: formData.readTime ?? 1,
      tags: formData.tags ?? [],
    };

    try {
      const response = await createArticle(enrichedData);

      if(response){
        showToast("You successfully created an article !..","success")
      }
      navigate('/myarticle');
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