import React from 'react';
import { Check } from 'lucide-react';
import { CATEGORIES } from '../../types/Article';

interface ArticlePreferencesProps {
  selectedPreferences: string[];
  onChange: (categories: string[]) => void;
  maxSelections: number;
  error?: string;
}



const ArticlePreferences: React.FC<ArticlePreferencesProps> = ({
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
        <p className="text-sm text-red-500 mb-3">{error}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map((category) => {
          const isSelected = selectedPreferences.includes(category.id);
          return (
            <div
              key={category.id}
              onClick={() => handleToggleCategory(category.id)}
              className={`
                relative p-4 rounded-lg border cursor-pointer transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                ${selectedPreferences.length >= maxSelections && !isSelected ? 'opacity-60 cursor-not-allowed' : ''}
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 text-blue-600">
                  <Check size={18} />
                </div>
              )}
              <h4 className="font-medium text-gray-800">{category.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Selected: {selectedPreferences.length}/{maxSelections}
      </div>
    </div>
  );
};

export default ArticlePreferences;