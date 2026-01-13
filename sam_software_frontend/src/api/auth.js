// src/api/auth.js
import http from "./http";
import { setAuth } from "./http";

/* ================= LOGIN ================= */
export const loginUser = async (email, password) => {
  const response = await http.post("/users/login/", {
    email,
    password,
  });

  const data = response.data;

  // 🔑 Extract token safely from multiple backend formats
  const accessToken =
    data.access ||
    data.token ||
    data.access_token ||
    data.authToken ||
    data.authentication?.access;

  if (!accessToken) {
    throw new Error("Login succeeded but no access token returned.");
  }

  // 👤 Extract user ID
  const userId =
    data.user?.id ||
    data.user_id ||
    data.id;

  if (!userId) {
    throw new Error("Login succeeded but no user ID returned.");
  }

  /* ================= STORE AUTH ================= */
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("userId", String(userId));

  if (data.name || data.user?.name) {
    localStorage.setItem("userName", data.name || data.user?.name);
  }

  // ✅ Set axios default Authorization header
  setAuth({ token: accessToken });

  return data;
};

/* ================= LOGOUT ================= */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    await http.post(
      "/users/logout/",
      {},   // empty body OK
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("Logout API error:", err);
  } finally {
    // clear storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setAuth({ token: null });
  }
};

