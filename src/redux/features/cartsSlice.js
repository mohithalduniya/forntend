import { createSlice } from "@reduxjs/toolkit";

const initialState = { item: [], price: 0, salePrice: 0 };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addTocart: (state, { payload }) => {
      const product = state.item.find((item) => item.id == payload.id);
      if (product) {
        product.qty++;
      } else {
        state.item.push(payload);
      }
      state.price += Number(payload.price);
      state.salePrice += Number(payload.salePrice);
      localStorage.setItem("cart", JSON.stringify(state));

      // state.value += 1
    },
    lstocart: (state, { payload }) => {
      const lscart = JSON.parse(localStorage.getItem("cart"));
      if (lscart) {
        state.item = lscart.item;
        state.price = Number(lscart.price);
        state.salePrice = Number(lscart.salePrice);
      }
    },

    increment: (state, { payload }) => {
      // state.value += 1
      const { id } = payload;
      const products = state.item.find((item) => item.id === id);
      if (!products) return;
      products.qty++;
      state.price += Number(products.price);
      state.salePrice += Number(products.salePrice);

      localStorage.setItem("cart", JSON.stringify(state));
    },

    decrement: (state, { payload }) => {
      const { id } = payload;
      const products = state.item.find((item) => item.id === id);
      if (!products) return;
      if (products.qty > 1) {
        products.qty--;
      } else {
        state.item = state.item.filter((item) => item.id != id);
      }
      state.price -= Number(products.price);
      state.salePrice -= Number(products.salePrice);

      localStorage.setItem("cart", JSON.stringify(state));
    },

    remove_cart_item: (state, { payload }) => {
      const { id } = payload;

      const products = state.item.find((item) => item.id === id);

      if (!products) return;

      // Cart se product remove
      state.item = state.item.filter((item) => item.id !== id);

      // Total price update
      state.price -= Number(products.price) * Number(products.qty);

      // Total sale price update
      state.salePrice -= Number(products.salePrice) * Number(products.qty);

      localStorage.setItem("cart", JSON.stringify(state));
    },
    emtycart: (state) => {
      state.item = [];
      state.price = 0;
      state.salePrice = 0;
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addTocart, lstocart, increment, decrement, remove_cart_item, emtycart } =
  cartSlice.actions;

export default cartSlice.reducer;
