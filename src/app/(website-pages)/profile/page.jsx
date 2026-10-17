"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiBox,
  FiUser,
  FiMapPin,
  FiSettings,
  FiLogOut,
  FiClock,
  FiShoppingBag,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import client from "@/utils/helper";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, logout, refreshUser } =
    useAuth();
  const [activeTab, setActiveTab] = useState("My Orders");

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch orders from backend
  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          setOrdersLoading(true);
          const res = await client.get("/api/order/my-orders");
          if (res.data?.success) {
            setOrders(res.data.orders || []);
          }
        } catch (err) {
          console.error("Failed to fetch user orders:", err);
        } finally {
          setOrdersLoading(false);
        }
      };

      fetchOrders();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#8C5A3C]/30 border-t-[#8C5A3C] rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] flex items-center justify-center px-4 font-sans text-[#4A3B32]">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-[#EBE3DC] shadow-lg">
          <div className="w-16 h-16 bg-[#F4EBE1] text-[#8C5A3C] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            <FiUser />
          </div>
          <h2 className="text-2xl font-bold text-[#2C1E16] mb-2">
            Sign In Required
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Please log in to your account to view your profile, saved addresses, and order history.
          </p>
          <div className="space-y-3">
            <Link
              href="/signin?redirect=/profile"
              className="block w-full py-3 bg-[#8C5A3C] hover:bg-[#72482F] text-white rounded-xl text-sm font-semibold transition"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/signup"
              className="block w-full py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { name: "My Orders", icon: <FiBox /> },
    { name: "Personal Info", icon: <FiUser /> },
    { name: "Addresses", icon: <FiMapPin /> },
    { name: "Sign Out", icon: <FiLogOut /> },
  ];

  // User initials
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Total spent calculation
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F5F1] py-10 px-4 sm:px-10 lg:px-20 font-sans text-[#4A3B32]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-[280px] flex-shrink-0 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBE3DC] flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-[#F2ECE6] rounded-full flex items-center justify-center text-2xl font-bold text-[#664D3C] mb-4 shadow-inner">
              {initials}
            </div>
            <h2 className="text-lg font-bold text-[#2C1E16]">{user.name}</h2>
            <p className="text-xs text-[#8A7969] mb-3">{user.email}</p>
            <span className="bg-[#FAF3E6] text-[#B88645] text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-amber-200">
              {user.role === "admin" || user.role === "superAdmin"
                ? "Store Administrator"
                : "Valued Member"}
            </span>

            {/* Admin panel link if admin */}
            {(user.role === "admin" || user.role === "superAdmin") && (
              <Link
                href="/admin"
                className="mt-4 w-full py-2 px-3 bg-[#0d1b2a] hover:bg-[#192735] text-teal-400 text-xs font-semibold rounded-xl transition"
              >
                Go to Admin Dashboard &rarr;
              </Link>
            )}
          </div>

          {/* Menu */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-[#EBE3DC]">
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.name}>
                  <button
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.name
                        ? "bg-[#F4EBE1] text-[#664D3C] font-semibold"
                        : "text-[#8A7969] hover:bg-[#FAF6F0] hover:text-[#664D3C]"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Top Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EBE3DC] text-center">
              <p className="text-2xl font-bold text-[#664D3C]">
                {orders.length}
              </p>
              <p className="text-xs text-[#8A7969] mt-1">Total Orders</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EBE3DC] text-center">
              <p className="text-2xl font-bold text-[#664D3C]">
                ₹{totalSpent.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-[#8A7969] mt-1">Total Spent</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EBE3DC] text-center col-span-2 sm:col-span-1">
              <p className="text-2xl font-bold text-[#664D3C]">
                {user.addresses?.length || 0}
              </p>
              <p className="text-xs text-[#8A7969] mt-1">Saved Addresses</p>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#EBE3DC] p-6 sm:p-8 min-h-[420px]">
            {activeTab === "My Orders" && (
              <MyOrdersList orders={orders} loading={ordersLoading} />
            )}
            {activeTab === "Personal Info" && (
              <PersonalInfoTab user={user} refreshUser={refreshUser} />
            )}
            {activeTab === "Addresses" && <AddressesTab user={user} />}
            {activeTab === "Sign Out" && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <FiLogOut />
                </div>
                <h3 className="text-lg font-bold text-[#2C1E16] mb-1">
                  Sign Out of Nestro
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to end your current session?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTab("My Orders")}
                    className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await logout();
                      toast.success("Signed out successfully");
                      router.push("/signin");
                    }}
                    className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 transition"
                  >
                    Yes, Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 1. My Orders Subcomponent
function MyOrdersList({ orders, loading }) {
  if (loading) {
    return (
      <div className="py-16 text-center text-gray-400">
        <div className="w-8 h-8 border-3 border-[#8C5A3C]/30 border-t-[#8C5A3C] rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs">Fetching your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-[#FAF6F0] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 text-gray-400">
          <FiShoppingBag />
        </div>
        <h3 className="text-base font-bold text-[#2C1E16] mb-1">
          No Orders Placed Yet
        </h3>
        <p className="text-xs text-gray-500 mb-5 max-w-sm mx-auto">
          You haven't placed any orders yet. Discover our curated collection of luxury furniture.
        </p>
        <Link
          href="/store"
          className="inline-block px-5 py-2.5 bg-[#8C5A3C] hover:bg-[#72482F] text-white text-xs font-semibold rounded-xl transition"
        >
          Explore Store
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-[#2C1E16]">
          Order History ({orders.length})
        </h3>
        <span className="text-xs text-gray-400">Track current & past deliveries</span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={order._id || order.orderId}
              className="border border-[#EBE3DC] rounded-2xl p-5 hover:border-[#8C5A3C]/40 transition bg-white"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F0EAE3] pb-3 mb-4 gap-2 text-xs">
                <div>
                  <span className="font-mono font-bold text-[#8C5A3C] text-sm">
                    {order.orderId}
                  </span>
                  <span className="text-gray-400 ml-2">· Placed on {dateStr}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                  <span className="font-bold text-[#2C1E16] text-sm">
                    ₹{order.total?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <div className="w-12 h-12 rounded-lg bg-[#FAF6F0] border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">🛋️</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-gray-400 text-[11px]">
                        Qty: {item.qty} · ₹{(item.salePrice || item.price)?.toLocaleString("en-IN")} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery recipient footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex flex-wrap justify-between items-center gap-2">
                <p>
                  Delivering to:{" "}
                  <span className="font-semibold text-gray-700">
                    {order.shippingAddress?.fullName} ({order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.pinCode})
                  </span>
                </p>
                <span className="text-green-700 font-medium">
                  {order.payment?.method} · Paid
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. Personal Info Tab
function PersonalInfoTab({ user, refreshUser }) {
  const [name, setName] = useState(user.name || "");
  const [mobile, setMobile] = useState(user.mobile || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await client.put("/api/user/profile", { name, mobile });
      if (res.data?.success) {
        toast.success("Profile updated successfully!");
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3 className="text-base font-bold mb-6 text-[#2C1E16]">
        Personal Information
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-[#EBE3DC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8C5A3C]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Email Address (Read-only)
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Phone / Mobile Number
          </label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full border border-[#EBE3DC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8C5A3C]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-4 bg-[#8C5A3C] hover:bg-[#72482F] text-white px-6 py-3 rounded-xl text-xs font-bold transition disabled:opacity-60"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

// 3. Addresses Tab
function AddressesTab({ user }) {
  const addresses = user.addresses || [];

  return (
    <div>
      <h3 className="text-base font-bold mb-6 text-[#2C1E16]">
        Saved Shipping Addresses ({addresses.length})
      </h3>

      {addresses.length === 0 ? (
        <div className="p-8 border border-dashed border-gray-300 rounded-2xl text-center text-xs text-gray-500">
          <p>No saved addresses yet.</p>
          <p className="text-gray-400 mt-1">
            Addresses entered during checkout are automatically saved here for quick reordering.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, idx) => (
            <div
              key={idx}
              className="border border-[#EBE3DC] rounded-xl p-5 relative bg-white"
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 bg-[#F4EBE1] text-[#8C6D58] text-[10px] px-2 py-0.5 rounded font-bold">
                  Default
                </span>
              )}
              <h4 className="text-sm font-bold text-[#2C1E16] mb-1">
                {addr.fullName}
              </h4>
              <p className="text-xs text-gray-500 mb-2">📞 {addr.mobile}</p>
              <p className="text-xs text-[#8A7969] leading-relaxed">
                {addr.addressLine}
                <br />
                {addr.city}, {addr.state} - {addr.pincode}
                <br />
                {addr.country || "India"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
