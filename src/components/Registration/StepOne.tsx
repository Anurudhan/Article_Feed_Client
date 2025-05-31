import React from 'react';
import { User, Phone, Mail } from 'lucide-react';
import type { UserEntity, ValidationErrors } from '../../types/UserEntity';
import InputField from '../UI/InputField';

interface StepOneProps {
  formData: UserEntity;
  errors: ValidationErrors;
  onChange: (field: keyof UserEntity, value: string | string[] | boolean) => void;
  onBlur: (field: keyof UserEntity) => void;
}

const StepOne: React.FC<StepOneProps> = ({ 
  formData, 
  errors, 
  onChange,
  onBlur 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof UserEntity, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    onBlur(name as keyof UserEntity);
  };

  return (
    <div className="py-3">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Information</h3>
      <p className="text-sm text-gray-600 mb-5">
        Please provide your personal details to create your account.
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField 
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.firstName}
            leftIcon={<User className="w-5 h-5 text-gray-400" />}
            required
          />
          
          <InputField 
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.lastName}
            leftIcon={<User className="w-5 h-5 text-gray-400" />}
            required
          />
        </div>
        
        <InputField 
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          leftIcon={<Phone className="w-5 h-5 text-gray-400" />}
          required
        />
        
        <InputField 
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
          required
        />
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <div className="grid grid-cols-3 gap-4">
            <select 
              name="month"
              className="w-full py-2.5 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-colors duration-150"
              value={formData.dob.split('-')[1] || ''}
              onChange={(e) => {
                const [year, , day] = formData.dob.split('-');
                onChange('dob', `${year || new Date().getFullYear()}-${e.target.value.padStart(2, '0')}-${day || '01'}`);
              }}
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                return (
                  <option key={month} value={month.toString().padStart(2, '0')}>
                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                  </option>
                );
              })}
            </select>
            
            <select 
              name="day"
              className="w-full py-2.5 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-colors duration-150"
              value={formData.dob.split('-')[2] || ''}
              onChange={(e) => {
                const [year, month] = formData.dob.split('-');
                onChange('dob', `${year || new Date().getFullYear()}-${month || '01'}-${e.target.value.padStart(2, '0')}`);
              }}
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                return (
                  <option key={day} value={day.toString().padStart(2, '0')}>
                    {day}
                  </option>
                );
              })}
            </select>
            
            <select 
              name="year"
              className="w-full py-2.5 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-colors duration-150"
              value={formData.dob.split('-')[0] || ''}
              onChange={(e) => {
                const [, month, day] = formData.dob.split('-');
                onChange('dob', `${e.target.value}-${month || '01'}-${day || '01'}`);
              }}
            >
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          {errors.dob && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
              {errors.dob}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepOne;