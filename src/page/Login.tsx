import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Mail, Phone, Lock, Newspaper, BookOpen, PenTool, FileText, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useToast } from '../contexts/ToastContext';
import InputField from '../components/utilities/InputField';
import logo from '../assets/knowaria_logo.png';
import { useAppDispatch } from '../redux/hooks/hooks';
import { loginUser } from '../redux/actions/loginUser';

const phoneRegex = /^\+?[1-9]\d{9}$/;
const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, { message: 'Email or phone number is required' })
    .refine(
      (val) => {
        const normalized = val.replace(/[\s\-()]/g, '');
        return z.string().email().safeParse(val).success || phoneRegex.test(normalized);
      },
      { message: 'Enter a valid email or 10-digit phone number' }
    ),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one symbol' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrPhone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const isFormValid = useCallback(() => {
    const result = loginSchema.safeParse(formData);
    return result.success;
  }, [formData]);

  const isEmail = useCallback((value: string): boolean => {
    return z.string().email().safeParse(value).success;
  }, []);

  const validateField = useCallback((name: keyof LoginFormData, value: string): string | undefined => {
    try {
      const pickObject: Partial<Record<keyof LoginFormData, true>> = { [name]: true };
      const partialSchema = loginSchema.pick(pickObject);
      partialSchema.parse({ [name]: value });
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message;
      }
      return 'Invalid input';
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const normalizedValue = name === 'emailOrPhone' ? value.replace(/[\s\-()]/g, '') : value;
      setFormData((prev) => ({ ...prev, [name as keyof LoginFormData]: normalizedValue }));
      const error = validateField(name as keyof LoginFormData, normalizedValue);
      setErrors((prev) => ({
        ...prev,
        [name as keyof LoginFormData]: error,
      }));
    },
    [validateField]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      console.log(result,"This is my result from the back end ==============>")
      if (!result.success) {
        showToast(result.message, 'error');
        return;
      }
      showToast('Login successful! Welcome back.', 'success');
      navigate("/dashboard")
    } catch (error) {
      console.error('Unexpected error:', error);
      showToast('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at top left, rgba(245, 208, 144, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at top right, rgba(218, 165, 32, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(160, 82, 45, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #faf9f7 0%, #f5f2e8 100%)
        `,
      }}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 opacity-10 animate-pulse">
          <Newspaper className="w-16 h-16 text-amber-800 transform rotate-12" />
        </div>
        <div className="absolute top-32 right-16 opacity-8 animate-bounce" style={{ animationDuration: '3s' }}>
          <Newspaper className="w-12 h-12 text-amber-700 transform -rotate-45" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-12 transform rotate-45 animate-pulse" style={{ animationDelay: '1s' }}>
          <BookOpen className="w-14 h-14 text-amber-600" />
        </div>
        <div className="absolute top-1/3 right-8 opacity-8 transform -rotate-12">
          <BookOpen className="w-10 h-10 text-amber-700" />
        </div>
        <div className="absolute bottom-40 right-40 opacity-10 transform rotate-25 animate-pulse" style={{ animationDelay: '2s' }}>
          <PenTool className="w-12 h-12 text-amber-800" />
        </div>
        <div className="absolute top-20 left-1/3 opacity-8 transform -rotate-30">
          <FileText className="w-8 h-8 text-amber-600" />
        </div>
        <div className="absolute top-1/2 left-8 opacity-6 transform rotate-60">
          <Newspaper className="w-8 h-8 text-amber-700" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-8 transform -rotate-15 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <BookOpen className="w-6 h-6 text-amber-600" />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Header Section */}
        <div className="text-center mb-6">
          <Link to="/dashboard" className="inline-block">
            <img src={logo} alt="Knowaria Logo" className="w-120 h-36 ms-2 -mt-8 object-contain" />
          </Link>
          <h1 className="text-2xl font-bold mb-2 text-amber-900 -mt-8" style={{ fontFamily: '"Times New Roman", serif' }}>
            Welcome Back
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent flex-1 max-w-12"></div>
            <div className="flex space-x-1">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <PenTool className="w-4 h-4 text-amber-700" />
              <Newspaper className="w-4 h-4 text-amber-600" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent flex-1 max-w-12"></div>
          </div>
          <p className="text-sm text-amber-800" style={{ fontFamily: '"Times New Roman", serif' }}>
            Continue Your Reading Journey
          </p>
        </div>

        {/* Login Form */}
        <div
          className="backdrop-blur-sm p-6 rounded-2xl transition-all duration-300 hover:shadow-xl"
          style={{
            background: 'linear-gradient(145deg, rgba(248, 246, 240, 0.95) 0%, rgba(245, 242, 232, 0.98) 100%)',
            boxShadow: `
              0 15px 35px rgba(139, 69, 19, 0.12),
              0 5px 15px rgba(160, 82, 45, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.9),
              inset 0 -1px 0 rgba(139, 69, 19, 0.05)
            `,
            border: '1px solid rgba(139, 69, 19, 0.08)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              name="emailOrPhone"
              placeholder="Email or phone number"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              error={errors.emailOrPhone}
              label="Email or Phone"
              leftIcon={isEmail(formData.emailOrPhone) ? (
                <Mail className="h-5 w-5 text-gray-400" />
              ) : (
                <Phone className="h-5 w-5 text-gray-400" />
              )}
            />
            <InputField
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              label="Password"
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              rightIcon={showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
              onRightIconClick={togglePasswordVisibility}
            />
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors relative group"
                style={{ fontFamily: '"Times New Roman", serif' }}
              >
                Forgot password?
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-700 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-[1.02] ${
                isLoading || !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg active:scale-[0.98]'
              }`}
              style={{
                background: isLoading || !isFormValid()
                  ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)'
                  : 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
                color: 'white',
                fontFamily: '"Times New Roman", serif',
                boxShadow: isLoading || !isFormValid()
                  ? 'none'
                  : `
                    0 8px 20px rgba(139, 69, 19, 0.3),
                    0 3px 10px rgba(160, 82, 45, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-3">
              <Loader className="h-8 w-8 text-amber-600 animate-spin" />
              <p
                className="text-amber-800 font-medium"
                style={{ fontFamily: '"Times New Roman", serif' }}
              >
                Sign In ...
              </p>
            </div>
          </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-amber-800" style={{ fontFamily: '"Times New Roman", serif' }}>
              No account?{' '}
              <Link
                to="/register"
                className="font-bold text-amber-700 hover:text-amber-900 transition-colors relative group"
              >
                Sign up
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-700 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </p>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-amber-700 leading-relaxed" style={{ fontFamily: '"Times New Roman", serif' }}>
            By signing in, you agree to our{' '}
            <Link to="/terms" className="font-medium hover:text-amber-900 transition-colors underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium hover:text-amber-900 transition-colors underline">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;