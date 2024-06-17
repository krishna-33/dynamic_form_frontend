import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from './apiSlice';
import authReducer from '../redux/authSlice';
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  
  [api.reducerPath]: api.reducer,
  [authReducer.name]: authReducer.reducer,
  })

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(api.middleware), // Add middleware for API requests

});

// Setup listeners for Redux Query
setupListeners(store.dispatch);

// Create persistor
export const persistor = persistStore(store);

