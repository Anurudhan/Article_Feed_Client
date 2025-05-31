

export interface LoginCredentials {
  emailOrPhone: string; 
  password: string;
}

export interface LoginError {
  message: string;
}
export interface User{
    _id:string;
firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  articlePreferences: string[];
  isEmailVerified: boolean;
}

