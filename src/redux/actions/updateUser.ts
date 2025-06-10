import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import type { User } from "../../types/loginEntity"; // Adjust path to your User type
import axiosInstance from "../../components/utilities/AxiosInstance";

export interface UpdateUserResponse {
  user: User;
  message: string;
  success: boolean;
}

export interface UpdateUserError {
  message: string;
}

export const updateUser = createAsyncThunk<
  UpdateUserResponse,        
  User,                 
  { rejectValue: UpdateUserError } 
>(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<UpdateUserResponse>(
        `/`,
        userData
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<UpdateUserError>;
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);