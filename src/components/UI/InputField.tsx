import React, { memo } from 'react';

interface InputFieldProps {
  name: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Add onBlur prop
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  required?: boolean;
}

const InputField = memo<InputFieldProps>(
  ({
    name,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    onBlur, // Add to destructured props
    label,
    leftIcon,
    rightIcon,
    onRightIconClick,
    error,
    disabled = false,
    className = '',
    inputClassName = '',
    required = false,
  }) => (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 capitalize">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur} // Pass onBlur to the input element
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full ${leftIcon ? 'pl-10' : 'pl-3'} ${
            rightIcon ? 'pr-10' : 'pr-3'
          } py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 hover:border-gray-300 focus:border-emerald-500 focus:ring-emerald-200'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${inputClassName}`}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {onRightIconClick ? (
              <button
                type="button"
                onClick={onRightIconClick}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {rightIcon}
              </button>
            ) : (
              rightIcon
            )}
          </div>
        )}
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

export default InputField;