import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import { getUserRoles, updateRole } from "../../api/admin/roles";
import { useAuth } from "../../context/AuthContext";

/* ================= SUCCESS MODAL ================= */
const SuccessModal = ({ onOk }) => (
  <div className="modal-overlay">
    <div className="modal-card">
      <div className="success-icon">
        <i className="fa-solid fa-circle-check"></i>
      </div>
      <h2>Role Updated</h2>
      <p>The user role has been updated successfully.</p>
      <button className="btn btn-primary" onClick={onOk}>
        OK
      </button>
    </div>
  </div>
);

function UpdateRolePage() {
  /* ================= ROUTER ================= */
  const { roleId } = useParams();
  const navigate = useNavigate();

  /* ================= SIDEBAR ================= */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  /* ================= FORM STATE ================= */
  const [roleName, setRoleName] = useState("");
  const [originalRoleName, setOriginalRoleName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* ================= SUCCESS MODAL ================= */
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { logout } = useAuth();

  /* ================= LOAD ROLE ================= */
  useEffect(() => {
    const loadRole = async () => {
      try {
        const res = await getUserRoles();

        if (res?.success) {
          const role = res.user_roles.find(
            (r) => String(r.id) === String(roleId)
          );

          if (!role) {
            setError("Role not found");
            return;
          }

          setRoleName(role.role);
          setOriginalRoleName(role.role);
        } else {
          setError("Failed to load role");
        }
      } catch (err) {
        console.error("LOAD ROLE FAILED:", err);
        setError("Failed to load role");
      } finally {
        setLoading(false);
      }
    };

    if (roleId) loadRole();
  }, [roleId]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = roleName.trim();
    if (!trimmed) {
      setError("Please enter a role name.");
      return;
    }

    // If unchanged
    if (trimmed === originalRoleName.trim()) {
      navigate("/admin/roles-permissions", { replace: true });
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const resp = await updateRole(roleId, trimmed);

      // Backend explicit failure (including duplicate)
      if (resp?.success === false) {
        setError(resp.message || "Failed to update role.");
        setSaving(false);
        return;
      }

      // SUCCESS → show modal
      setShowSuccessModal(true);
    } catch (err) {
      console.error("UPDATE ROLE FAILED:", err);

      const status = err?.response?.status;
      const data = err?.response?.data;

      // SESSION EXPIRED / NOT AUTHORIZED
      if (status === 401 || status === 403) {
        setError(data?.detail || "Session expired. Please sign in again.");
        logout();
        navigate("/", { replace: true });
        return;
      }

      // BACKEND DUPLICATE CASE — SHOW EXACT MESSAGE
      if (data?.message) {
        setError(data.message);
      } else {
        setError("Failed to update role.");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <>
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
            <h3>Update Role</h3>
            <p className="subtitle">Modify existing user role.</p>
          </div>

          <div className="card">
            {loading ? (
              <div style={{ padding: "1.25rem" }}>Loading role...</div>
            ) : (
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
                    {saving ? "Updating..." : "Update Role"}
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
            )}
          </div>
        </main>

        <div
          className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <SuccessModal onOk={() => navigate("/admin/roles-permissions")} />
      )}
    </>
  );
}

export default UpdateRolePage;
