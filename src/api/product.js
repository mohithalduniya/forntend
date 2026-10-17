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

export { fetchproduct, fetchproductById };
