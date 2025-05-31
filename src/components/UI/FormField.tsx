import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  children
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={htmlFor} 
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;