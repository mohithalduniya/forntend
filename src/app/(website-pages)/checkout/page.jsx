"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { emtycart } from "@/redux/features/cartsSlice";
import { useAuth } from "@/context/AuthContext";
import client from "@/utils/helper";
import { toast } from "sonner";
import {
  Check,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();

  const cart = useSelector((store) => store.cart);
  const cartItems = cart?.item || [];

  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("Credit / Debit Card");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    cardNumber: "4242 •••• •••• 4242",
    expiry: "12/28",
    cvv: "888",
    couponCode: "NESTRO10",
  });

  const [couponApplied, setCouponApplied] = useState(false);

  // Auto-fill user details when available
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").trim().split(" ");
      const first = nameParts[0] || "";
      const last = nameParts.slice(1).join(" ") || "";

      const defaultAddr =
        user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];

      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || first,
        lastName: prev.lastName || last,
        email: prev.email || user.email || "",
        phone: prev.phone || user.mobile || defaultAddr?.mobile || "",
        address: prev.address || defaultAddr?.addressLine || "",
        city: prev.city || defaultAddr?.city || "",
        state: prev.state || defaultAddr?.state || "",
        pinCode: prev.pinCode || defaultAddr?.pincode || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Cart Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price =
      Number(item.saleprice ?? item.salePrice) || Number(item.price) || 0;
    const qty = Number(item.qty) || 1;
    return acc + price * qty;
  }, 0);

  const shippingCost = shipping === "express" ? 1500 : 0;
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const applyCoupon = () => {
    if (formData.couponCode.trim().toUpperCase() === "NESTRO10") {
      setCouponApplied(true);
      toast.success("Coupon NESTRO10 applied! 10% discount added.");
    } else {
      toast.error("Invalid coupon code. Try 'NESTRO10'");
    }
  };

  // Handle Order Placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add products before placing an order.");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please sign in to place your order.");
      router.push(`/signin?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    if (
      !formData.firstName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pinCode.trim()
    ) {
      toast.error("Please fill in all required shipping address fields.");
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.id || item._id,
          name: item.name,
          thumbnail: item.thumbnail,
          price: Number(item.price) || 0,
          salePrice:
            Number(item.saleprice ?? item.salePrice) || Number(item.price) || 0,
          qty: Number(item.qty) || 1,
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email || user?.email,
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pinCode: formData.pinCode.trim(),
        },
        shippingMethod: {
          method: shipping === "express" ? "Express Delivery" : "Standard Delivery",
          cost: shippingCost,
        },
        payment: {
          method: payment,
          status: "completed",
        },
        discount: discountAmount,
        shippingCost,
      };

      const res = await client.post("/api/order/create", orderPayload);

      if (res.data?.success && res.data?.order) {
        toast.success("Order placed successfully!");
        setOrderSuccess(res.data.order);
        // Clear Redux Cart & LocalStorage
        dispatch(emtycart());
      } else {
        toast.error(res.data?.message || "Failed to place order.");
      }
    } catch (err) {
      console.error("Place Order Error:", err);
      toast.error(
        err.response?.data?.message || "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] py-16 px-4 font-sans text-[#2C221E] flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E0D5] shadow-xl text-center">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={44} />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#8C5A3C]">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#2C221E] mt-1 mb-2">
            Thank you for your purchase!
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Your order has been received and is being prepared with white-glove care.
          </p>

          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8E0D5] text-left mb-6 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-gray-200/80 pb-2">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-mono font-bold text-[#8C5A3C] text-sm">
                {orderSuccess.orderId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Recipient:</span>
              <span className="font-semibold text-gray-800">
                {orderSuccess.shippingAddress?.fullName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Address:</span>
              <span className="font-semibold text-gray-800 text-right max-w-[220px] truncate">
                {orderSuccess.shippingAddress?.address}, {orderSuccess.shippingAddress?.city}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-semibold text-gray-800">
                {orderSuccess.payment?.method} (Paid)
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200/80 pt-2 text-sm">
              <span className="font-bold text-gray-700">Total Paid:</span>
              <span className="font-bold text-[#8C5A3C] text-base">
                ₹{orderSuccess.total?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/profile"
              className="flex-1 py-3.5 px-5 bg-[#8C5A3C] hover:bg-[#72482F] text-white rounded-xl text-sm font-semibold transition"
            >
              View Order in Profile
            </Link>
            <Link
              href="/store"
              className="flex-1 py-3.5 px-5 bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2C221E] py-10 px-4 md:px-12 font-sans">
      {/* Checkout Stepper Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link href="/cart" className="flex items-center gap-1 text-[#8C5A3C] hover:underline">
            <span className="w-5 h-5 rounded-full bg-[#8C5A3C] text-white flex items-center justify-center text-[10px]">
              <Check size={12} />
            </span>{" "}
            Cart
          </Link>
          <div className="w-8 h-px bg-gray-300"></div>
          <span className="flex items-center gap-1 text-[#8C5A3C] font-semibold">
            <span className="w-5 h-5 rounded-full bg-[#8C5A3C] text-white flex items-center justify-center text-[10px]">
              2
            </span>{" "}
            Delivery & Payment
          </span>
          <div className="w-8 h-px bg-gray-300"></div>
          <span className="flex items-center gap-1 text-gray-400">
            <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px]">
              3
            </span>{" "}
            Confirmation
          </span>
        </div>
      </div>

      {/* Non-authenticated user notification */}
      {!isAuthenticated && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-semibold text-amber-900">Have a Nestro account?</p>
            <p className="text-amber-700">
              Sign in to save addresses, track order progress, and earn loyalty points.
            </p>
          </div>
          <Link
            href={`/signin?redirect=${encodeURIComponent("/checkout")}`}
            className="px-4 py-2 bg-[#8C5A3C] text-white font-semibold rounded-lg hover:bg-[#72482F] transition whitespace-nowrap shadow-sm"
          >
            Sign In Now
          </Link>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Section */}
        <div className="lg:col-span-7 space-y-8">
          {/* Delivery Information */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800">
              1. Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#8C5A3C]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="e.g. Sharma"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#8C5A3C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@email.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#8C5A3C]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#8C5A3C]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="House No, Apartment, Street name"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#8C5A3C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Jaipur"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#8C5A3C]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Rajasthan"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#8C5A3C]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  placeholder="302020"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#8C5A3C]"
                />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800">
              2. Shipping Method
            </h2>
            <div className="space-y-3">
              <label
                onClick={() => setShipping("standard")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shipping === "standard"
                    ? "border-[#8C5A3C] bg-amber-50/30 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shipping === "standard"}
                    onChange={() => setShipping("standard")}
                    className="accent-[#8C5A3C]"
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Standard Delivery</p>
                    <p className="text-[11px] text-gray-500">
                      5–7 business days + Free white-glove assembly
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md">
                  FREE
                </span>
              </label>

              <label
                onClick={() => setShipping("express")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shipping === "express"
                    ? "border-[#8C5A3C] bg-amber-50/30 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shipping === "express"}
                    onChange={() => setShipping("express")}
                    className="accent-[#8C5A3C]"
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Express Priority</p>
                    <p className="text-[11px] text-gray-500">
                      2–3 business days priority dispatch
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#8C5A3C]">₹1,500</span>
              </label>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800">
              3. Payment Option
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                "Credit / Debit Card",
                "UPI / QR",
                "Net Banking",
                "Cash on Delivery",
              ].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPayment(method)}
                  className={`py-2.5 px-2 text-xs rounded-xl border text-center transition-all ${
                    payment === method
                      ? "border-[#8C5A3C] bg-[#8C5A3C] text-white font-semibold shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {payment === "Credit / Debit Card" && (
              <div className="space-y-4 bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#8C5A3C] bg-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM / YY"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#8C5A3C] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#8C5A3C] bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {payment === "Cash on Delivery" && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-800">
                <p className="font-semibold">Cash on Delivery selected.</p>
                <p className="mt-0.5 text-amber-700">
                  Pay securely with cash or UPI at your doorstep upon delivery.
                </p>
              </div>
            )}

            {payment === "UPI / QR" && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800">
                <p className="font-semibold">UPI Payment</p>
                <p className="mt-0.5 text-teal-700">
                  Instant verification via GPay, PhonePe, Paytm or BHIM.
                </p>
              </div>
            )}

            {payment === "Net Banking" && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700">
                <p className="font-semibold">All major Indian banks supported</p>
                <p className="mt-0.5 text-gray-500">
                  HDFC, ICICI, SBI, Axis, Kotak and 40+ others.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="w-full mt-6 py-4 bg-[#8C5A3C] hover:bg-[#72482F] text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8C5A3C]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <Lock size={15} />
                  <span>Place Order • ₹{total.toLocaleString("en-IN")}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Summary Section */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                Order Summary ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
              </h3>
              <Link
                href="/cart"
                className="text-xs font-semibold text-[#8C5A3C] hover:underline"
              >
                Edit Cart
              </Link>
            </div>

            {/* Cart Items List */}
            {cartItems.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1 mb-6">
                {cartItems.map((item, idx) => {
                  const price =
                    Number(item.saleprice ?? item.salePrice) ||
                    Number(item.price) ||
                    0;
                  const qty = Number(item.qty) || 1;

                  return (
                    <div
                      key={item.id || item._id || idx}
                      className="flex items-center justify-between text-xs gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-base">🛋️</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-gray-400 text-[11px]">
                            Qty: {qty} × ₹{price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800 shrink-0">
                        ₹{(price * qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-400">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>Your shopping bag is empty.</p>
                <Link
                  href="/store"
                  className="mt-3 inline-block font-semibold text-[#8C5A3C] hover:underline"
                >
                  Browse Store →
                </Link>
              </div>
            )}

            {/* Pricing Breakdown */}
            <div className="border-t border-gray-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                  {shippingCost === 0 ? "Free" : `₹${shippingCost.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Assembly & Placement</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Promo Discount</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3">
                <span>Total Due</span>
                <span className="text-[#8C5A3C]">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Coupon Box */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
            <label className="block text-xs font-semibold text-gray-600">
              Apply Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleInputChange}
                placeholder="Promo Code"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white uppercase focus:outline-none focus:border-[#8C5A3C]"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="px-4 py-2 bg-[#2A201C] hover:bg-black text-white text-xs font-semibold rounded-lg transition"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <div className="p-2 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs flex items-center gap-1.5 font-medium">
                <Check size={13} /> Code applied! 10% discount included.
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl text-xs space-y-1.5">
            <p className="font-semibold flex items-center gap-1 text-gray-700">
              <ShieldCheck size={15} className="text-[#8C5A3C]" /> Purchase Protection Guarantee
            </p>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              5-year frame warranty · 30-day money-back guarantee · Real-time order tracking · 100% verified authentic materials.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}