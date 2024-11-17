import { configureStore } from '@reduxjs/toolkit'
import invoiceReducer from './invoiceSlice.ts';
import userReducer from './userSlice.ts';

// ...

export const store = configureStore({
  reducer: {
    users: userReducer,
    invoices: invoiceReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch