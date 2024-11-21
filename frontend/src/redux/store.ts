import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice";
import userReducer from "./userSlice";
import storage from 'redux-persist/lib/storage'; // Usamos el localStorage por defecto
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';

// Configuración de redux-persist
const persistConfig = {
  key: 'root', // Nombre del almacenamiento persistido
  storage, // Usamos el almacenamiento local (localStorage)
  whitelist: ['user'], // Persistimos solo el slice de 'user'
};

// Combina los reducers
const rootReducer = combineReducers({
  wallet: walletReducer,
  user: userReducer,
});

// Aplica persistReducer sobre el rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // El store usará el rootReducer persistido
});

export const persistor = persistStore(store); // Crea el persistor

// Tipos para el estado y el dispatch de Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
