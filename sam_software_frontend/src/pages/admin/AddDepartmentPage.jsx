// src/pages/admin/AddDepartmentPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";
import { createDepartment } from "../../api/admin/departments";

function AddDepartmentPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleUnauthorized = () => {
    // clear auth client-side
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    // navigate to login
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      alert("Please enter a department name.");
      return;
    }

    // DEBUG: show token before request
    console.log("DEBUG token before create:", localStorage.getItem("authToken"));

    // Ensure we have a token locally before attempting create
    const token = localStorage.getItem("authToken");
    if (!token) {
      // not logged in — redirect to login page
      navigate("/", { replace: true });
      return;
    }

    setError(null);
    setSaving(true);

    try {
      console.log("SENDING CREATE DEPARTMENT REQUEST:", { name: trimmed });

      const data = await createDepartment(trimmed);

      console.log("CREATE DEPARTMENT SUCCESS:", data);

      // On success, navigate to department list
      navigate("/admin/departments", { replace: true });
    } catch (err) {
      console.error("CREATE DEPARTMENT FAILED:", err);

      let message = "Failed to add department.";

      const status = err?.response?.status;
      const respData = err?.response?.data;

      if (status === 401 || status === 403) {
        // token invalid/expired or permission denied
        message = respData?.detail || "Session expired. Please sign in again.";
        setError(message);
        // TEMPORARILY disabled redirect so we can inspect server error:
        // handleUnauthorized();
        return;
      }

      if (err.response) {
        console.log("ERROR RESPONSE DATA:", respData);
        message =
          respData?.detail ||
          respData?.error ||
          (Array.isArray(respData?.non_field_errors) && respData.non_field_errors[0]) ||
          "Failed to add department. Please check your input.";
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
          <h3>Add Department</h3>
          <p className="subtitle">Create a new department.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
            {error && (
              <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
            )}

            <div className="form-row">
              <label>Department Name</label>
              <input
                className="form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marketing"
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
                {saving ? "Saving..." : "Add Department"}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/admin/departments")}
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

export default AddDepartmentPage;
