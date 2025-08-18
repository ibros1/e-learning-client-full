import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { iDeletedUserResponse } from "../../../../types/user";
import { BASE_API_URL } from "../../../../constants/base_url";
import { Default_Error_Message } from "../../../../constants/default_error";

const initialState = {
  data: {} as iDeletedUserResponse,
  loading: false,
  error: "",
};

export const deleteUserFn = createAsyncThunk(
  "/users/delete/:userId",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/users/delete/${userId}`
      );

      return response.data;
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

export const deleteUserSlice = createSlice({
  name: "delete user Slice",
  initialState,
  reducers: {
    resetDeleteUserState: (state) => {
      state.data = {} as iDeletedUserResponse;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteUserFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iDeletedUserResponse;
      state.error = "";
    });
    builder.addCase(deleteUserFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(deleteUserFn.rejected, (state, action) => {
      state.data = {} as iDeletedUserResponse;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetDeleteUserState } = deleteUserSlice.actions;
