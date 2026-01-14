// src/api/auth.js
import http from "./http";
import { setAuth } from "./http";

/* ================= LOGIN ================= */
export const loginUser = async (email, password) => {
  const response = await http.post("/users/login/", { email, password });
  const data = response.data;

  // Extract token
  const accessToken =
    data.access ||
    data.token ||
    data.access_token ||
    data.authToken ||
    data.authentication?.access;

  if (!accessToken) throw new Error("Login succeeded but no access token returned.");

  // Extract user ID
  const userId = data.user?.id || data.user_id || data.id;
  if (!userId) throw new Error("Login succeeded but no user ID returned.");

  /* ================= STORE BASIC AUTH ================= */
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("userId", String(userId));

  if (data.name || data.user?.name)
    localStorage.setItem("userName", data.name || data.user?.name);

  /* ================= STORE ROLE ID ================= */
  localStorage.setItem("user_role_id", data.user_role_id || "");

  /* ================= STORE CLIENT ADMIN FLAG ================= */
  localStorage.setItem("is_client_admin", data.is_client_admin ? "true" : "false");

  /* ================= STORE PERMISSIONS ================= */
  const rawPermissions =
    data.permissions ||
    data.user?.permissions ||
    data.user_permissions ||
    data.role_permissions ||
    [];

  const permissionMap = {};

  rawPermissions.forEach((p) => {
    const moduleName =
      p.module_name || p.module || p.name || p.moduleName;

    if (!moduleName) return;

    const cleanName = moduleName.trim().toLowerCase();

    permissionMap[cleanName] = {
      view: p.can_view ?? p.view ?? false,
      add: p.can_add ?? p.add ?? false,
      update: p.can_update ?? p.update ?? false,
      delete: p.can_delete ?? p.delete ?? false,
    };
  });

  localStorage.setItem("permissions", JSON.stringify(permissionMap));

  // Set axios auth header
  setAuth({ token: accessToken });

  return {
    ...data,
    permissions: permissionMap,
  };
};

/* ================= LOGOUT ================= */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    await http.post(
      "/users/logout/",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Logout API error:", err);
  } finally {
    // Clear everything
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("permissions");
    localStorage.removeItem("user_role_id");
    localStorage.removeItem("is_client_admin");

    setAuth({ token: null });
  }
};
