// src/pages/admin/UpdateDepartmentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";
import { getDepartments as apiGetDepartments, updateDepartment } from "../../api/admin/departments";

function UpdateDepartmentPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const deptId = params.get("id");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");

  useEffect(() => {
    if (!deptId) {
      setError("No department id provided.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    // We don't have a dedicated GET /department/:id endpoint,
    // so fetch the list and find the department locally.
    apiGetDepartments()
      .then((resp) => {
        if (!mounted) return;
        // backend returns { success: true, departments: [...] }
        let list = [];
        if (resp && Array.isArray(resp.departments)) list = resp.departments;
        else if (Array.isArray(resp)) list = resp;
        else if (Array.isArray(resp.results)) list = resp.results;
        else if (Array.isArray(resp.data)) list = resp.data;
        else if (resp && typeof resp === "object") list = resp.departments || resp.results || resp.data || [];

        const found = list.find((d) => String(d.id) === String(deptId));
        if (!found) {
          setError("Department not found.");
        } else {
          setName(found.name || "");
          setOriginalName(found.name || "");
        }
      })
      .catch((err) => {
        console.error("Failed to load department for edit:", err);
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.response?.data?.detail || (status ? `Failed to load (status ${status})` : "Failed to load department");
        setError(msg);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [deptId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = (name || "").trim();
    if (!trimmed) {
      setError("Department name is required.");
      return;
    }
    // If nothing changed, just navigate back
    if (trimmed === (originalName || "").trim()) {
      navigate("/admin/departments", { replace: true });
      return;
    }

    setSaving(true);
    try {
      const resp = await updateDepartment(deptId, trimmed);
      // Resp handling: backend should return success flag; adapt as needed
      if (resp && (resp.success === false || resp.success === "false")) {
        const msg = resp.message || resp.detail || "Failed to update department.";
        setError(msg);
        setSaving(false);
        return;
      }

      // success: go back to listing
      navigate("/admin/departments", { replace: true });
    } catch (err) {
      console.error("Update failed:", err);
      const status = err?.response?.status;
      const respData = err?.response?.data;
      const message =
        respData?.message ||
        respData?.detail ||
        (status ? `Failed to update (status ${status})` : "Failed to update department.");
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
          <h3>Edit Department</h3>
          <p className="subtitle">Update department name.</p>
        </div>

        <div className="card" >
          {loading ? (
            <div>Loading department details...</div>
          ) : error ? (
            <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="designation-page-form-row">
                <label>Current Name</label>
                <div style={{ marginTop: 6, marginBottom: 12 }}>
                  <input
                    className="designation-page-form-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Department name"
                    autoFocus
                  />
                </div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  Original: <strong>{originalName}</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
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
          )}
        </div>
      </main>

      <div className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} onClick={() => setIsSidebarOpen(false)} />
    </div>
  );
}

export default UpdateDepartmentPage;
