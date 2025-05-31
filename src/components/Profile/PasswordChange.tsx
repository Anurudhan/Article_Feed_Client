import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordChangeProps {
  formData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  errors: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  onChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({ 
  formData, 
  errors, 
  onChange,
  onBlur 
}) => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    onBlur(name);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { level: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (score === 3) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium' };
    if (score === 4) return { level: 'strong', color: 'bg-green-500', text: 'Strong' };
    return { level: 'very-strong', color: 'bg-emerald-500', text: 'Very Strong' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="py-3">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Change Password</h3>
      <p className="text-sm text-gray-600 mb-5">
        Update your password to keep your account secure. Make sure it's strong and unique.
      </p>
      
      <div className="space-y-4">
        {/* Current Password */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full py-2.5 pl-10 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 ${
                errors.currentPassword 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
              }`}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.current ? (
                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
              {errors.currentPassword}
            </p>
          )}
        </div>
        
        {/* New Password */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full py-2.5 pl-10 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 ${
                errors.newPassword 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
              }`}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.new ? (
                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Password strength:</span>
                <span className={`text-xs font-medium ${
                  passwordStrength.level === 'weak' ? 'text-red-600' :
                  passwordStrength.level === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.text}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ 
                    width: passwordStrength.level === 'weak' ? '25%' :
                           passwordStrength.level === 'medium' ? '50%' :
                           passwordStrength.level === 'strong' ? '75%' : '100%'
                  }}
                ></div>
              </div>
            </div>
          )}
          
          {errors.newPassword && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
              {errors.newPassword}
            </p>
          )}
        </div>
        
        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full py-2.5 pl-10 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 ${
                errors.confirmPassword 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
              }`}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-center">
              <span className={`inline-block w-1 h-1 rounded-full mr-2 ${
                formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              At least 8 characters long
            </li>
            <li className="flex items-center">
              <span className={`inline-block w-1 h-1 rounded-full mr-2 ${
                /[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              One uppercase letter
            </li>
            <li className="flex items-center">
              <span className={`inline-block w-1 h-1 rounded-full mr-2 ${
                /[a-z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              One lowercase letter
            </li>
            <li className="flex items-center">
              <span className={`inline-block w-1 h-1 rounded-full mr-2 ${
                /[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              One number
            </li>
            <li className="flex items-center">
              <span className={`inline-block w-1 h-1 rounded-full mr-2 ${
                /[^A-Za-z0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              One special character
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;