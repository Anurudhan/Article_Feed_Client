import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginError, User } from "../../types/loginEntity";
import type { AxiosError } from "axios";
import axiosInstance from "../../components/utilities/AxiosInstance";


export const getUser = createAsyncThunk<
  User,
  void,
  { rejectValue: LoginError }
>(
  "auth/getuser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user"); // ✅ No need for full URL
      return response.data.data as User; // ✅ because your interceptor wraps the response
    } catch (error) {
      const err = error as AxiosError<LoginError>;
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: "Unknown error occurred" });
    }
  }
);
