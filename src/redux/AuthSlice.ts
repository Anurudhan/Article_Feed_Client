import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/loginEntity";
import { loginUser, type LoginResponse } from "./actions/loginUser";
import { getUser } from "./actions/getUser";
import { logoutUser } from "./actions/logoutUser";
import { updateUser } from "./actions/updateUser";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading:false,
    error:null
};

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(loginUser.fulfilled,(state,action:PayloadAction<LoginResponse>)=>{
          console.log(action.payload.user,"this is user data from the backend")
            state.user=action.payload.user;
            state.loading=false;
            state.error=null;
        })
         .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Login failed';
      })
      .addCase(getUser.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(getUser.fulfilled,(state,action:PayloadAction<User>)=>{
          console.log(action.payload,"this is user data from the backend")
            state.user=action.payload;
            state.loading=false;
            state.error=null;
        })
         .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Login failed';
      })
      .addCase(updateUser.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(updateUser.fulfilled,(state,action:PayloadAction<LoginResponse>)=>{
          console.log(action.payload.user,"this is user data from the backend")
            state.user=action.payload.user;
            state.loading=false;
            state.error=null;
        })
         .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Login failed';
      })
       .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Logout failed';
      });
      
    }
});
export default AuthSlice.reducer;