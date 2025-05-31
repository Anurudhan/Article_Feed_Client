import React, { useState } from 'react';
import FormProgress from './FormProgress';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import type { UserEntity, ValidationErrors } from '../../types/UserEntity';
import { validateArticlePreferences, validateConfirmPassword, validateDOB, validateEmail, validateName, validatePassword, validatePhone } from '../Validation/Validations';
import Button from '../UI/Button';
import  { useToast } from '../../contexts/ToastContext';
import axiosInstance, { type CustomResponse } from '../utilities/AxiosInstance';
import type { User } from '../../types/loginEntity';
import { useNavigate } from 'react-router-dom';

type FormData = UserEntity;

const RegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const {showToast} =useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    articlePreferences: [],
    isEmailVerified: false,
    otp: ['', '', '', '']
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    if (step === 1) {
      const firstNameError = validateName(formData.firstName);
      const lastNameError = validateName(formData.lastName);
      const phoneError = validatePhone(formData.phone);
      const emailError = validateEmail(formData.email);
      const dobError = validateDOB(formData.dob);

      if (firstNameError) newErrors.firstName = firstNameError;
      if (lastNameError) newErrors.lastName = lastNameError;
      if (phoneError) newErrors.phone = phoneError;
      if (emailError) newErrors.email = emailError;
      if (dobError) newErrors.dob = dobError;

      setTouched({
        ...touched,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        dob: true
      });
    }

    if (step === 2) {
      if (!formData.isEmailVerified) {
        newErrors.email = 'Email must be verified before proceeding';
        return false;
      }

      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

      if (passwordError) newErrors.password = passwordError;
      if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

      setTouched({
        ...touched,
        password: true,
        confirmPassword: true
      });
    }

    if (step === 3) {
      const preferencesError = validateArticlePreferences(formData.articlePreferences);

      if (preferencesError) newErrors.articlePreferences = preferencesError;

      setTouched({
        ...touched,
        articlePreferences: true
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string | string[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (touched[field] && field !== 'isEmailVerified' && field !== 'otp') {
      let fieldError: string | undefined;

      switch (field) {
        case 'firstName':
        case 'lastName':
          fieldError = validateName(value as string);
          break;
        case 'phone':
          fieldError = validatePhone(value as string);
          break;
        case 'email':
          fieldError = validateEmail(value as string);
          break;
        case 'dob':
          fieldError = validateDOB(value as string);
          break;
        case 'password':
          fieldError = validatePassword(value as string);
          if (touched.confirmPassword) {
            const confirmError = validateConfirmPassword(
              value as string,
              formData.confirmPassword
            );
            if (confirmError) {
              setErrors(prev => ({
                ...prev,
                confirmPassword: confirmError
              }));
            } else {
              setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.confirmPassword;
                return newErrors;
              });
            }
          }
          break;
        case 'confirmPassword':
          fieldError = validateConfirmPassword(formData.password, value as string);
          break;
        case 'articlePreferences':
          fieldError = validateArticlePreferences(value as string[]);
          break;
        default:
          break;
      }

      if (fieldError) {
        setErrors(prev => ({
          ...prev,
          [field]: fieldError
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    if (field === 'isEmailVerified' || field === 'otp') return;

    let fieldError: string | undefined;

    switch (field) {
      case 'firstName':
      case 'lastName':
        fieldError = validateName(formData[field] as string);
        break;
      case 'phone':
        fieldError = validatePhone(formData.phone);
        break;
      case 'email':
        fieldError = validateEmail(formData.email);
        break;
      case 'dob':
        fieldError = validateDOB(formData.dob);
        break;
      case 'password':
        fieldError = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        fieldError = validateConfirmPassword(formData.password, formData.confirmPassword);
        break;
      case 'articlePreferences':
        fieldError = validateArticlePreferences(formData.articlePreferences);
        break;
      default:
        break;
    }

    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [field]: fieldError
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    const isValid = validateStep(currentStep);

    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleVerifyEmail = () => {
    setIsVerifyingEmail(true);
    setTimeout(() => {
      setIsVerifyingEmail(false);
      setFormData(prev => ({
        ...prev,
        isEmailVerified: true
      }));
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateStep(currentStep);

    if (isValid) {
      try {
        setIsSubmitting(true);
        const response = await axiosInstance.post<CustomResponse<User>>('/signup', formData);
        if(response.data.success){
          showToast(response.data.message,"success");
          navigate("/login")
        }
      } catch (error) {
        console.log(error)
        showToast(error?error as string:"An unknown message","error")
      }
      
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-6 px-4 sm:py-8 lg:py-12">
      {/* Newspaper-style background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Newspaper Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="border-t-4 border-b-4 border-amber-800 py-6 mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-900 font-serif tracking-wide">
              THE KNOWARIA
            </h1>
            <div className="flex items-center justify-center mt-2 space-x-4 text-sm text-amber-700 font-serif">
              <span>EST. 2025</span>
              <span>•</span>
              <span>DIGITAL EDITION</span>
              <span>•</span>
              <span>FREE REGISTRATION</span>
            </div>
          </div>
          
          <div className="bg-amber-900 text-amber-50 py-4 px-6 transform -skew-x-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-wide">
              JOIN OUR ARTICLE
            </h2>
            <p className="text-amber-100 mt-2 font-serif text-lg">
              Become part of our community of readers and writers
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 sm:p-8 lg:p-12 relative">
          {/* Newspaper columns effect */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-amber-200 ml-8 hidden lg:block" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-amber-200 mr-8 hidden lg:block" />
          
          <FormProgress currentStep={currentStep} totalSteps={3} />

          <form onSubmit={handleSubmit} className="relative">
            <div className="lg:columns-1 lg:gap-8">
              {currentStep === 1 && (
                <StepOne
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              )}

              {currentStep === 2 && (
                <StepTwo
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onVerifyEmail={handleVerifyEmail}
                  isVerifyingEmail={isVerifyingEmail}
                />
              )}

              {currentStep === 3 && (
                <StepThree
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 lg:mt-12 pt-8 border-t-2 border-amber-200">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    type="button"
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    ← Previous Chapter
                  </Button>
                )}

                <div className={`w-full sm:w-auto order-1 sm:order-2 ${currentStep > 1 ? 'sm:ml-auto' : ''}`}>
                  {currentStep < 3 ? (
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      type="button"
                      className="w-full sm:w-auto bg-amber-800 hover:bg-amber-900 text-white font-serif font-bold py-3 px-8 transition-colors"
                    >
                      Continue Reading →
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-amber-800 hover:bg-amber-900 text-white font-serif font-bold py-3 px-8 transition-colors"
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish Your Story'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-amber-800 font-serif">
          <div className="border-t border-amber-300 pt-4">
            <p className="text-sm">© 2025 The Knowaria - All Rights Reserved</p>
            <p className="text-xs mt-1">Your trusted source for quality content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;