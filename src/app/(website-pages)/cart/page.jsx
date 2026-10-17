"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, remove_cart_item } from "@/redux/features/cartsSlice";

export default function CartPage() {
  const cart = useSelector((store) => store.cart);

  const cartItems = cart?.item || [];

  // Total products in cart
  const cartCount = cartItems.length;

  const subtotal = cartItems.reduce((total, product) => {
    const price = Number(product.price) || 0;
    const qty = Number(product.qty) || 1;

    return total + price * qty;
  }, 0);

  const total = cartItems.reduce((total, product) => {
    const price = Number(product.saleprice ?? product.price) || Number(product.price) || 0;
    const qty = Number(product.qty) || 1;
    return total + price * qty;
  }, 0);
  const discount = subtotal - total;

  const dispatch=useDispatch()
  return (
    <main className="min-h-screen bg-[#faf8f6] px-4 py-8 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a604d]">
            Your Shopping Bag
          </p>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold text-[#3f2419] sm:text-4xl">
                Shopping Cart
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Review your selected products before checkout.
              </p>
            </div>

            <Link
              href="/store"
              className="text-sm font-semibold text-[#6b3f2d] underline underline-offset-4 hover:text-[#3f2419]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart Products */}
          <section className="rounded-2xl border border-[#eadfd8] bg-white p-4 shadow-sm sm:p-6">
            {/* Table Header */}
            <div className="mb-5 hidden border-b border-[#eee5df] pb-4 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:grid sm:grid-cols-[1fr_120px_120px] sm:gap-5">
              <span>Product</span>
              <span>Quantity</span>
              <span className="text-right">Price</span>
            </div>

            {/* Dynamic Products */}
            {cartItems.length > 0 ? (
              cartItems.map((product, index) => {
                const price = Number(product.price) || 0;

                const salePrice =
                  Number(product.saleprice ?? product.price) || price;

                const qty = Number(product.qty) || 1;

                return (
                  <div
                    key={product._id || product.id || index}
                    className="border border-[#eee5df] py-5 first:pt-0"
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_120px_120px] sm:items-center sm:gap-5">
                      {/* Product */}
                      <div className="flex gap-4">
                        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#f4efeb]">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.name || "Product"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-2xl">
                              🛋️
                            </div>
                          )}
                        </div>

                        <div className="flex min-w-0 flex-col justify-center">
                          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#9a705c]">
                            Product
                          </p>

                          <h2 className="line-clamp-2 text-base font-semibold text-[#3f2419]">
                            {product.name}
                          </h2>

                          {product.shortDescription && (
                            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                              {product.shortDescription}
                            </p>
                          )}

                          <button
                          onClick={()=>{
                            dispatch (remove_cart_item({id:product.id}))
                            
                          }}
                            type="button"
                            className="mt-3 w-fit text-xs font-medium text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-between sm:justify-center">
                        <span className="text-xs font-medium text-gray-400 sm:hidden">
                          Quantity
                        </span>

                        <div className="flex h-10 items-center overflow-hidden rounded-lg border border-[#ded3cc]">
                          <button
                          onClick={()=>{
                            dispatch(decrement({id:product.id}))
                          }}
                            type="button"
                            className="flex h-full w-9 items-center justify-center text-gray-500 hover:bg-[#f8f3f0]"
                          >
                            −
                          </button>

                          <span className="flex h-full w-10 items-center justify-center border-x border-[#ded3cc] text-sm font-semibold text-[#3f2419]">
                            {qty}
                          </span>

                          <button
                          onClick={()=>{
                            dispatch(increment({id:product.id}))
                          }}
                            type="button"
                            className="flex h-full w-9 items-center justify-center text-gray-500 hover:bg-[#f8f3f0]"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between sm:block sm:text-right">
                        <span className="text-xs font-medium text-gray-400 sm:hidden">
                          Price
                        </span>

                        <div>
                          <p className="text-base font-bold text-[#3f2419]">
                            ₹{salePrice}
                          </p>

                          {salePrice < price && (
                            <p className="mt-1 text-xs text-gray-400 line-through">
                              ₹{price}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">Your cart is empty.</p>

                <Link
                  href="/store"
                  className="mt-4 inline-block rounded-lg bg-[#5e3122] px-5 py-3 text-sm font-semibold text-white"
                >
                  Continue Shopping
                </Link>
              </div>
            )}

            {/* Cart Bottom */}
            <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-[#3f2419]">
                  {cartCount} items
                </span>{" "}
                in your cart
              </p>

              <Link
                href="/store"
                className="text-sm font-semibold text-[#6b3f2d] hover:text-[#3f2419]"
              >
                ← Continue Shopping
              </Link>
            </div>
          </section>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-[#eadfd8] bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold text-[#3f2419]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 border-b border-[#eee5df] pb-6">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>

                <span className="font-medium text-[#3f2419]">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Discount</span>

                <span className="font-medium text-green-600">
                  − ₹{discount.toFixed(2)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Shipping</span>

                <span className="font-medium text-green-600">Free</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-5">
              <span className="text-base font-semibold text-[#3f2419]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#3f2419]">
                ₹{total.toFixed(2)}
              </span>
            </div>

            {/* Coupon */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Promo Code
              </label>

              <div className="flex overflow-hidden rounded-xl border border-[#ded3cc]">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  className="bg-[#f3ebe6] px-4 text-sm font-semibold text-[#6b3f2d] hover:bg-[#eadfd8]"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Checkout */}
        <Link href="/checkout">
            <button
              type="button"
              className="w-full  rounded-xl cursor-pointer bg-[#5e3122] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#3f2419]"
            >
              Proceed to Checkout
            </button>
            </Link>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
              <span>🔒</span>
              <span>Secure & encrypted checkout</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
