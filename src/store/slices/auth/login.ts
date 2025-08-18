import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { iLoginPayload, iLoginResponse } from "../../../types/user";
import axios, { AxiosError } from "axios";
import { Default_Error_Message } from "../../../constants/default_error";
import { BASE_API_URL } from "../../../constants/base_url";

const persistedData = localStorage.getItem("user_data");
export const userData = persistedData ? JSON.parse(persistedData) : null;

// Initial state
const initialState = {
  data: (userData as iLoginResponse) || ({} as iLoginResponse),
  loading: false,
  error: "",
};

// Async thunk
export const loginUserFn = createAsyncThunk(
  "/auth/login",
  async (data: iLoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/users/login`, data);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || Default_Error_Message
        );
      }
      return rejectWithValue(Default_Error_Message);
    }
  }
);

// Slice
export const loginSlice = createSlice({
  name: "login slice",
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.data = {} as iLoginResponse;
      state.loading = false;
      state.error = "";
      localStorage.removeItem("user_data");
    },
    updateUserInLogin: (state, action) => {
      if (state.data?.user) {
        state.data.user = { ...state.data.user, ...action.payload };
      }
      localStorage.setItem("user_data", JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserFn.pending, (state) => {
      state.data = {} as iLoginResponse;
      state.loading = true;
      state.error = "";
    });
    builder.addCase(loginUserFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
      localStorage.setItem("user_data", JSON.stringify(state.data));
    });
    builder.addCase(loginUserFn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.data = {} as iLoginResponse;
    });
  },
});

export const { resetLoginState, updateUserInLogin } = loginSlice.actions;
