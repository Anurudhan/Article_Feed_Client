import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import type { UserEntity, ValidationErrors } from '../../types/UserEntity';
import Button from '../UI/Button';
import InputField from '../UI/InputField';
import OTPVerification from './OTPVerification';

interface StepTwoProps {
  formData: UserEntity;
  errors: ValidationErrors;
  onChange: (field: keyof UserEntity, value: string | string[] | boolean) => void; // Updated type
  onBlur: (field: keyof UserEntity) => void;
  onVerifyEmail: () => void;
  isVerifyingEmail: boolean;
}

const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  errors,
  onChange,
  onBlur,
  onVerifyEmail,
  isVerifyingEmail,
}) => {
  const [showVerification, setShowVerification] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof UserEntity, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    onBlur(name as keyof UserEntity);
  };

  const handleStartVerification = () => {
    onVerifyEmail();
    setShowVerification(true);
  };

  const handleVerifyOTP = (isValid: boolean) => {
    if (isValid) {
      onChange('isEmailVerified', true); // Now matches the updated type
    }
  };

  const handleResendOTP = () => {
    console.log('Resending OTP...');
  };

  return (
    <div className="py-3">
      {!showVerification ? (
        <>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Verify Your Email</h3>
          <p className="text-sm text-gray-600 mb-5">
            We need to verify your email address. Click the button below to receive a verification code.
          </p>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-blue-500">
                <Mail size={20} />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-800">Verify your email address</h4>
                <p className="mt-1 text-xs text-gray-600">
                  We'll send a verification code to {formData.email || 'your email address'}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <Button
                onClick={handleStartVerification}
                isLoading={isVerifyingEmail}
                disabled={isVerifyingEmail}
                className="w-full sm:w-auto"
              >
                Send Verification Code
              </Button>
            </div>
          </div>
        </>
      ) : formData.isEmailVerified ? (
        <>
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800">Email Verified</h4>
                <p className="mt-1 text-xs text-green-600">
                  Your email address has been successfully verified.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-800 mb-2">Create Your Password</h3>
          <p className="text-sm text-gray-600 mb-5">
            Choose a secure password for your account.
          </p>

          <div className="space-y-4">
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              leftIcon={<Lock size={18} />}
              required
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              leftIcon={<Lock size={18} />}
              required
            />
          </div>
        </>
      ) : (
        <OTPVerification
          onVerify={handleVerifyOTP}
          isVerifying={isVerifyingEmail}
          resendOTP={handleResendOTP}
        />
      )}
    </div>
  );
};

export default StepTwo;