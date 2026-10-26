import client from "./axiosClient";

async function fetchproduct({ queryString = "" } = {}) {
  try {
    // console.log(fetchproduct);
    const url = queryString ? `/api/product?${queryString}` : "/api/product";
    const response = await client.get(url);
    // console.log("product Response:", response.data);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    return {
      message: "Internal Server Error",
      room: [],
      success: false,
    };
  }
}

async function fetchproductById(id) {
  try {
    const response = await client.get(`/api/product/${id}`);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    return {
      message: "Internal Server Error",
      room: {},
      success: false,
    };
  }
}

async function createProduct(formData) {
  try {
    const response = await client.post("/api/product/create", formData);
    return response.data;
  } catch (error) {
    return {
      message: error?.response?.data?.message || "Failed to create product",
      success: false,
    };
  }
}

async function updateProduct(id, formData) {
  try {
    const response = await client.put(`/api/product/update/${id}`, formData);
    return response.data;
  } catch (error) {
    return {
      message: error?.response?.data?.message || "Failed to update product",
      success: false,
    };
  }
}

async function deleteProduct(id) {
  try {
    const response = await client.delete(`/api/product/delete/${id}`);
    return response.data;
  } catch (error) {
    return {
      message: error?.response?.data?.message || "Failed to delete product",
      success: false,
    };
  }
}

async function toggleProductStatus(id) {
  try {
    const response = await client.patch(`/api/product/status/${id}`);
    return response.data;
  } catch (error) {
    return {
      message: error?.response?.data?.message || "Failed to toggle status",
      success: false,
    };
  }
}

async function toggleProductFlag(id, field) {
  try {
    const response = await client.patch(`/api/product/flag/${id}`, { field });
    return response.data;
  } catch (error) {
    return {
      message: error?.response?.data?.message || "Failed to update flag",
      success: false,
    };
  }
}

export {
  fetchproduct,
  fetchproductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  toggleProductFlag,
};
