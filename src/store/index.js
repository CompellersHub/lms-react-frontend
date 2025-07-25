// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import educationalDataAnalysisReducer from "./slices/educationalDataAnalysisSlice"; // NEW Educational Slice
import { api } from "../services/api";
import { coursesApi } from "../services/coursesApi";
import { liveClassesApi } from "@/services/live-classes-api";
import { blogsApi } from "@/services/blogsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    educationalDataAnalysis: educationalDataAnalysisReducer, // NEW - Educational data analysis
    [api.reducerPath]: api.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [liveClassesApi.reducerPath]: liveClassesApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(coursesApi.middleware)
      .concat(liveClassesApi.middleware)
      .concat(blogsApi.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

export default store;
