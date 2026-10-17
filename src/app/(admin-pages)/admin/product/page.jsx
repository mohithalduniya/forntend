"use client";

import React, { useEffect, useState } from "react";
import { FiPlus, FiImage, FiEdit, FiTrash2 } from "react-icons/fi";
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

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    fetchCategories();
    fetchRooms();
  }, []);

  const fetchProducts = async () => {
    try {
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
      toast.error(
        error?.response?.data?.message || "Failed to load categories",
      );
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
      toast.error(error?.response?.data?.message || "Failed to load rooms");
    } finally {
      setRoomLoading(false);
    }
  };

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
        toast.success(
          response.data.message || "Product status updated successfully",
        );
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
      toast.error(error?.response?.data?.message || "Failed to update product");
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
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

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
      categories.find((category) => category._id === item.categoryId)?.name ||
      "N/A"
    );
  };

  if (!mounted) return null;

  return (
    <div className="bg-gray-50/50 min-h-screen p-6 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage, Create, Update, and Delete Products
          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                <th className="py-4 px-6 w-24">IMAGE</th>
                <th className="py-4 px-6">NAME</th>
                <th className="py-4 px-6">DETAILS</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right w-28">ACTION</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((item) => {
                  const isActive = item.status === true;

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="py-4 px-6">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-xl border"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <FiImage className="w-5 h-5" />
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.slug}</p>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-500">
                        <p>
                          <strong>Category:</strong> {getCategoryName(item)}
                        </p>
                        <p>
                          <strong>Room:</strong>{" "}
                          {item.roomId?.name || item.roomId || "N/A"}
                        </p>
                        <p>
                          <strong>Price:</strong> ₹
                          {item.salePrice ?? item.price ?? "N/A"}
                        </p>
                        <p>
                          <strong>Material:</strong> {item.material || "N/A"}
                        </p>
                        <p>
                          <strong>Color:</strong> {item.color || "N/A"}
                        </p>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                            isActive
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleFlagToggle(item, "featured")}
                            className={`text-xs px-2 py-1 rounded-lg ${item.featured ? "bg-teal-100 text-teal-700" : "text-gray-400 hover:bg-gray-100"}`}
                            title="Toggle Featured"
                          >
                            Featured
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFlagToggle(item, "bestSeller")}
                            className={`text-xs px-2 py-1 rounded-lg ${item.bestSeller ? "bg-teal-100 text-teal-700" : "text-gray-400 hover:bg-gray-100"}`}
                            title="Toggle Featured"
                          >
                            Best Seller
                          </button>

                          <button
                            type="button"
                            onClick={() => handleFlagToggle(item, "newArrival")}
                            className={`text-xs px-2 py-1 rounded-lg ${item.newArrival ? "bg-teal-100 text-teal-700" : "text-gray-400 hover:bg-gray-100"}`}
                            title="Toggle Featured"
                          >
                            New Arrival
                          </button>

                          <button
                            type="button"
                            onClick={() => handleFlagToggle(item, "stock")}
                            className={`text-xs px-2 py-1 rounded-lg ${item.stock ? "bg-teal-100 text-teal-700" : "text-gray-400 hover:bg-gray-100"}`}
                            title="Toggle Featured"
                          >
                            Stock
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(item)}
                            className="text-gray-400 hover:text-teal-600 p-1.5 rounded-lg hover:bg-teal-50 transition"
                            title="Edit"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(item._id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                            title="Delete"
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
