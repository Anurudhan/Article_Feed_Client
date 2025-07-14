import type { AxiosError } from "axios";
import axiosInstance from "../../components/utilities/AxiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface ChangePasswordPayload {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

export interface ChangePasswordError {
  message: string;
}

export const changePassword = createAsyncThunk<
  ChangePasswordResponse,
  ChangePasswordPayload,
  { rejectValue: ChangePasswordError }
>(
  'user/changePassword',
  async ({ userId, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ChangePasswordResponse>(
        `/users/${userId}/change-password`,
        {
          currentPassword,
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ChangePasswordError>;
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: 'An error occurred while changing the password' });
    }
  }
);