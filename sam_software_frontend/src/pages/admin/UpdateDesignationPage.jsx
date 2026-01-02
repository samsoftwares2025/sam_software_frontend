import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import {
  getDesignations as apiGetDesignations,
  updateDesignation,
} from "../../api/admin/designations";
import { getDepartments } from "../../api/admin/departments";

/**
 * Safely extract designation name
 */
const extractDesignationName = (value) => {
  if (!value) return "";

  if (typeof value === "string" && !value.trim().startsWith("{")) {
    return value;
  }

  try {
    const fixedJson = value.replace(/'/g, '"');
    const parsed = JSON.parse(fixedJson);
    return parsed?.name || "";
  } catch {
    return value;
  }
};

function UpdateDesignationPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const desgId = params.get("id");

  // ===============================
  // Layout
  // ===============================
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  // ===============================
  // Form State
  // ===============================
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // ===============================
  // Load Departments
  // ===============================
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments();
        const list = Array.isArray(res)
          ? res
          : res?.departments || [];
        setDepartments(list);
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
  // Load Designation
  // ===============================
  useEffect(() => {
    if (!desgId) {
      setError("No designation id provided.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    apiGetDesignations()
      .then((resp) => {
        if (!mounted) return;

        let list = [];
        if (Array.isArray(resp)) list = resp;
        else if (Array.isArray(resp.designations)) list = resp.designations;
        else if (Array.isArray(resp.results)) list = resp.results;
        else if (Array.isArray(resp.data)) list = resp.data;

        const found = list.find(
          (d) => String(d.id) === String(desgId)
        );

        if (!found) {
          setError("Designation not found.");
        } else {
          const cleanName = extractDesignationName(found.name);
          setName(cleanName);
          setOriginalName(cleanName);
          setDepartmentId(found.department_id || "");
        }
      })
      .catch((err) => {
        console.error("Failed to load designation:", err);
        setError("Failed to load designation details.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [desgId]);

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();

    if (!trimmed) {
      setError("Designation name is required.");
      return;
    }

    if (!departmentId) {
      setError("Please select a department.");
      return;
    }

    setSaving(true);
    try {
await updateDesignation(
  desgId,
  trimmed,
  departmentId
);


      navigate("/admin/designations", { replace: true });
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update designation.");
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
          <h3>Update Designation</h3>
          <p className="subtitle">Update designation details.</p>
        </div>

        <div className="card">
          {loading ? (
            <div style={{ padding: "1.25rem" }}>
              Loading designation details...
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
              {error && (
                <div style={{ color: "red", marginBottom: 10 }}>
                  {error}
                </div>
              )}

              {/* Department */}
              <div className="designation-page-form-row">
                <label>Department</label>
                <select
                  className="designation-page-form-input"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  disabled={loadingDepts}
                >
                  <option value="">
                    {loadingDepts
                      ? "Loading departments..."
                      : "Select Department"}
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
                  {saving ? "Saving..." : "Save Changes"}
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
          )}
        </div>
      </main>

      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}

export default UpdateDesignationPage;
