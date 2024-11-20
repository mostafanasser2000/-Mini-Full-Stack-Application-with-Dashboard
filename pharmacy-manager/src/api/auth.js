import axiosInstance from "../api/axiosConfig";

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../utils/tokenUtils";

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post("accounts/login/", {
      email,
      password,
    });
    setTokens(response.data.access, response.data.refresh);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const register = async (email, password1, password2) => {
  try {
    const response = await axiosInstance({
      url: "accounts/registration/",
      data: { email, password1, password2 },
      method: "post",
    });
    setTokens(response.data.access, response.data.refresh);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post("accounts/logout/", {
      refresh: getRefreshToken(),
    });
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const response = await axiosInstance.post("accounts/token/refresh/", {
      refresh: refreshToken,
    });
    setTokens(response.data.access, response.data.refresh);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await axiosInstance.get("accounts/user/");
    return response.data;
  } catch (error) {
    throw error;
  }
};
