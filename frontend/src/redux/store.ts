import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "./userSlice";
import { persistedWalletReducer } from "./walletSlice"; // Wallet reducer con persistencia
import storage from 'redux-persist/lib/storage'; // Usamos localStorage para persistencia
import { persistStore, persistReducer } from 'redux-persist'; 
import tableActionItemReducer from './tableActionItemSlice'; // Reducer de acción de tabla
import tradingTypeReducer from "./tradingTypeSlice"

// Configuración de redux-persist
const persistConfig = {
  key: 'root', // Nombre de la clave en el almacenamiento persistido
  storage, // Usamos localStorage
  whitelist: ['user', 'wallet'], // Solo persistimos 'user' y 'wallet'
};

const rootReducer = combineReducers({
  wallet: persistedWalletReducer, // Reducer persistido de la wallet
  user: userReducer, // Reducer del usuario
  tableActionItem: tableActionItemReducer,
  tadringType: tradingTypeReducer
});

// Aplicamos persistReducer sobre el rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuración del store de Redux
export const store = configureStore({
  reducer: persistedReducer, // Reducer con persistencia
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PURGE'], // Ignorar acción de purga que no es serializable
      },
    }),
});

// Crear el persistor
export const persistor = persistStore(store);

// Tipos para el estado y dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
