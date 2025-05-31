import React from 'react';
// import ArticlePreferences from './ArticlePreferences';
import type { UserEntity, ValidationErrors } from '../../types/UserEntity';
import ArticlePreferences from '../Article/ArticlePreferences';


interface StepThreeProps {
  formData: UserEntity;
  errors: ValidationErrors;
  onChange: (field: keyof UserEntity, value: string[]) => void;
}

const StepThree: React.FC<StepThreeProps> = ({
  formData,
  errors,
  onChange
}) => {
  const handlePreferencesChange = (categories: string[]) => {
    onChange('articlePreferences', categories);
  };

  return (
    <div className="py-3">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Almost Done!</h3>
      <p className="text-sm text-gray-600 mb-5">
        Customize your experience by selecting categories that interest you.
      </p>
      
      <ArticlePreferences 
        selectedPreferences={formData.articlePreferences}
        onChange={handlePreferencesChange}
        maxSelections={3}
        error={errors.articlePreferences}
      />
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              By completing registration, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;