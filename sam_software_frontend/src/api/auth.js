// src/api/auth.js
import http from "./http";            // <-- use shared axios instance
import { setAuth } from "./http";
import { FULL_BASE } from "./config";

/**
 * loginUser
 * Calls backend login endpoint, sets auth, and returns response data
 * Adjust the URL if your backend uses a different login path.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await http.post(
      `/users/login/`,                // http already uses FULL_BASE as baseURL
      { email, password }
    );

    const data = response.data;

    // Extract token shapes commonly returned by backends
    const accessToken =
      data.access ||
      data.token ||
      data.access_token ||
      data.authToken ||
      data.authentication?.access;

    const refreshToken =
      data.refresh ||
      data.refresh_token ||
      data.refreshToken ||
      null;

    const user = data.user || data;

    if (!accessToken) {
      console.error("Login response did not contain an access token:", data);
      throw new Error("Login succeeded but no access token returned.");
    }

    // Configure axios instance globally + store token & user details
    setAuth({
      token: accessToken,
      role: user?.role || data.role || null,
      userId: user?.id || data.user_id || data.id || null,
    });

    // Store refresh token if provided
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    // Store authentication flag
    localStorage.setItem("isAuthenticated", "true");

    return data;
  } catch (error) {
    console.error("loginUser error:", error);
    throw error;
  }
};
