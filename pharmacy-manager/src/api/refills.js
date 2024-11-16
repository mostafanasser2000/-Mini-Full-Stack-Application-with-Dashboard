import axiosInstance from "../api/axiosConfig";

export const getRefillRequests = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("refill-requests/", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRefillRequest = async (refillData) => {
  try {
    const response = await axiosInstance.post("refill-requests/", refillData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRefillRequestDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`refill-requests/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRefillRequest = async (id, refillData) => {
  try {
    const response = await axiosInstance.put(
      `refill-requests/${id}/`,
      refillData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveRefillRequest = async (id) => {
  try {
    const response = await axiosInstance.post(`refill-requests/${id}/approve/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectRefillRequest = async (id) => {
  try {
    const response = await axiosInstance.post(`refill-requests/${id}/reject/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelRefillRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`refill-requests/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRefillRequest = async (id) => {
  try {
    await axiosInstance.delete(`refill-requests/${id}/`);
  } catch (error) {
    throw error;
  }
};
