import React from 'react';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  totalSteps
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div 
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full mb-1 transition-all
                  ${index + 1 === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : index + 1 < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'}
                `}
              >
                {index + 1 < currentStep ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`text-xs font-medium ${index + 1 === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                Step {index + 1}
              </span>
            </div>
            
            {index < totalSteps - 1 && (
              <div 
                className={`
                  flex-1 h-1 mx-2 rounded-full
                  ${index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">Personal Info</span>
        <span className="text-xs text-gray-500">Verification</span>
        <span className="text-xs text-gray-500">Preferences</span>
      </div>
    </div>
  );
};

export default FormProgress;