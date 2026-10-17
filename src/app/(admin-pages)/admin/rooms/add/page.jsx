"use client";
import React from "react";
import { FiX, FiUploadCloud } from "react-icons/fi";

export default function AddRoomsModal({
  isOpen,
  onClose,
  onSubmit,
  name,
  slug,
  status,
  imagePreview,
  onNameChange,
  onSlugChange,
  onStatusChange,
  onImageChange,
  isEdit = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">{isEdit ? "Edit Rooms" : "Add New Rooms"}</h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Rooms Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onImageChange(null)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-100 transition-all">
                  <FiUploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 font-medium">
                    Click to upload image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Rooms Name
            </label>
            <input
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="e.g. Laptops"
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="e.g. laptops"
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition"
            >
              {isEdit ? "Update Rooms" : "Save Rooms"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
