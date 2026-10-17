"use client";
import React, { useState, useEffect } from "react";
import { FiPlus, FiImage, FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";
import AddroomModal from "./add/page";
import client from "@/utils/helper";
import { toast } from "sonner";

export default function roomPage() {
  const [mounted, setMounted] = useState(false);
  const [room, setroom] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("Active");
  const [editId, setEditId] = useState(null);

  // Hydration Fix & Fetch Data
  useEffect(() => {
    setMounted(true);
    fetchroom();
  }, []);

  const fetchroom = async () => {
    try {
      const response = await client.get("/api/room");
      if (response.data.success) {
        setroom(response.data.data || response.data.room || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (!e) {
      setImageFile(null);
      setImagePreview("");
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/\s+/g, "-"));
  };

  const handleAddroom = async (e) => {
    e.preventDefault();
    if (!name) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug || name.toLowerCase().replace(/\s+/g, "-"));
    formData.append("status", status);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      // Axios auto-detects FormData content-type boundary properly when header is omitted
      let response;
      if (editId) {
        response = await client.patch(`/api/room/update/${editId}`, formData);
      } else {
        response = await client.post("/api/room/create", formData);
      }

      if (response.data.success) {
        toast.success(response.data.message || `room ${editId ? 'updated' : 'added'} successfully!`);
        fetchroom();
        resetForm();
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setImageFile(null);
    setImagePreview("");
    setStatus("Active");
    setIsOpenModal(false);
    setEditId(null);
  };

  const handleEditClick = (room) => {
    setEditId(room._id || room.id);
    setName(room.name);
    setSlug(room.slug);
    setStatus(room.status === true || room.status === "Active" ? "Active" : "Inactive");
    setImagePreview(room.image || "");
    setImageFile(null);
    setIsOpenModal(true);
  };

  const handleDeleteroom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const response = await client.delete(`/api/room/${id}`);
      if (response.data.success) {
        toast.success(response.data.message || "room deleted successfully!");
        fetchroom();
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete room");
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-gray-50/50 min-h-screen p-6 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Room Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage Get, Create, Update, and Delete
          </p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          Add room
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                <th className="py-4 px-6 w-24">IMAGE</th>
                <th className="py-4 px-6">NAME</th>
                <th className="py-4 px-6">SLUG</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right w-20">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    Loading room...
                  </td>
                </tr>
              ) : room.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    No room found.
                  </td>
                </tr>
              ) : (
                room.map((item) => (
                  <tr
                    key={item._id || item.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-4 px-6">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-xl border"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                          <FiImage className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {item.name}
                    </td>
                    <td className="py-4 px-6 text-gray-500">{item.slug}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          (item.status === true || item.status === "Active")
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {(item.status === true || item.status === "Active") ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="text-gray-400 hover:text-teal-600 p-1.5 rounded-lg hover:bg-teal-50 transition"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteroom(item._id || item.id)}
                          className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddroomModal
        isOpen={isOpenModal}
        onClose={resetForm}
        onSubmit={handleAddroom}
        name={name}
        slug={slug}
        status={status}
        imagePreview={imagePreview}
        onNameChange={handleNameChange}
        onSlugChange={setSlug}
        onImageChange={handleImageChange}
        onStatusChange={setStatus}
        isEdit={!!editId}
      />
    </div>
  );
}
