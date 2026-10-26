import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  // No default "Content-Type: application/json": it breaks FormData (file) uploads.
  // Axios sets JSON for plain objects and multipart for FormData automatically.
});

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
