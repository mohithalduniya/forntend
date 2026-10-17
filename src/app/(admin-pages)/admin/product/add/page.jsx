"use client";

import React from "react";
import { FiX, FiUploadCloud } from "react-icons/fi";

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

export default function AddproductsModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  imagePreview,
  onImageChange,
  onRemoveImage,
  isEdit = false,
  categories = [],
  categoryLoading = false,
  rooms = [],
  roomLoading = false,
}) {
  if (!isOpen) return null;

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

      return updated;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Thumbnail
            </label>

            {imagePreview ? (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border">
                <img
                  src={imagePreview}
                  alt="Product thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  aria-label="Remove thumbnail"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-100 transition-all">
                <FiUploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium">Add Image</span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={onImageChange}
                  className="hidden"
                />
              </label>
            )}
            <p className="text-[10px] text-gray-400 mt-1">
              One thumbnail image is supported by the current backend route.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="e.g. 6 Seater Dining Table"
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug || ""}
                onChange={handleChange}
                placeholder="e.g. 6-seater-dining-table"
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId || ""}
                onChange={handleChange}
                required
                disabled={categoryLoading}
                className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
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
              {!categoryLoading && categories.length === 0 && (
                <p className="text-[10px] text-red-500 mt-1">No categories found.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Room</label>
              <select
                name="roomId"
                value={formData.roomId || ""}
                onChange={handleChange}
                required
                disabled={roomLoading}
                className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
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
              {!roomLoading && rooms.length === 0 && (
                <p className="text-[10px] text-red-500 mt-1">No rooms found.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                min="200"
                value={formData.price || ""}
                onChange={handleChange}
                placeholder="e.g. 25000"
                className="w-full px-3 py-2 border rounded-xl text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Sale Price</label>
              <input
                type="number"
                name="salePrice"
                min="0"
                value={formData.salePrice || ""}
                onChange={handleChange}
                placeholder="e.g. 22000"
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Discount %</label>
              <input
                type="number"
                name="discount"
                min="0"
                value={formData.discount || ""}
                onChange={handleChange}
                placeholder="e.g. 12"
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Material</label>
              <select
                name="material"
                value={formData.material || "Wood"}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
              >
                {materialOptions.map((material) => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color || ""}
                onChange={handleChange}
                placeholder="e.g. Walnut Brown"
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Stock</label>
              <select
                name="stock"
                value={String(formData.stock)}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
              >
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Length</label>
              <input
                type="number"
                name="dimensions_length"
                value={formData.dimensions_length || ""}
                onChange={handleChange}
                placeholder="e.g. 120"
                className="w-full px-3 py-2 border rounded-xl text-sm"
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
                className="w-full px-3 py-2 border rounded-xl text-sm"
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
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Dim. Unit</label>
              <select
                name="dimensions_unit"
                value={formData.dimensions_unit || "cm"}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
              >
                <option value="cm">cm</option>
                <option value="inch">inch</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Weight</label>
              <input
                type="number"
                name="weight_value"
                value={formData.weight_value || ""}
                onChange={handleChange}
                placeholder="e.g. 15"
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Weight Unit</label>
              <select
                name="weight_unit"
                value={formData.weight_unit || "kg"}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
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
              placeholder="Brief summary of the product"
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Detailed product information..."
              className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              ["status", "Active Status"],
              ["featured", "Featured"],
              ["bestSeller", "Best Seller"],
              ["newArrival", "New Arrival"],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={String(formData[name]) === "true"}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [name]: String(e.target.checked) }))
                  }
                />
                <span className="text-xs font-semibold text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={categoryLoading || categories.length === 0}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEdit ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
