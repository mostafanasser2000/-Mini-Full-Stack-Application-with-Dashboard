import axiosInstance from "../api/axiosConfig";

export const getMedications = async (filters = {}) => {
  try {
    const response = await axiosInstance.get(`medications/`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createMedication = async (medicationData) => {
  try {
    const response = await axiosInstance.post("medications/", medicationData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMedicationDetails = async (slug) => {
  try {
    const response = await axiosInstance.get(`medications/${slug}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMedication = async (slug, medicationData) => {
  try {
    const response = await axiosInstance.patch(
      `medications/${slug}/`,
      medicationData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMedication = async (slug) => {
  try {
    await axiosInstance.delete(`medications/${slug}/`);
  } catch (error) {
    throw error;
  }
};
