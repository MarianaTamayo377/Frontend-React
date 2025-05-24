import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import React from 'react';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
