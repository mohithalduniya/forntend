"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiUploadCloud, FiArrowLeft, FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import client from "@/utils/helper";
import { toast } from "sonner";

const materialOptions = [
  "Wood",
  "Sheesham",
  "Engineered Wood",
  "Metal",
  "Steel",
  "Plastic",
  "Glass",
  "Marble",
  "Fabric",
  "Leather",
];

const defaultForm = {
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

export default function AddproductsModal(props) {
  const isModal = props.isOpen !== undefined;
  const router = useRouter();

  // Internal state for standalone page mode
  const [internalFormData, setInternalFormData] = useState(defaultForm);
  const [internalImageFile, setInternalImageFile] = useState(null);
  const [internalImagePreview, setInternalImagePreview] = useState("");
  const [internalCategories, setInternalCategories] = useState([]);
  const [internalRooms, setInternalRooms] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isModal) {
      const loadData = async () => {
        try {
          setInternalLoading(true);
          const [catRes, roomRes] = await Promise.all([
            client.get("/api/category"),
            client.get("/api/room"),
          ]);
          if (catRes.data.success) {
            setInternalCategories(catRes.data.category || catRes.data.data || []);
          }
          if (roomRes.data.success) {
            setInternalRooms(roomRes.data.room || roomRes.data.data || []);
          }
        } catch (err) {
          toast.error("Failed to load categories or rooms");
        } finally {
          setInternalLoading(false);
        }
      };
      loadData();
    }
  }, [isModal]);

  if (isModal && !props.isOpen) return null;

  // Active form data
  const formData = isModal ? props.formData : internalFormData;
  const setFormData = isModal ? props.setFormData : setInternalFormData;
  const imagePreview = isModal ? props.imagePreview : internalImagePreview;
  const categories = isModal ? props.categories : internalCategories;
  const categoryLoading = isModal ? props.categoryLoading : internalLoading;
  const rooms = isModal ? props.rooms : internalRooms;
  const roomLoading = isModal ? props.roomLoading : internalLoading;
  const isEdit = isModal ? props.isEdit : false;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "name" && !isEdit) {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      }

      // Auto calculate discount percentage if price and salePrice are set
      if (name === "salePrice" || name === "price") {
        const p = name === "price" ? Number(value) : Number(updated.price);
        const sp = name === "salePrice" ? Number(value) : Number(updated.salePrice);
        if (p > 0 && sp > 0 && sp < p) {
          updated.discount = String(Math.round(((p - sp) / p) * 100));
        }
      }

      return updated;
    });
  };

  const handleInternalImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInternalImageFile(file);
    setInternalImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleInternalRemoveImage = () => {
    setInternalImageFile(null);
    setInternalImagePreview("");
  };

  const handleInternalSubmit = async (e) => {
    e.preventDefault();
    if (!internalImageFile && !isEdit) {
      toast.error("Please select a product thumbnail image");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(internalFormData).forEach(([key, value]) => {
      data.append(key, value ?? "");
    });
    if (internalImageFile) {
      data.append("image", internalImageFile);
    }

    try {
      const res = await client.post("/api/product/create", data);
      if (res.data.success) {
        toast.success("Product created successfully!");
        router.push("/admin/product");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onImageChange = isModal ? props.onImageChange : handleInternalImageChange;
  const onRemoveImage = isModal ? props.onRemoveImage : handleInternalRemoveImage;
  const onSubmit = isModal ? props.onSubmit : handleInternalSubmit;
  const onClose = isModal ? props.onClose : () => router.push("/admin/product");

  const formContent = (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          Product Thumbnail <span className="text-red-500">*</span>
        </label>

        {imagePreview ? (
          <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-gray-200 shadow-inner group">
            <img
              src={imagePreview}
              alt="Product thumbnail"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow hover:bg-red-600 transition"
              aria-label="Remove thumbnail"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-36 h-36 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-teal-50/40 hover:border-teal-400 transition-all">
            <FiUploadCloud className="w-7 h-7 text-teal-600 mb-1" />
            <span className="text-xs text-gray-600 font-semibold">Upload Image</span>
            <span className="text-[10px] text-gray-400">JPG, PNG, WEBP</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="e.g. 6 Seater Velvet Dining Table"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug || ""}
            onChange={handleChange}
            placeholder="e.g. 6-seater-velvet-dining-table"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={formData.categoryId || ""}
            onChange={handleChange}
            required
            disabled={categoryLoading}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
          >
            <option value="">
              {categoryLoading ? "Loading categories..." : "Select Category"}
            </option>
            {!categoryLoading &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Room <span className="text-red-500">*</span>
          </label>
          <select
            name="roomId"
            value={formData.roomId || ""}
            onChange={handleChange}
            required
            disabled={roomLoading}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
          >
            <option value="">
              {roomLoading ? "Loading rooms..." : "Select Room"}
            </option>
            {!roomLoading &&
              rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Regular Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            min="200"
            value={formData.price || ""}
            onChange={handleChange}
            placeholder="e.g. 25000"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Sale Price (₹)
          </label>
          <input
            type="number"
            name="salePrice"
            min="0"
            value={formData.salePrice || ""}
            onChange={handleChange}
            placeholder="e.g. 22000"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            name="discount"
            min="0"
            max="99"
            value={formData.discount || ""}
            onChange={handleChange}
            placeholder="e.g. 12"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Material</label>
          <select
            name="material"
            value={formData.material || "Wood"}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
          >
            {materialOptions.map((mat) => (
              <option key={mat} value={mat}>
                {mat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Color / Finish</label>
          <input
            type="text"
            name="color"
            value={formData.color || ""}
            onChange={handleChange}
            placeholder="e.g. Walnut Brown"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Stock Status</label>
          <select
            name="stock"
            value={String(formData.stock)}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white font-medium"
          >
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Length</label>
          <input
            type="number"
            name="dimensions_length"
            value={formData.dimensions_length || ""}
            onChange={handleChange}
            placeholder="e.g. 120"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Width</label>
          <input
            type="number"
            name="dimensions_width"
            value={formData.dimensions_width || ""}
            onChange={handleChange}
            placeholder="e.g. 60"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Height</label>
          <input
            type="number"
            name="dimensions_height"
            value={formData.dimensions_height || ""}
            onChange={handleChange}
            placeholder="e.g. 75"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Unit</label>
          <select
            name="dimensions_unit"
            value={formData.dimensions_unit || "cm"}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
          >
            <option value="cm">cm</option>
            <option value="inch">inch</option>
            <option value="m">m</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Weight Value</label>
          <input
            type="number"
            name="weight_value"
            value={formData.weight_value || ""}
            onChange={handleChange}
            placeholder="e.g. 18"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Weight Unit</label>
          <select
            name="weight_unit"
            value={formData.weight_unit || "kg"}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">Short Description</label>
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription || ""}
          onChange={handleChange}
          placeholder="Brief summary displayed on cards"
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Detailed Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          rows="4"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Complete material, design, and warranty specifications..."
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          required
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ["status", "Active Status"],
          ["featured", "Featured"],
          ["bestSeller", "Best Seller"],
          ["newArrival", "New Arrival"],
        ].map(([name, label]) => (
          <label
            key={name}
            className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 cursor-pointer transition ${
              String(formData[name]) === "true"
                ? "border-teal-500 bg-teal-50/50"
                : "border-gray-200 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={String(formData[name]) === "true"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [name]: String(e.target.checked),
                }))
              }
              className="accent-teal-600 rounded"
            />
            <span className="text-xs font-semibold text-gray-800">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={categoryLoading || categories.length === 0 || isSubmitting}
          className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{isEdit ? "Update Product" : "Save Product"}</span>
          )}
        </button>
      </div>
    </form>
  );

  // Standalone Page Layout
  if (!isModal) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50/50 min-h-screen">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/product"
              className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-teal-600 transition shadow-sm"
              title="Back to products"
            >
              <FiArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Furniture Product</h1>
              <p className="text-xs text-gray-500">
                Publish a new piece of furniture to your store catalog
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          {formContent}
        </div>
      </div>
    );
  }

  // Modal Layout
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {formContent}
      </div>
    </div>
  );
}

