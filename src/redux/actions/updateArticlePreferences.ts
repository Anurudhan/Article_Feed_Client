import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../components/utilities/AxiosInstance";
import type { User } from "../../types/loginEntity"; // Adjust path to your User type

// Define the shape of your Redux state
interface RootState {
  auth: {
    user: User | null;
  };
}

// Types for updateArticlePreferences
export interface UpdatePreferencesResponse {
  message: string;
  success: boolean;
}

export interface UpdatePreferencesError {
  message: string;
}

export const updateArticlePreferences = createAsyncThunk<
  UpdatePreferencesResponse,
  string[], // Array of preference IDs
  { rejectValue: UpdatePreferencesError; state: RootState }
>(
  'user/updateArticlePreferences',
  async (preferences, { rejectWithValue, getState }) => {
    try {
      // Get the user ID from the Redux state with proper typing
      const state = getState();
      const userId = state.auth.user?._id;

      if (!userId) {
        return rejectWithValue({ message: 'User not authenticated' });
      }

      const response = await axiosInstance.put<UpdatePreferencesResponse>(
        `/users/${userId}/preferences`,
        {
          articlePreferences: preferences,
        }
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<UpdatePreferencesError>;
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: 'An error occurred while updating preferences' });
    }
  }
);
