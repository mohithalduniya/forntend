import client from "./axiosClient";

async function fetchroom() {
  try {
    const response = await client.get("/api/room");
    // console.log("room Response:", response.data);
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

async function fetchroomById(id) {
  try {
    const response = await client.get(`room/${id}`);
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

export { fetchroom, fetchroomById };
