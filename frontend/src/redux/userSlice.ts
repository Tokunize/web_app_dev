// userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definir la estructura del estado del usuario
interface UserState {
  role: string | null;
}

const initialState: UserState = {
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<{
        role: string;
      }>
    ) => {
      state.role = action.payload.role;  // Asegúrate de que 'role' se actualice correctamente
    },
   
    clearUserData: (state) => {
      state.role = null;  // Limpiar role al hacer logout
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
