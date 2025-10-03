import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import eventsSlice from './slices/eventsSlice';
import bookingSlice from './slices/bookingSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    events: eventsSlice,
    booking: bookingSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;