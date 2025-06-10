export interface UserEntity {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  password: string;
  confirmPassword: string;
  articlePreferences: string[];
  isEmailVerified: boolean;
  otp: string[];
}


export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  dob?: string;
  password?: string;
  confirmPassword?: string;
  articlePreferences?: string;
  otp?: string;
}
export interface editUserEntity{
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  dob?: string;
  newPassword?: string;
  confirmPassword?: string;
  currentPassword?:string
  articlePreferences?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}