"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  FiPlus,
  FiImage,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiStar,
  FiTag,
  FiLayers,
} from "react-icons/fi";
import AddproductModal from "./add/page";
import client from "@/utils/helper";
import { toast } from "sonner";

const initialFormState = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  roomId: "",
  price: "",
  salePrice: "",
  discount: "",
  stock: "true",
  material: "Wood",
  color: "",
  status: "true",
  featured: "false",
  bestSeller: "false",
  newArrival: "false",
  dimensions_length: "",
  dimensions_width: "",
  dimensions_height: "",
  dimensions_unit: "cm",
  weight_value: "",
  weight_unit: "kg",
};

export default function ProductPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [roomLoading, setRoomLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [selectedStock, setSelectedStock] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    fetchCategories();
    fetchRooms();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await client.get("/api/product");
      if (response.data.success) {
        setProducts(response.data.product || response.data.data || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const response = await client.get("/api/category");
      if (response.data.success) {
        setCategories(response.data.data || response.data.category || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Category Fetch Error:", error);
      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setRoomLoading(true);
      const response = await client.get("/api/room");
      if (response.data.success) {
        setRooms(response.data.data || response.data.room || []);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error("Room Fetch Error:", error);
      setRooms([]);
    } finally {
      setRoomLoading(false);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = item.name?.toLowerCase().includes(query);
        const slugMatch = item.slug?.toLowerCase().includes(query);
        const descMatch = item.shortDescription?.toLowerCase().includes(query);
        if (!nameMatch && !slugMatch && !descMatch) return false;
      }

      // Category
      if (selectedCategory !== "all") {
        const catId = item.categoryId?._id || item.categoryId;
        if (String(catId) !== selectedCategory) return false;
      }

      // Room
      if (selectedRoom !== "all") {
        const rId = item.roomId?._id || item.roomId;
        if (String(rId) !== selectedRoom) return false;
      }

      // Stock
      if (selectedStock !== "all") {
        const isStock = item.stock === true || item.stock === "true";
        if (selectedStock === "in" && !isStock) return false;
        if (selectedStock === "out" && isStock) return false;
      }

      // Status
      if (selectedStatus !== "all") {
        const isActive = item.status === true || item.status === "true";
        if (selectedStatus === "active" && !isActive) return false;
        if (selectedStatus === "inactive" && isActive) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedRoom, selectedStock, selectedStatus]);

  // Metrics
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === true || p.status === "true").length;
    const inStock = products.filter((p) => p.stock === true || p.stock === "true").length;
    const featured = products.filter((p) => p.featured === true || p.featured === "true").length;
    return { total, active, inStock, outOfStock: total - inStock, featured };
  }, [products]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleToggleStatus = async (item) => {
    try {
      const response = await client.patch(`/api/product/status/${item._id}`);
      if (response.data.success) {
        toast.success(response.data.message || "Product status updated");
        fetchProducts();
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  const handleFlagToggle = async (item, field) => {
    try {
      const response = await client.patch(`/api/product/flag/${item._id}`, {
        field,
      });
      if (response.data.success) {
        toast.success(response.data.message || `${field} updated successfully`);
        fetchProducts();
      }
    } catch (error) {
      console.error("Flag Update Error:", error);
      toast.error(error?.response?.data?.message || "Failed to update product flag");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value ?? "");
    });

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      let response;
      if (editId) {
        response = await client.put(`/api/product/update/${editId}`, data);
      } else {
        response = await client.post("/api/product/create", data);
      }

      if (response.data.success) {
        toast.success(
          response.data.message ||
            `Product ${editId ? "updated" : "created"} successfully!`,
        );
        await fetchProducts();
        resetForm();
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const resetForm = () => {
    setFormData({ ...initialFormState });
    setImageFile(null);
    setImagePreview("");
    setIsOpenModal(false);
    setEditId(null);
  };

  const handleAddClick = () => {
    setFormData({ ...initialFormState });
    setImageFile(null);
    setImagePreview("");
    setEditId(null);
    setIsOpenModal(true);
  };

  const handleEditClick = (prod) => {
    setEditId(prod._id);
    setFormData({
      name: prod.name || "",
      slug: prod.slug || "",
      shortDescription: prod.shortDescription || "",
      description: prod.description || "",
      categoryId: prod.categoryId?._id || prod.categoryId || "",
      roomId: prod.roomId?._id || prod.roomId || "",
      price: prod.price ?? "",
      salePrice: prod.salePrice ?? "",
      discount: prod.discount ?? "",
      stock: String(prod.stock ?? true),
      material: prod.material || "Wood",
      color: prod.color || "",
      status: String(prod.status ?? true),
      featured: String(prod.featured ?? false),
      bestSeller: String(prod.bestSeller ?? false),
      newArrival: String(prod.newArrival ?? false),
      dimensions_length: prod.dimensions?.length || "",
      dimensions_width: prod.dimensions?.width || "",
      dimensions_height: prod.dimensions?.height || "",
      dimensions_unit: prod.dimensions?.unit || "cm",
      weight_value: prod.weight?.value || "",
      weight_unit: prod.weight?.unit || "kg",
    });

    setImageFile(null);
    setImagePreview(prod.thumbnail || "");
    setIsOpenModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await client.delete(`/api/product/delete/${id}`);
      if (response.data.success) {
        toast.success(response.data.message || "Product deleted successfully!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete product");
    }
  };

  const getCategoryName = (item) => {
    if (item.categoryId && typeof item.categoryId === "object") {
      return item.categoryId.name || "N/A";
    }
    return (
      categories.find((c) => c._id === item.categoryId)?.name ||
      "N/A"
    );
  };

  const getRoomName = (item) => {
    if (item.roomId && typeof item.roomId === "object") {
      return item.roomId.name || "N/A";
    }
    return (
      rooms.find((r) => r._id === item.roomId)?.name ||
      "N/A"
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedRoom("all");
    setSelectedStock("all");
    setSelectedStatus("all");
  };

  if (!mounted) return null;

  return (
    <div className="bg-gray-50/50 min-h-screen text-gray-800 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage inventory, pricing, categorization, and live storefront visibility
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-teal-600 hover:border-teal-300 transition shadow-sm disabled:opacity-50"
            title="Refresh Products"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-teal-600" : ""}`} />
          </button>

          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
            <FiPackage className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Total Products</p>
            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Active Online</p>
            <p className="text-lg font-bold text-gray-900">{stats.active}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <FiAlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Out of Stock</p>
            <p className="text-lg font-bold text-gray-900">{stats.outOfStock}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <FiStar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Featured Items</p>
            <p className="text-lg font-bold text-gray-900">{stats.featured}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, slug, or keywords..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Room Filter */}
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Rooms</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {(searchQuery ||
            selectedCategory !== "all" ||
            selectedRoom !== "all" ||
            selectedStock !== "all" ||
            selectedStatus !== "all") && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/40">
                <th className="py-3.5 px-5 w-20">ITEM</th>
                <th className="py-3.5 px-5">PRODUCT NAME</th>
                <th className="py-3.5 px-5">COLLECTION & ROOM</th>
                <th className="py-3.5 px-5">PRICING</th>
                <th className="py-3.5 px-5">INVENTORY</th>
                <th className="py-3.5 px-5">VISIBILITY</th>
                <th className="py-3.5 px-5">FEATURE TAGS</th>
                <th className="py-3.5 px-5 text-right w-24">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    <div className="w-7 h-7 border-2 border-teal-500/20 border-t-teal-600 rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading products catalog...</span>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-30 text-gray-400" />
                    <p className="font-semibold text-gray-600">No products found</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Try adjusting your search filters or click "Add New Product" to create one.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const isActive = item.status === true;
                  const isInStock = item.stock === true;
                  const hasDiscount =
                    item.salePrice &&
                    item.price &&
                    Number(item.salePrice) < Number(item.price);

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Thumbnail */}
                      <td className="py-3.5 px-5">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl border border-gray-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <FiImage className="w-5 h-5" />
                          </div>
                        )}
                      </td>

                      {/* Name & Slug */}
                      <td className="py-3.5 px-5 max-w-[220px]">
                        <p className="font-bold text-gray-900 text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono truncate">
                          {item.slug}
                        </p>
                        <div className="flex gap-2 text-[10px] text-gray-400 mt-0.5">
                          {item.material && <span>Mat: {item.material}</span>}
                          {item.color && <span>• Color: {item.color}</span>}
                        </div>
                      </td>

                      {/* Category & Room */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                            {getCategoryName(item)}
                          </span>
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                            {getRoomName(item)}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-900 text-sm">
                            ₹{(item.salePrice || item.price || 0).toLocaleString("en-IN")}
                          </p>
                          {hasDiscount && (
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span className="line-through text-gray-400">
                                ₹{item.price?.toLocaleString("en-IN")}
                              </span>
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                                {item.discount ||
                                  Math.round(
                                    ((item.price - item.salePrice) / item.price) * 100
                                  )}
                                % OFF
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Inventory / Stock */}
                      <td className="py-3.5 px-5">
                        <button
                          type="button"
                          onClick={() => handleFlagToggle(item, "stock")}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition ${
                            isInStock
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                          }`}
                          title="Click to toggle Stock Status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? "bg-emerald-500" : "bg-rose-500"}`} />
                          <span>{isInStock ? "In Stock" : "Out of Stock"}</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition ${
                            isActive
                              ? "bg-teal-50 text-teal-700 hover:bg-teal-100"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title="Click to toggle active status"
                        >
                          {isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Tags */}
                      <td className="py-3.5 px-5">
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => handleFlagToggle(item, "featured")}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                              item.featured
                                ? "bg-purple-100 text-purple-700 font-semibold"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title="Toggle Featured"
                          >
                            Featured
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFlagToggle(item, "bestSeller")}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                              item.bestSeller
                                ? "bg-amber-100 text-amber-700 font-semibold"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title="Toggle Best Seller"
                          >
                            Best Seller
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFlagToggle(item, "newArrival")}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                              item.newArrival
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title="Toggle New Arrival"
                          >
                            New
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditClick(item)}
                            className="text-gray-400 hover:text-teal-600 p-1.5 rounded-lg hover:bg-teal-50 transition"
                            title="Edit Product"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(item._id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AddproductModal
        isOpen={isOpenModal}
        onClose={resetForm}
        onSubmit={handleAddProduct}
        formData={formData}
        setFormData={setFormData}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
        isEdit={!!editId}
        categories={categories}
        categoryLoading={categoryLoading}
        rooms={rooms}
        roomLoading={roomLoading}
      />
    </div>
  );
}

