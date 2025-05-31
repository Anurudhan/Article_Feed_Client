import React, { useState, useEffect, useRef } from 'react';
import Button from '../UI/Button';

interface OTPVerificationProps {
  onVerify: (isValid: boolean) => void;
  isVerifying: boolean;
  resendOTP: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  onVerify,
  isVerifying,
  resendOTP
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input if current one is filled
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit) && newOtp.join('').length === 4) {
      setError('');
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 4).split('');
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 4) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    // Focus the appropriate field
    if (digits.length < 4) {
      inputRefs.current[digits.length]?.focus();
    } else {
      inputRefs.current[3]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.some(digit => !digit)) {
      setError('Please enter the complete verification code');
      return;
    }

    // For demo purposes, let's consider "1234" as the valid OTP
    const isValid = otp.join('') === '1234';

    if (!isValid) {
      setError('Invalid verification code. Please try again.');
      return;
    }

    onVerify(true);
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '']);
    setTimeLeft(30);
    setError('');
    resendOTP();
  };

  return (
    <div className="py-3">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Email Verification</h3>
      <p className="text-sm text-gray-600 mb-4">
        We've sent a verification code to your email address. Please enter the 4-digit code below.
      </p>

      <div className="flex justify-center mb-6">
        {otp.map((digit, index) => (
          <div key={index} className="mx-1">
            <input
              ref={(el) => {
                inputRefs.current[index] = el; // Explicitly assign without returning
              }}
              type="text"
              className={`
                w-12 h-14 text-center text-xl font-semibold border rounded-lg
                focus:outline-none focus:ring-2 
                ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'}
              `}
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              autoFocus={index === 0}
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

      <div className="flex flex-col items-center">
        <Button 
          variant="primary" 
          onClick={handleVerify} 
          isLoading={isVerifying}
          disabled={otp.some(digit => !digit) || isVerifying}
          className="mb-4"
        >
          Verify
        </Button>

        <div className="text-sm text-gray-600">
          {timeLeft > 0 ? (
            <span>Resend code in <span className="font-medium">{timeLeft}s</span></span>
          ) : (
            <button 
              onClick={handleResendOTP}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;