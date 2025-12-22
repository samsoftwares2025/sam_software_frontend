// src/api/admin/employee.js
import http from "../http";

/**
 * getEmployeeMasterData
 * (Same auth pattern as departments)
 */
export const getEmployeeMasterData = async () => {
  console.log("🔥 getEmployeeMasterData CALLED");

  const userId = localStorage.getItem("userId");

  const { data } = await http.post(
    "/hr/list-employee-master-data/",
    { user_id: userId }
  );

  console.log("🔥 Employee master API response:", data);
  return data;
};

// src/api/admin/employees.js
export const filterEmployeeMasterData = async (payload) => {
  const userId = localStorage.getItem("userId");

  const { data } = await http.post(
    "/hr/filter-employee-master-data/",
    {
      user_id: userId,
      search: payload?.search || "",
      department_name: payload?.department || "",
      status: payload?.status || "",
      page: payload?.page || 1,
      page_size: payload?.page_size || 50,
    }
  );

  return data;
};


/**
 * getEmployeeHistoryData
 */
export const getEmployeeHistoryData = async () => {
  console.log("🔥 getEmployeeHistoryData CALLED");

  const userId = localStorage.getItem("userId");

  const { data } = await http.post(
    "/hr/list-employee-history/",
    { user_id: userId }
  );

  console.log("🔥 Employee history API response:", data);
  return data;
};



export const filterEmployeeHistoryData = async (payload) => {
  const userId = localStorage.getItem("userId");

  const { data } = await http.post(
    "/hr/filter-employee-history/",
    {
      user_id: userId,
      search: payload?.search || "",
      status: payload?.status || "",
      page: payload?.page || 1,
      page_size: payload?.page_size || 50,
    }
  );

  return data;
};






/**
 * getEmployeeDocuments
 */
export const getEmployeeDocuments = async () => {

  const userId = localStorage.getItem("userId");

  const { data } = await http.post(
    "/hr/list-employee-documents/",
    { user_id: userId }
  );

  return data;
};



export const filterEmployeeDocuments = async (payload) => {
  const userId = localStorage.getItem("userId");

  const { data } = await http.post(
    "/hr/filter-employee-documents/",
    {
      user_id: userId,
      search: payload?.search || "",
      status: payload?.status || "",
      page: payload?.page || 1,
      page_size: payload?.page_size || 50,
    }
  );

  return data;
};








/**
 * createEmployee
 */
export const createEmploye = async (formData) => {
  const { data } = await http.post(
    "/hr/add-employee/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};
