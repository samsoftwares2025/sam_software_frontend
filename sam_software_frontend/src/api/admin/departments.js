// src/api/admin/departments.js
import http from "../http";

/**
 * createDepartment
 * - Ensures Authorization header is attached (http interceptor already does this)
 * - Sends user_id in the payload because backend requires it
 */
export const createDepartment = async (name) => {
  try {
    const token = localStorage.getItem("authToken");
    if (token && !http.defaults.headers.common?.Authorization) {
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
      console.log("[createDepartment] attached token from localStorage (fallback)");
    }
  } catch (e) {
    console.warn("createDepartment: could not read token from localStorage", e);
  }

  const userId = localStorage.getItem("userId");
  const payload = {
    name,
    user_id: userId,
  };

  try {
    const { data } = await http.post("/companies/add-department/", payload);
    console.log("createDepartment response data:", data);
    return data;
  } catch (err) {
    console.error("createDepartment axios error:", err);
    console.error("createDepartment error.response:", err?.response);
    throw err;
  }
};

/**
 * getDepartments
 * - Calls backend POST /companies/list-departments/ (backend expects POST with user_id)
 * - Returns the response data object (which contains .departments)
 */
export const getDepartments = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (token && !http.defaults.headers.common?.Authorization) {
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    throw new Error("Missing userId in localStorage");
  }

  // POST because backend view expects POST with user_id in body
  const { data } = await http.post("/companies/list-departments/", { user_id: userId });
  // the backend returns: { success: True, departments: [ ... ] }
  return data;
};






// updateDepartment(id, name)
// - Sends an update request to backend. Adjust endpoint or payload shape if backend differs.
export const updateDepartment = async (departmentId, name) => {
  try {
    const token = localStorage.getItem("authToken");
    if (token && !http.defaults.headers.common?.Authorization) {
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    throw new Error("Missing userId in localStorage");
  }

  // Backend payload: adjust keys if your backend expects different names.
  const payload = {
    department_id: departmentId,
    name,
    user_id: userId,
  };

  try {
    // IMPORTANT: adapt this endpoint if your backend exposes a different one.
    const { data } = await http.post("/companies/update-department/", payload);
    return data;
  } catch (err) {
    console.error("[updateDepartment] error:", err);
    throw err;
  }
};
