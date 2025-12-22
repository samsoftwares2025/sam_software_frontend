// src/pages/admin/AddDesignationPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import { createDesignation } from "../../api/admin/designations";
import { getDepartments } from "../../api/admin/departments";

function AddDesignationPage() {
  const navigate = useNavigate();

  // ===============================
  // Layout State
  // ===============================
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  // ===============================
  // Form State
  // ===============================
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState(null);


  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // ===============================
  // Fetch Departments
  // ===============================
  useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();

      console.log("DEPARTMENTS RESPONSE:", res);

      const deptArray =
        Array.isArray(res)
          ? res
          : res?.departments
          ? res.departments
          : [];

      setDepartments(deptArray);
    } catch (err) {
      console.error("Failed to load departments", err);
      setError("Failed to load departments.");
    } finally {
      setLoadingDepts(false);
    }
  };

  fetchDepartments();
}, []);

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      setError("Please enter a designation name.");
      return;
    }

if (!departmentId) {
  setError("Please select a department.");
  return;
}


    setError(null);
    setSaving(true);

    try {
      console.log("CREATE DESIGNATION:", {
        name: trimmed,
        department_id: departmentId,
      });

      await createDesignation({
        name: trimmed,
        department_id: departmentId,
      });

      // ✅ success → go to list
      navigate("/admin/designations", { replace: true });
    } catch (err) {
      console.error("CREATE DESIGNATION FAILED:", err);

      let message = "Failed to add designation.";

      const status = err?.response?.status;
      const respData = err?.response?.data;

      if (status === 401 || status === 403) {
        message = respData?.detail || "Session expired. Please sign in again.";
      } else if (err.response) {
        message =
          respData?.detail ||
          respData?.error ||
          (Array.isArray(respData?.non_field_errors) &&
            respData.non_field_errors[0]) ||
          "Failed to add designation. Please check your input.";
      } else if (err.request) {
        message = "No response from server. Check if backend is running.";
      } else {
        message = err.message || message;
      }

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // Render
  // ===============================
  return (
    <div className="container">
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        openSection={openSection}
        setOpenSection={() => {}}
      />

      <main className="main">
        <Header onMenuClick={() => setIsSidebarOpen((p) => !p)} />
        <div className="the_line" />

        <div className="page-title">
          <h3>Add Designation</h3>
          <p className="subtitle">Create a new designation.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
            {error && (
              <div style={{ color: "red", marginBottom: "10px" }}>
                {error}
              </div>
            )}

            {/* Department */}
            <div className="designation-page-form-row">
              <label>Department</label>
             <select
  className="designation-page-form-input"
  value={departmentId ?? ""}
  onChange={(e) => {
    const value = e.target.value;
    setDepartmentId(value === "" ? null : Number(value));
  }}
  disabled={loadingDepts}
>

                <option value="">
                  {loadingDepts ? "Loading departments..." : "Select Department"}
                </option>

                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation Name */}
            <div className="designation-page-form-row">
              <label>Designation Name</label>
              <input
                className="designation-page-form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Manager"
              />
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "0.75rem",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Add Designation"}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/admin/designations")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}

export default AddDesignationPage;
