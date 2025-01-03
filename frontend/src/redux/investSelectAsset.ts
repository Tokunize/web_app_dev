import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AssetState {
  investMethodTitle: string;
  assetPoolAddress: string;
}

const initialState: AssetState = {
  investMethodTitle: "",  // Cambié de " " a "" para evitar posibles problemas con espacios en blanco
  assetPoolAddress: "",
};

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setInvestMethodTitle: (state, action: PayloadAction<string>) => {
      state.investMethodTitle = action.payload;
    },
    setAssetPoolAddress: (state, action: PayloadAction<string>) => {
      state.assetPoolAddress = action.payload;
    },
    resetAsset: (state) => {
      state.investMethodTitle = "";
      state.assetPoolAddress = "";
    },
  },
});

export const { setInvestMethodTitle, setAssetPoolAddress, resetAsset } = assetSlice.actions;

export default assetSlice.reducer;
