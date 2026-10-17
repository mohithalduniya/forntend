import { configureStore } from "@reduxjs/toolkit";
import cartsSlice from "./features/cartsSlice.js";

export const store = configureStore({
  reducer: {
    cart: cartsSlice,
  },
});