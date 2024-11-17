import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import localforage from "localforage";
// Define a type for the slice state
interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};
//TODO: Refreshing clears state. Need to make a token login to refresh it.

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      let host = import.meta.env.VITE_API_HOST ?? 'http://localhost:3000';
      const link: string = host + '/auth/login';
      let data = credentials;

      const response =  await axios.post(link, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);
export const getUserName = createAsyncThunk(
  'user/getUserName',
  async (_, { rejectWithValue }) => {
    console.log("getusername dispatch")
    try {
      const name = await localforage.getItem('name');
      return name;
    } catch (error: any) {
      return rejectWithValue( '');
    }
  }
);


// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  'user/logout', async (_, { rejectWithValue }) => {
    localforage.removeItem("token");
    localforage.removeItem("name");

  });

// Create user slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState['user']>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserState['user']>) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserName.fulfilled, (state, action: PayloadAction<any>) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserName.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectError = (state: RootState) => state.user.error;

export default userSlice.reducer;
