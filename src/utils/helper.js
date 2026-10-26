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
  // No default "Content-Type: application/json": it breaks FormData (file) uploads.
  // Axios sets JSON for plain objects and multipart for FormData automatically.
});

// Interceptor to attach Authorization header if token exists and handle FormData properly
client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("nestro_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Ensure multipart headers when data is FormData
  if (config.data instanceof FormData && config.headers) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default client;