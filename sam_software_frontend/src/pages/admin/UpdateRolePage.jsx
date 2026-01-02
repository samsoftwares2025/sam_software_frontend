import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import { getUserRoles, updateRole } from "../../api/admin/roles";
import { useAuth } from "../../context/AuthContext";

function UpdateRolePage() {
  /* ================= ROUTER ================= */
  const { roleId } = useParams();
  const navigate = useNavigate();

  /* ================= SIDEBAR ================= */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  /* ================= FORM STATE ================= */
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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

    if (!roleName.trim()) {
      setError("Please enter a role name.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateRole(roleId, roleName.trim());

      navigate("/admin/roles-permissions", { replace: true });
    } catch (err) {
      console.error("UPDATE ROLE FAILED:", err);

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
        "Failed to update role."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= RENDER ================= */
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
                  onClick={() =>
                    navigate("/admin/roles-permissions")
                  }
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

export default UpdateRolePage;
