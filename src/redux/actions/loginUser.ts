import { createAsyncThunk } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import type { LoginCredentials, LoginError, User } from "../../types/loginEntity";
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
      const response = await axios.post<LoginResponse>(`${import.meta.env.VITE_BASE_URL}/login`, credentials);
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
