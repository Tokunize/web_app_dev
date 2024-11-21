
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
    address: string | null;
}

const initialState: WalletState = {
    address: localStorage.getItem("connectedAddress") || null
}

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers:{
        setWalletAddress: (state, action: PayloadAction<string | null>) => {
            state.address = action.payload;
            if(action.payload){
                localStorage.setItem('connectedAddress', action.payload); // Guarda en localStorage
            }else{
                localStorage.removeItem('connectedAddress'); // Elimina de localStorage si se desconecta  
            }
        },
    },
});

export const { setWalletAddress} = walletSlice.actions;
export default walletSlice.reducer;