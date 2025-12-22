// src/pages/admin/AddEmploymentTypePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";
import {
  createEmployementType as createEmploymentType,
} from "../../api/admin/employement_type";

function AddEmploymentTypePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter an employment type name.");
      return;
    }

    setError(null);
    setSaving(true);

    try {
      console.log("SENDING CREATE EMPLOYMENT TYPE REQUEST:", {
        name: trimmed,
      });

      await createEmploymentType(trimmed);

      // ✅ Success → go to list page
      navigate("/admin/employment-type", { replace: true });
    } catch (err) {
      console.error("CREATE EMPLOYMENT TYPE FAILED:", err);

      let message = "Failed to add employment type.";
      const status = err?.response?.status;
      const respData = err?.response?.data;

      if (status === 401 || status === 403) {
        message =
          respData?.detail || "Session expired. Please sign in again.";
      } else if (err.response) {
        message =
          respData?.detail ||
          respData?.error ||
          (Array.isArray(respData?.non_field_errors) &&
            respData.non_field_errors[0]) ||
          "Failed to add employment type. Please check your input.";
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
          <h3>Add Employment Type</h3>
          <p className="subtitle">Create a new employment type.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
            {error && (
              <div style={{ color: "red", marginBottom: "10px" }}>
                {error}
              </div>
            )}

            <div className="designation-page-form-row">
              <label>Employment Type Name</label>
              <input
                className="designation-page-form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Full Time"
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
                {saving ? "Saving..." : "Add Employment Type"}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/admin/employment-type")}
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

export default AddEmploymentTypePage;
