import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"
import playersReducer from "../slices/playersSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    players: playersReducer,
  },
});

// For typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
