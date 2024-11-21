// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definir la estructura del estado de usuario
interface UserState {
  role: string | null;
  name: string | null;
  userImage: string | null;
  userEmail: string | null;
  loading: boolean;
}

const initialState: UserState = {
  role: null,
  name: null,
  userImage: null,
  userEmail: null,
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<{
        role: string;
        name: string;
        userImage: string;
        userEmail: string;
      }>
    ) => {
      state.role = action.payload.role;
      state.name = action.payload.name;
      state.userImage = action.payload.userImage;
      state.userEmail = action.payload.userEmail;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearUserData: (state) => {
      state.role = null;
      state.name = null;
      state.userImage = null;
      state.userEmail = null;
      state.loading = true;
    },
  },
});

export const { setUserData, setLoading, clearUserData } = userSlice.actions;

export default userSlice.reducer;
