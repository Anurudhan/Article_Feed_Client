import { createAsyncThunk } from "@reduxjs/toolkit";

import { AxiosError } from "axios";
import type { LoginCredentials, LoginError, User } from "../../types/loginEntity";
import axiosInstance from "../../components/utilities/AxiosInstance";
export interface LoginResponse {
  user: User;
  message: string;
  success:boolean;
}

export const loginUser = createAsyncThunk<
  LoginResponse,             
  LoginCredentials,           
  { rejectValue: LoginError } 
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/login', credentials);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<LoginError>;
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);
