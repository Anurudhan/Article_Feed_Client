import React, { memo } from 'react';

interface TextareaFieldProps {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  textareaClassName?: string;
  required?: boolean;
  rows?: number;
}

const TextareaField = memo<TextareaFieldProps>(
  ({
    name,
    placeholder = '',
    value,
    onChange,
    onBlur,
    label,
    error,
    disabled = false,
    className = '',
    textareaClassName = '',
    required = false,
    rows = 6,
  }) => (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 capitalize">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 hover:border-gray-300 focus:border-emerald-500 focus:ring-emerald-200'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${textareaClassName}`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center">
          <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
          {error}
        </p>
      )}
    </div>
  )
);

export default TextareaField;