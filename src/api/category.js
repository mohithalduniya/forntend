import client from "./axiosClient";

async function fetchCategory(params = {}) {
  try {
    let queryString = "";
    if (typeof params === "string") {
      queryString = params;
    } else if (typeof params === "object" && Object.keys(params).length > 0) {
      queryString = new URLSearchParams(params).toString();
    }

    const url = queryString ? `/api/category?${queryString}` : "/api/category";
    const response = await client.get(url);
    
    // console.log("Category Response:", response.data);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    return {
      message: "Internal Server Error",
      category: [],
      success: false,
    };
  }
}

async function fetchCategoryById(id) {
  try {
    const response = await client.get(`category/${id}`);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    return {
      message: "Internal Server Error",
      category: {},
      success: false,
    };
  }
}

export { fetchCategory, fetchCategoryById };
