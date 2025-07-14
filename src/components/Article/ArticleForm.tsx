import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES, DEFAULT_IMAGES, type Article } from '../../types/Article';
import TagInput from '../Registration/TagInput';
import Button from '../UI/Button';
import InputField from '../UI/InputField';
import TextareaField from '../UI/TextareaField';

interface ArticleFormProps {
  initialArticle?: Article;
  onSubmit: (article: Partial<Article>, isPublished?: boolean) => void;
  isSubmitting?: boolean;
}

interface TimeInput {
  hours: number;
  minutes: number;
  seconds: number;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ 
  initialArticle, 
  onSubmit,
  isSubmitting = false,
}) => {
  const navigate = useNavigate();
  
  // Convert initial readTime (in minutes) to hours/minutes/seconds
  const initialTime: TimeInput = initialArticle?.readTime 
    ? {
        hours: Math.floor(initialArticle.readTime / 60),
        minutes: initialArticle.readTime % 60,
        seconds: 0
      }
    : { hours: 0, minutes: 0, seconds: 0 };

  const [article, setArticle] = useState<Partial<Article>>(initialArticle || {
    title: '',
    content: '',
    category: '',
    image: '',
    tags: [],
    readTime: 0
  });
  const [timeInput, setTimeInput] = useState<TimeInput>(initialTime);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showImageSelector, setShowImageSelector] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('time_')) {
      const field = name.split('_')[1] as keyof TimeInput;
      const parsedValue = parseInt(value) || 0;
      setTimeInput(prev => ({
        ...prev,
        [field]: Math.max(0, parsedValue) // Ensure non-negative
      }));
      
      // Update article readTime in total minutes
      setArticle(prev => ({
        ...prev,
        readTime: (timeInput.hours * 60) + timeInput.minutes + (timeInput.seconds / 60)
      }));

      if (errors.readTime) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.readTime;
          return newErrors;
        });
      }
    } else {
      setArticle(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setArticle(prev => ({ ...prev, image: imageUrl }));
    setShowImageSelector(false);

    if (errors.image) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setArticle(prev => ({ ...prev, tags }));
  };

  const validateForm = (isPublishing: boolean = false): boolean => {
    const newErrors: Record<string, string> = {};

    // For publishing, all fields are required
    if (isPublishing) {
      if (!article.title?.trim()) newErrors.title = 'Title is required';
      if (!article.content?.trim()) newErrors.content = 'Content is required';
      if (!article.category) newErrors.category = 'Category is required';
      if (!article.image?.trim()) newErrors.image = 'Image selection is required';
      
      // Validate read time (minimum 1 minute)
      const totalMinutes = (timeInput.hours * 60) + timeInput.minutes + (timeInput.seconds / 60);
      if (totalMinutes < 1) {
        newErrors.readTime = 'Read time must be at least 1 minute';
      }
    }
    // For saving draft, only validate if fields have content
    else {
      // Validate read time only if any time field has been filled
      if (timeInput.hours > 0 || timeInput.minutes > 0 || timeInput.seconds > 0) {
        const totalMinutes = (timeInput.hours * 60) + timeInput.minutes + (timeInput.seconds / 60);
        if (totalMinutes < 1) {
          newErrors.readTime = 'Read time must be at least 1 minute';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent, isPublishing: boolean = false) => {
    e.preventDefault();
    if (validateForm(isPublishing)) {
      const totalMinutes = (timeInput.hours * 60) + timeInput.minutes + (timeInput.seconds / 60);
      const roundedReadTime = parseFloat(Math.max(1, totalMinutes).toFixed(2));
      const finalArticle = {
        ...article,
        readTime: totalMinutes > 0 ? roundedReadTime : 0,
        isPublished: isPublishing,
        ...(isPublishing && { publishedAt: new Date().toISOString() })
      };
      onSubmit(finalArticle, isPublishing);
    }
  };

  const getCurrentImageIndex = () => {
    return article.image ? DEFAULT_IMAGES.indexOf(article.image) : -1;
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Article Image
            </label>
            <button
              type="button"
              onClick={() => setShowImageSelector(!showImageSelector)}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 flex items-center justify-between ${
                errors.image
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 hover:border-gray-300 focus:border-emerald-500 focus:ring-emerald-200'
              }`}
            >
              <div className="flex items-center">
                <Image className="h-4 w-4 text-gray-400 mr-2" />
                <span className={article.image ? 'text-slate-700' : 'text-gray-400'}>
                  {article.image ? `Image ${getCurrentImageIndex() + 1} selected` : 'Select an image'}
                </span>
              </div>
              {showImageSelector ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            {errors.image && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                {errors.image}
              </p>
            )}
          </div>
        </div>

        {showImageSelector && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm font-medium text-slate-700 mb-3">Choose an image for your article:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
              {DEFAULT_IMAGES.map((imageUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleImageSelect(imageUrl)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    article.image === imageUrl 
                      ? 'border-emerald-500 ring-2 ring-emerald-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`Option ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                    }}
                  />
                  {article.image === imageUrl && (
                    <div className="absolute inset-0 bg-emerald-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-emerald-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">
            Tags (press Enter or comma to add)
          </label>
          <TagInput
            tags={article.tags || []}
            onChange={handleTagsChange}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <InputField
            name="time_hours"
            label="Hours"
            value={timeInput.hours}
            onChange={handleChange}
            placeholder="0"
            type="number"
            error={errors.readTime}
            inputClassName="appearance-none"
          />
          <InputField
            name="time_minutes"
            label="Minutes"
            value={timeInput.minutes}
            onChange={handleChange}
            placeholder="0"
            type="number"
            error={errors.readTime}
            inputClassName="appearance-none"
          />
          <InputField
            name="time_seconds"
            label="Seconds"
            value={timeInput.seconds}
            onChange={handleChange}
            placeholder="0"
            type="number"
            error={errors.readTime}
            inputClassName="appearance-none"
          />
        </div>

        {article.image && (
          <div className="mt-4">
            <p className="text-sm text-slate-500 mb-2">Selected Image Preview:</p>
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
          variant="secondary"
          isLoading={isSubmitting}
        >
          {initialArticle ? 'Save Draft' : 'Save Draft'}
        </Button>
        <Button 
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          isLoading={isSubmitting}
        >
          Publish
        </Button>
      </div>
    </form>
  );
};

export default ArticleForm;