import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { iUpdatedUserResponse } from "../../../../types/user";
import type { RootState } from "../../../store";
import axios, { AxiosError } from "axios";
import { Default_Error_Message } from "../../../../constants/default_error";
import { BASE_API_URL } from "../../../../constants/base_url";

const initialState = {
  data: {} as iUpdatedUserResponse,
  loading: false,
  error: "",
};

export const updateUserFn = createAsyncThunk(
  "/users/update",
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;

      const res = await axios.put(`${BASE_API_URL}/users/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data.message || Default_Error_Message
        );
      }
      return rejectWithValue(Default_Error_Message);
    }
  }
);

export const updateUserSlice = createSlice({
  name: "Update User Slice",
  initialState,
  reducers: {
    resetUpdateUserFn: (state) => {
      state.data = {} as iUpdatedUserResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedUserResponse;
      state.error = "";
    });
    builder.addCase(updateUserFn.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    });
    builder.addCase(updateUserFn.rejected, (state, action) => {
      state.data = {} as iUpdatedUserResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetUpdateUserFn } = updateUserSlice.actions;
