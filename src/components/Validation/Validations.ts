export const validateName = (name: string): string | undefined => {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Name contains invalid characters";
  return undefined;
};

export const validatePhone = (phone: string): string | undefined => {
  if (!phone.trim()) return "Phone number is required";
  if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/[\s()-]/g, ''))) 
    return "Please enter a valid phone number";
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
    return "Please enter a valid email address";
  return undefined;
};

export const validateDOB = (dob: string): string | undefined => {
  if (!dob) return "Date of birth is required";
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  if (isNaN(birthDate.getTime())) return "Please enter a valid date";
  
  // Check if date is in the future
  if (birthDate > today) return "Date of birth cannot be in the future";
  
  // Check if person is at least 13 years old
  const thirteenYearsAgo = new Date();
  thirteenYearsAgo.setFullYear(today.getFullYear() - 13);
  
  if (birthDate > thirteenYearsAgo) 
    return "You must be at least 13 years old to register";
    
  // Check if person is not too old (e.g., 120 years)
  const maxAge = new Date();
  maxAge.setFullYear(today.getFullYear() - 120);
  
  if (birthDate < maxAge) 
    return "Please enter a valid date of birth";
    
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character";
  return undefined;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return undefined;
};

export const validateArticlePreferences = (preferences: string[]): string | undefined => {
  if (!preferences.length) return "Please select at least one preference";
  if (preferences.length > 3) return "Please select no more than 3 preferences";
  return undefined;
};

export const validateOTP = (otp: string[]): string | undefined => {
  if (otp.some(digit => !digit)) return "Please enter the complete verification code";
  if (otp.some(digit => !/^\d$/.test(digit))) return "OTP must contain only digits";
  return undefined;
};