import axios from "axios";

export const slugify = (text = "") => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  timeout: 10000,
  withCredentials: true,
  // NOTE: do not set a default "Content-Type: application/json" here.
  // It makes axios turn FormData into JSON (files become {}), which breaks image uploads.
  // Axios already sends plain objects as JSON and FormData as multipart on its own.
});

// Interceptor to attach Authorization header if token exists
client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("nestro_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default client;