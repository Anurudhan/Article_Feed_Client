import React from 'react';
import { Check } from 'lucide-react';
import { CATEGORIES } from '../../types/Article';


interface ArticlePreferencesProps {
  selectedPreferences: string[];
  onChange: (categories: string[]) => void;
  maxSelections: number;
  error?: string;
}

const ArticlePreferencesProfile: React.FC<ArticlePreferencesProps> = ({
  selectedPreferences,
  onChange,
  maxSelections,
  error
}) => {
  const handleToggleCategory = (categoryId: string) => {
    if (selectedPreferences.includes(categoryId)) {
      onChange(selectedPreferences.filter(id => id !== categoryId));
    } else {
      if (selectedPreferences.length < maxSelections) {
        onChange([...selectedPreferences, categoryId]);
      }
    }
  };

  return (
    <div className="py-3">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Choose Your Interests</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select up to {maxSelections} categories that interest you the most. We'll customize your content based on your preferences.
      </p>
      
      {error && (
        <p className="text-sm text-red-500 mb-3 flex items-center">
          <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
          {error}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map((category) => {
          const isSelected = selectedPreferences.includes(category.id);
          const isDisabled = selectedPreferences.length >= maxSelections && !isSelected;
          
          return (
            <div
              key={category.id}
              onClick={() => !isDisabled && handleToggleCategory(category.id)}
              className={`
                relative p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
              `}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-emerald-600 bg-white rounded-full p-1 shadow-sm">
                  <Check size={14} />
                </div>
              )}
              <h4 className="font-medium text-gray-800 pr-6">{category.name}</h4>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{category.description}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Selected: <span className="font-medium">{selectedPreferences.length}/{maxSelections}</span>
        </div>
        {selectedPreferences.length === maxSelections && (
          <div className="text-sm text-emerald-600 font-medium">
            Maximum selections reached
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlePreferencesProfile;