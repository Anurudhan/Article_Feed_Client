import React from 'react';
import { User, Phone, Mail } from 'lucide-react';

interface PersonalInfoProps {
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dob: string;
  };
  errors: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    dob?: string;
  };
  onChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
}

const PersonalInformation: React.FC<PersonalInfoProps> = ({ 
  formData, 
  errors, 
  onChange,
  onBlur 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    onBlur(name);
  };

  const handleDateChange = (type: 'year' | 'month' | 'day', value: string) => {
    const [year, month, day] = formData.dob.split('-');
    let newDate = '';
    
    switch (type) {
      case 'year':
        newDate = `${value}-${month || '01'}-${day || '01'}`;
        break;
      case 'month':
        newDate = `${year || new Date().getFullYear()}-${value.padStart(2, '0')}-${day || '01'}`;
        break;
      case 'day':
        newDate = `${year || new Date().getFullYear()}-${month || '01'}-${value.padStart(2, '0')}`;
        break;
    }
    onChange('dob', newDate);
  };

  return (
    <div className="py-3">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Information</h3>
      <p className="text-sm text-gray-600 mb-5">
        Please provide your personal details to create your account.
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full py-2.5 pl-10 pr-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 ${
                  errors.firstName 
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
                }`}
                placeholder="Enter your first name"
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                {errors.firstName}
              </p>
            )}
          </div>
          
          {/* Last Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full py-2.5 pl-10 pr-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 ${
                  errors.lastName 
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
                }`}
                placeholder="Enter your last name"
              />
            </div>
            {errors.lastName && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                {errors.lastName}
              </p>
            )}
          </div>
        </div>
        
        {/* Phone Number */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full py-2.5 pl-10 pr-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 ${
                errors.phone 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
              }`}
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
              {errors.phone}
            </p>
          )}
        </div>
        
        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full py-2.5 pl-10 pr-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-150 ${
                errors.email 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
              }`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
              {errors.email}
            </p>
          )}
        </div>
        
        {/* Date of Birth */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <div className="grid grid-cols-3 gap-4">
            <select 
              name="month"
              className="w-full py-2.5 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-colors duration-150"
              value={formData.dob.split('-')[1] || ''}
              onChange={(e) => handleDateChange('month', e.target.value)}
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
              onChange={(e) => handleDateChange('day', e.target.value)}
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
              onChange={(e) => handleDateChange('year', e.target.value)}
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

export default PersonalInformation;