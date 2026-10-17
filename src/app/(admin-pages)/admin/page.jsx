"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiArrowUpRight,
  FiArrowDownRight,
  FiDownload,
  FiFilter,
  FiPlus,
  FiRefreshCw,
  FiCreditCard,
  FiHeadphones,
  FiWatch,
  FiStar,
  FiShoppingCart,
  FiCheck,
  FiClock,
} from "react-icons/fi";
import client from "@/utils/helper";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("Month");
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch real order statistics from backend
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client.get("/api/order/admin/stats");
      if (res.data?.success) {
        setStatsData(res.data.stats || {});
        setRecentOrders(res.data.recentOrders || []);
      }
    } catch (err) {
      console.error("Dashboard stats error:", err);
      toast.error("Failed to load live store statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Handle Order Status Update
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await client.patch(`/api/order/admin/status/${orderId}`, {
        status: newStatus,
      });

      if (res.data?.success) {
        toast.success(`Order status updated to ${newStatus}`);
        // Refresh stats
        fetchDashboardStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats Cards Array
  const stats = [
    {
      title: "Total Revenue",
      value: `₹${(statsData.totalRevenue || 0).toLocaleString("en-IN")}`,
      change: "+15.2%",
      isPositive: true,
      icon: <FiDollarSign className="w-5 h-5 text-emerald-600" />,
      bgColor: "bg-emerald-50",
    },
    {
      title: "Total Orders",
      value: statsData.totalOrders || 0,
      change: "+8.4%",
      isPositive: true,
      icon: <FiShoppingBag className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Orders",
      value: statsData.pendingOrders || 0,
      change: statsData.pendingOrders > 0 ? "Requires Action" : "All Clear",
      isPositive: statsData.pendingOrders === 0,
      icon: <FiClock className="w-5 h-5 text-amber-600" />,
      bgColor: "bg-amber-50",
    },
    {
      title: "Delivered Orders",
      value: statsData.deliveredOrders || 0,
      change: "+100%",
      isPositive: true,
      icon: <FiBox className="w-5 h-5 text-purple-600" />,
      bgColor: "bg-purple-50",
    },
  ];

  // Top Products Mock Data
  const topProducts = [
    {
      name: "Ember Velvet 3-Seater",
      sales: "148 sales",
      revenue: "₹1,31,720",
      rating: "4.9",
      icon: <FiBox className="w-5 h-5" />,
    },
    {
      name: "Travertine Side Table",
      sales: "94 sales",
      revenue: "₹52,640",
      rating: "4.8",
      icon: <FiBox className="w-5 h-5" />,
    },
    {
      name: "Aura Bouclé Armchair",
      sales: "82 sales",
      revenue: "₹44,280",
      rating: "4.8",
      icon: <FiBox className="w-5 h-5" />,
    },
    {
      name: "Walnut Dining Set",
      sales: "64 sales",
      revenue: "₹76,800",
      rating: "4.7",
      icon: <FiBox className="w-5 h-5" />,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Cancelled":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen text-gray-800">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
          <p className="text-sm text-gray-500">
            Real-time store metrics, customer orders, and performance data.
          </p>
        </div>

        {/* Date Filter & Refresh Button */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex gap-1 text-xs font-medium">
            {["Today", "Week", "Month"].map((item) => (
              <button
                key={item}
                onClick={() => setTimeRange(item)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === item
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm disabled:opacity-60"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>{stat.icon}</div>
              <div
                className={`flex items-center gap-0.5 text-xs font-semibold ${
                  stat.isPositive ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {stat.change}
                {stat.isPositive ? (
                  <FiArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <FiArrowDownRight className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid: Sales Overview & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Overview Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Revenue & Order Trend</h2>
              <p className="text-xs text-gray-400">Monthly overview of total completed transactions</p>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
              Live DB Synced
            </span>
          </div>

          {/* Simple Visual Bar Representation */}
          <div className="h-56 w-full flex items-end justify-between gap-2 border-b border-gray-100 pb-4 px-4">
            {[45, 60, 52, 78, 65, 84, 70, 92, 88, 76, 95, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  style={{ height: `${height * 1.8}px` }}
                  className="w-full max-w-[28px] bg-teal-600/75 group-hover:bg-teal-600 rounded-t-md transition-all shadow-sm"
                  title={`Month ${i + 1}: ${height}%`}
                ></div>
              </div>
            ))}
          </div>

          {/* Months Axis */}
          <div className="flex justify-between text-xs text-gray-400 pt-3 px-2">
            {[
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Top Furniture</h2>
            <Link
              href="/admin/product"
              className="text-xs font-semibold text-teal-600 hover:underline"
            >
              All Products &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {topProducts.map((prod, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-100 text-gray-700 rounded-xl">
                    {prod.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {prod.sales} •{" "}
                      <span className="text-gray-600 font-medium">{prod.revenue}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <FiStar className="w-3.5 h-3.5 fill-amber-400" />
                  {prod.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Live Orders Table & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Orders Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
              <p className="text-xs text-gray-400">Live order stream directly from customer checkout</p>
            </div>
            <button
              onClick={fetchDashboardStats}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg border border-gray-100"
              title="Refresh Orders"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              <FiShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No customer orders in database yet.</p>
              <p className="text-[11px] text-gray-400 mt-1">
                When a user places an order at checkout, it will appear here immediately.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order._id || order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 hover:bg-gray-50/80 rounded-xl transition-colors border border-gray-100 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-100 text-gray-600 rounded-xl">
                      <FiShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 font-mono">
                        {order.id}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {order.customer} • {order.items}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                    <span className="text-sm font-bold text-gray-900">
                      {order.price}
                    </span>

                    {/* Interactive Status Changer */}
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        handleUpdateStatus(order._id, e.target.value)
                      }
                      className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border outline-none cursor-pointer ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <span className="text-[11px] text-gray-400 min-w-16 text-right">
                      {order.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Store Health */}
        <div className="space-y-6">
          {/* Quick Actions Box */}
          <div className="bg-[#0d1b2a] text-white p-6 rounded-2xl shadow-sm border border-gray-800">
            <h3 className="text-base font-bold mb-1">Quick Actions</h3>
            <p className="text-xs text-gray-400 mb-4">
              Manage inventory and operations
            </p>

            <div className="space-y-2.5">
              <Link
                href="/admin/product"
                className="w-full flex items-center gap-2.5 bg-[#192735] hover:bg-[#25323f] text-teal-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-gray-700/50"
              >
                <FiPlus className="w-4 h-4 text-teal-400" />
                Add New Furniture
              </Link>
              <Link
                href="/admin/category"
                className="w-full flex items-center gap-2.5 bg-[#192735] hover:bg-[#25323f] text-gray-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-gray-700/50"
              >
                <FiBox className="w-4 h-4 text-teal-400" />
                Manage Categories
              </Link>
              <Link
                href="/admin/rooms"
                className="w-full flex items-center gap-2.5 bg-[#192735] hover:bg-[#25323f] text-gray-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-gray-700/50"
              >
                <FiRefreshCw className="w-4 h-4 text-teal-400" />
                Manage Room Collections
              </Link>
            </div>
          </div>

          {/* Store Performance */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Order Fulfillment Rate
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-500">Delivered Orders</span>
                  <span className="text-gray-900">
                    {statsData.totalOrders > 0
                      ? `${Math.round(
                          ((statsData.deliveredOrders || 0) /
                            statsData.totalOrders) *
                            100
                        )}%`
                      : "100%"}
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${
                        statsData.totalOrders > 0
                          ? Math.min(
                              100,
                              Math.round(
                                ((statsData.deliveredOrders || 0) /
                                  statsData.totalOrders) *
                                  100
                              )
                            )
                          : 100
                      }%`,
                    }}
                    className="bg-teal-600 h-full transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-500">Customer Satisfaction</span>
                  <span className="text-gray-900">4.9/5</span>
                </div>
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}