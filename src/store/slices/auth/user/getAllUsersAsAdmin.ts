import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";

import { BASE_API_URL } from "../../../../constants/base_url";
import { Default_Error_Message } from "../../../../constants/default_error";
import type { iListedMembersResponseAsAdmin } from "../../../../types/adminUsers";

const initialState = {
  data: {} as iListedMembersResponseAsAdmin,
  loading: false,
  error: "",
};

export const listUsersFn_admins = createAsyncThunk(
  "/users/list",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/users/list/`);

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

export const listUsers_Admins_Slice = createSlice({
  name: "List users_admin Slice",
  initialState,
  reducers: {
    createUser_Admins_Redu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    updateUser_Admins_Redu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
    deleteUser_Admins_Redu: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listUsersFn_admins.pending, (state) => {
      state.loading = true;
      state.data = {} as iListedMembersResponseAsAdmin;
      state.error = "";
    });
    builder.addCase(listUsersFn_admins.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(listUsersFn_admins.rejected, (state, action) => {
      state.data = {} as iListedMembersResponseAsAdmin;
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  createUser_Admins_Redu,
  updateUser_Admins_Redu,
  deleteUser_Admins_Redu,
} = listUsers_Admins_Slice.actions;
