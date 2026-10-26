import { createSlice } from "@reduxjs/toolkit";

const initialState = { item: [], price: 0, salePrice: 0 };

const calculateTotals = (items = []) => {
  return items.reduce(
    (acc, it) => {
      const qty = Number(it.qty) || 1;
      const reg = Number(it.price) || 0;
      const sale = Number(it.salePrice ?? it.saleprice ?? it.price) || reg;
      acc.price += reg * qty;
      acc.salePrice += sale * qty;
      return acc;
    },
    { price: 0, salePrice: 0 }
  );
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addTocart: (state, { payload }) => {
      if (!payload) return;
      const prodId = String(payload.id || payload._id || "");
      const product = state.item.find(
        (item) => String(item.id || item._id) === prodId
      );

      if (product) {
        product.qty = (Number(product.qty) || 1) + (Number(payload.qty) || 1);
        if (!product.thumbnail && payload.thumbnail) {
          product.thumbnail = payload.thumbnail;
        }
      } else {
        state.item.push({
          ...payload,
          id: prodId,
          _id: prodId,
          qty: Number(payload.qty) || 1,
        });
      }

      const totals = calculateTotals(state.item);
      state.price = totals.price;
      state.salePrice = totals.salePrice;

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    lstocart: (state) => {
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem("cart");
        if (!raw) return;
        const lscart = JSON.parse(raw);
        if (lscart && Array.isArray(lscart.item)) {
          // Drop corrupted items from previous buggy dispatches
          state.item = lscart.item.filter(
            (it) => it && (it.id || it._id) && it.name && it.name !== "undefined"
          );
          const totals = calculateTotals(state.item);
          state.price = totals.price;
          state.salePrice = totals.salePrice;
          localStorage.setItem("cart", JSON.stringify(state));
        }
      } catch (err) {
        // ignore parse error
      }
    },

    increment: (state, { payload }) => {
      const targetId = String(payload?.id || payload?._id || "");
      const product = state.item.find(
        (item) => String(item.id || item._id) === targetId
      );
      if (!product) return;
      product.qty = (Number(product.qty) || 1) + 1;

      const totals = calculateTotals(state.item);
      state.price = totals.price;
      state.salePrice = totals.salePrice;

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    decrement: (state, { payload }) => {
      const targetId = String(payload?.id || payload?._id || "");
      const product = state.item.find(
        (item) => String(item.id || item._id) === targetId
      );
      if (!product) return;

      if ((Number(product.qty) || 1) > 1) {
        product.qty = (Number(product.qty) || 1) - 1;
      } else {
        state.item = state.item.filter(
          (item) => String(item.id || item._id) !== targetId
        );
      }

      const totals = calculateTotals(state.item);
      state.price = totals.price;
      state.salePrice = totals.salePrice;

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    remove_cart_item: (state, { payload }) => {
      const targetId = String(payload?.id || payload?._id || "");
      state.item = state.item.filter(
        (item) => String(item.id || item._id) !== targetId
      );

      const totals = calculateTotals(state.item);
      state.price = totals.price;
      state.salePrice = totals.salePrice;

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
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

export const {
  addTocart,
  lstocart,
  increment,
  decrement,
  remove_cart_item,
  emtycart,
} = cartSlice.actions;

export default cartSlice.reducer;
