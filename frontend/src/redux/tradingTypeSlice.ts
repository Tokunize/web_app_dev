// redux/slices/tradingTypeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definir el estado inicial
interface TradingTypeState {
  offerType: 'maded' | 'received' | null; // Solo puede ser 'made', 'received' o null
  tradingType: 'buy' | 'sell' | null;   // Solo puede ser 'buy', 'sell' o null
}

const initialState: TradingTypeState = {
  tradingType: null, // Estado inicial puede ser null
  offerType: null,   // Estado inicial puede ser null
};

const tradingTypeSlice = createSlice({
  name: 'tradingType',
  initialState,
  reducers: {
    // Acción para actualizar el tradingType
    setTradingType: (state, action: PayloadAction<'buy' | 'sell' | null>) => {
      state.tradingType = action.payload;
    },
    // Acción para actualizar el offerType
    setOfferType: (state, action: PayloadAction<'maded' | 'received' | null>) => {
      state.offerType = action.payload;
    },
  },
});

// Exportar las acciones y el reducer
export const { setTradingType, setOfferType } = tradingTypeSlice.actions;
export default tradingTypeSlice.reducer;
