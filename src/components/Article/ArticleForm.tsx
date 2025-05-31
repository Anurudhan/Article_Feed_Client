import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'lucide-react';
import { CATEGORIES, type Article } from '../../types/Article';
import TagInput from '../Registration/TagInput';
import Button from '../UI/Button';
import InputField from '../UI/InputField';
import TextareaField from '../UI/TextareaField';

interface ArticleFormProps {
  initialArticle?: Article;
  onSubmit: (article: Partial<Article>) => void;
  isSubmitting?: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ 
  initialArticle, 
  onSubmit,
  isSubmitting = false,
}) => {
  const navigate = useNavigate();
  const [article, setArticle] = useState<Partial<Article>>(initialArticle || {
    title: '',
    content: '',
    category: '',
    image: '',
    tags: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setArticle(prev => ({ ...prev, tags }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!article.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!article.content?.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!article.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!article.image?.trim()) {
      newErrors.image = 'Image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(article);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <InputField
          name="title"
          label="Article Title"
          value={article.title || ''}
          onChange={handleChange}
          placeholder="Enter a compelling title"
          error={errors.title}
          required
        />
        
        <TextareaField
          name="content"
          label="Content"
          value={article.content || ''}
          onChange={handleChange}
          placeholder="Write your article content here..."
          error={errors.content}
          required
          rows={6}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={article.category || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 ${
                errors.category
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 hover:border-gray-300 focus:border-emerald-500 focus:ring-emerald-200'
              }`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                {errors.category}
              </p>
            )}
          </div>
          
          <InputField
            name="image"
            label="Image URL"
            value={article.image || ''}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            error={errors.image}
            required
            leftIcon={<Image className="h-4 w-4 text-gray-400" />}
          />
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">
            Tags (press Enter or comma to add)
          </label>
          <TagInput
            tags={article.tags || []}
            onChange={handleTagsChange}
          />
        </div>
        
        {article.image && (
          <div className="mt-4">
            <p className="text-sm text-slate-500 mb-2">Image Preview:</p>
            <div className="relative w-full h-40 rounded-md overflow-hidden bg-slate-100">
              <img
                src={article.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button 
          type="button" 
          variant="secondary"
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          isLoading={isSubmitting}
        >
          {initialArticle ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </form>
  );
};

export default ArticleForm;