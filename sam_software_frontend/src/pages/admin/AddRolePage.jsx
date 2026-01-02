import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import { createRole } from "../../api/admin/roles";
import { useAuth } from "../../context/AuthContext";

function AddRolePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  const [roleName, setRoleName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      setError("Please enter a role name.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // ✅ JUST PASS ROLE NAME
      await createRole(roleName.trim());

      navigate("/admin/roles-permissions", { replace: true });
    } catch (err) {
      console.error("CREATE ROLE FAILED:", err);

      const status = err?.response?.status;
      const respData = err?.response?.data;

      if (status === 401 || status === 403) {
        setError(respData?.detail || "Session expired. Please sign in again.");
        logout();
        navigate("/", { replace: true });
        return;
      }

      setError(
        respData?.detail ||
        respData?.error ||
        "Failed to add role."
      );
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
          <h3>Add Role</h3>
          <p className="subtitle">Create a new user role.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
            {error && (
              <div style={{ color: "red", marginBottom: 10 }}>
                {error}
              </div>
            )}

            <div className="designation-page-form-row">
              <label>Role Name</label>
              <input
                className="designation-page-form-input"
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Add Role"}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/admin/roles-permissions")}
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

export default AddRolePage;
