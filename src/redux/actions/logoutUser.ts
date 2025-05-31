import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CustomResponse } from "../../components/utilities/AxiosInstance";
import axiosInstance from "../../components/utilities/AxiosInstance";
import type { AxiosError } from "axios";

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: { message: string } }
>('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.delete<CustomResponse>("/logout");
  } catch (error) {
    const err = error as AxiosError<CustomResponse>;
    return rejectWithValue({
      message: err.response?.data?.message || err.message || "Unknown server error, please try again later.",
    });
  }
});
