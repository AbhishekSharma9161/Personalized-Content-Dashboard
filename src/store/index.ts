import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { contentApi } from "./api/contentApi";
import userPreferencesSlice from "./slices/userPreferencesSlice";
import contentSlice from "./slices/contentSlice";
import uiSlice from "./slices/uiSlice";
import authSlice from "./slices/authSlice";
import {
  persistenceMiddleware,
  loadPersistedState,
} from "./middleware/persistenceMiddleware";

// Load persisted state
const persistedState = loadPersistedState();

export const store = configureStore({
  reducer: {
    userPreferences: userPreferencesSlice,
    content: contentSlice,
    ui: uiSlice,
    auth: authSlice,
    [contentApi.reducerPath]: contentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(contentApi.middleware)
      .concat(persistenceMiddleware),
  preloadedState: persistedState as any,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
