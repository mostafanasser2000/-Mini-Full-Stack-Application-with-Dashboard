import axiosInstance from "../api/axiosConfig";

export const getCategories = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("categories", { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post("categories", categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryDetails = async (slug) => {
  try {
    const response = await axiosInstance.get(`categories/${slug}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (slug, categoryData) => {
  try {
    const response = await axiosInstance.put(
      `categories/${slug}/`,
      categoryData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (slug) => {
  try {
    await axiosInstance.delete(`${slug}/`);
  } catch (error) {
    throw error;
  }
};

export const getMedicationForms = async () => {
  try {
    const response = await axiosInstance.get("medication-forms/");
    return response.data;
  } catch (error) {
    throw error;
  }
};
