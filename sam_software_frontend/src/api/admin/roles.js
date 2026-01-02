import http from "../http";

/**
 * Helper: get userId safely
 */
const getUserId = () => {
  return localStorage.getItem("userId");
};

/**
 * createRole
 */
export const createRole = async (role) => {
  const userId = getUserId();

  const payload = {
    role,          // ✅ MUST match backend model
    user_id: userId,
  };

  const { data } = await http.post(
    "/users/add-user-roles/",
    payload
  );

  return data;
};

// src/api/admin/roles.js
export const updateRole = async (roleId, role) => {
  const userId = localStorage.getItem("userId");

  const payload = {
    user_role_id: roleId, // ✅ MUST MATCH BACKEND
    role: role,           // ✅ MUST MATCH BACKEND
    user_id: userId,
  };

  const { data } = await http.post(
    "/users/update-user-roles/",
    payload
  );

  return data;
};
// src/api/admin/roles.js


// src/api/admin/roles.js
export const deleteUserRole = async (roleId) => {
  const userId = localStorage.getItem("userId");

  const { data } = await http.post("/users/delete-user-roles/", {
    user_id: userId,
    user_role_id: roleId, // ✅ MUST MATCH BACKEND
  });

  return data;
};




/**
 * getRoles
 */
export const getUserRoles = async () => {

  const userId = getUserId();

  const { data } = await http.post(
    "/users/list-user-roles/",
    { user_id: userId }
  );

  return data;
};
