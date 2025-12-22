// src/api/auth.js
import http from "./http";
import { setAuth } from "./http";

export const loginUser = async (email, password) => {
  const response = await http.post("/users/login/", {
    email,
    password,
  });

  const data = response.data;

  const accessToken =
    data.access ||
    data.token ||
    data.access_token ||
    data.authToken ||
    data.authentication?.access;

  const user = data.user || data;

  if (!accessToken) {
    throw new Error("Login succeeded but no access token returned.");
  }

  // ✅ STORE BOTH TOKEN AND USER ID
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem(
    "userId",
    user?.id || data.user_id || data.id
  );

  // ✅ SET AXIOS AUTH HEADER
  setAuth({ token: accessToken });

  return data;
};
