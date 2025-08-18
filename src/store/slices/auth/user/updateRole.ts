import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  iUpdatedUserRolePayload,
  iUpdatedUserRoleResponse,
} from "../../../../types/user";
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "../../../../constants/base_url";
import { Default_Error_Message } from "../../../../constants/default_error";
import type { RootState } from "../../../store";

const initialState = {
  data: {} as iUpdatedUserRoleResponse,
  loading: false,
  error: "",
};

export const updateRoleFn = createAsyncThunk(
  "/users/role/update",
  async (data: iUpdatedUserRolePayload, { rejectWithValue, getState }) => {
    try {
      const appState = getState() as RootState;
      const token = appState.loginSlice.data?.token;
      const res = await axios.put(`${BASE_API_URL}/users/role/update`, data, {
        headers: {
          Authorization: `BEARER ${token}`,
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

export const updateRoleSlice = createSlice({
  name: "Update Role Slice",
  reducers: {
    resetUpdatedRoleState: (state) => {
      state.data = {} as iUpdatedUserRoleResponse;
      state.loading = false;
      state.error = "";
    },
  },
  initialState,
  extraReducers: (builder) => {
    builder.addCase(updateRoleFn.pending, (state) => {
      state.loading = true;
      state.data = {} as iUpdatedUserRoleResponse;
      state.error = "";
    });
    builder.addCase(updateRoleFn.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateRoleFn.rejected, (state, action) => {
      state.loading = false;
      state.data = {} as iUpdatedUserRoleResponse;
      state.error = action.payload as string;
    });
  },
});

export const { resetUpdatedRoleState } = updateRoleSlice.actions;
