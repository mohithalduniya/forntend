"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FiShoppingCart,
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiTruck,
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiUser,
  FiPhone,
} from "react-icons/fi";
import client from "@/utils/helper";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        selectedStatus !== "all"
          ? `/api/order/admin/all?status=${selectedStatus}`
          : "/api/order/admin/all";

      const [ordersRes, statsRes] = await Promise.all([
        client.get(url),
        client.get("/api/order/admin/stats"),
      ]);

      if (ordersRes.data?.success) {
        setOrders(ordersRes.data.orders || []);
      }
      if (statsRes.data?.success) {
        setStats(statsRes.data.stats || {});
      }
    } catch (err) {
      console.error("Orders Fetch Error:", err);
      toast.error(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await client.patch(`/api/order/admin/status/${orderId}`, {
        status: newStatus,
      });

      if (res.data?.success) {
        toast.success(`Order updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const idMatch = ord.orderId?.toLowerCase().includes(q);
    const customerMatch =
      ord.shippingAddress?.fullName?.toLowerCase().includes(q) ||
      ord.user?.name?.toLowerCase().includes(q);
    const phoneMatch = ord.shippingAddress?.phone?.includes(q);
    const cityMatch = ord.shippingAddress?.city?.toLowerCase().includes(q);
    return idMatch || customerMatch || phoneMatch || cityMatch;
  });

  return (
    <div className="bg-gray-50/50 min-h-screen text-gray-800 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Customer Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor incoming orders, track fulfillment states, and review customer delivery details
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:border-teal-400 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm disabled:opacity-50"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-teal-600" : ""}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <FiShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Total Orders</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalOrders || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Pending Action</p>
            <p className="text-lg font-bold text-gray-900">{stats.pendingOrders || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <FiTruck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Dispatched / Shipped</p>
            <p className="text-lg font-bold text-gray-900">{stats.shippedOrders || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Delivered Revenue</p>
            <p className="text-lg font-bold text-gray-900">
              ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer name, phone, or city..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  selectedStatus === status
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Stream / Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            <div className="w-7 h-7 border-2 border-teal-500/20 border-t-teal-600 rounded-full animate-spin mx-auto mb-2" />
            <span>Loading orders stream...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            <FiShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-gray-600">No matching orders</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Customer orders placed at checkout will appear here immediately.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 text-xs">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order._id;

              return (
                <div key={order._id} className="p-4 hover:bg-gray-50/50 transition">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Customer & Order ID */}
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-gray-100 text-gray-600 rounded-xl mt-0.5 shrink-0">
                        <FiShoppingCart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900 font-mono">
                            {order.orderId}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="font-semibold text-gray-700">
                            {order.shippingAddress?.fullName || order.user?.name || "Customer"}
                          </span>
                          <span>•</span>
                          <span>{order.items?.length || 0} items</span>
                          <span>•</span>
                          <span className="capitalize">{order.payment?.method || "Card"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount, Status Changer & Expand Button */}
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">
                          ₹{(order.total || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {order.payment?.status === "completed" ? "Paid" : "Pending Payment"}
                        </p>
                      </div>

                      <select
                        value={order.orderStatus}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border outline-none cursor-pointer ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : order._id)
                        }
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                        title={isExpanded ? "Collapse" : "View Details"}
                      >
                        {isExpanded ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/60 p-4 rounded-xl">
                      {/* Products in this order */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 mb-2">
                          Ordered Items
                        </h4>
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-100"
                            >
                              <div className="flex items-center gap-2.5">
                                {item.thumbnail ? (
                                  <img
                                    src={item.thumbnail}
                                    alt={item.name}
                                    className="w-8 h-8 rounded-md object-cover border"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                    <FiPackage className="w-4 h-4" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900 text-xs">
                                    {item.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    Qty: {item.qty} × ₹
                                    {(item.salePrice || item.price || 0).toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>
                              <span className="font-bold text-gray-900">
                                ₹
                                {(
                                  (item.salePrice || item.price || 0) * (item.qty || 1)
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address & Contact */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 mb-2">
                          Delivery Destination
                        </h4>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 space-y-1.5 text-xs">
                          <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <FiUser className="text-teal-600" />
                            {order.shippingAddress?.fullName || "N/A"}
                          </p>
                          <p className="text-gray-600 flex items-center gap-1.5">
                            <FiPhone className="text-teal-600" />
                            {order.shippingAddress?.phone || "N/A"}
                          </p>
                          <p className="text-gray-600 flex items-start gap-1.5">
                            <FiMapPin className="text-teal-600 shrink-0 mt-0.5" />
                            <span>
                              {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
                              {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
