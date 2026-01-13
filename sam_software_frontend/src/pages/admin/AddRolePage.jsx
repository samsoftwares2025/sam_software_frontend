import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import { createRole } from "../../api/admin/roles";
import { useAuth } from "../../context/AuthContext";

/* ================= SUCCESS MODAL ================= */
const SuccessModal = ({ onOk }) => (
  <div className="modal-overlay">
    <div className="modal-card">
      <div className="success-icon">
        <i className="fa-solid fa-circle-check"></i>
      </div>
      <h2>Role Added Successfully</h2>
      <p>The role has been added to the system.</p>
      <button className="btn btn-primary" onClick={onOk}>
        OK
      </button>
    </div>
  </div>
);

function AddRolePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("organization");

  const [roleName, setRoleName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  /* ================= PERMISSION MODULES ================= */
  const modules = [
    "Employee",
    "Department",
    "Designation",
    "Employment Type",
    "Roles & Permissions",
    "Policies",
    "Company Rules",
    "Supporting Tickets"
  ];

  const permissionTypes = ["view", "add", "update", "delete"];

  const initialPermissionState = modules.reduce((acc, module) => {
    acc[module] = { view: false, add: false, update: false, delete: false };
    return acc;
  }, {});

  const [permissions, setPermissions] = useState(initialPermissionState);

  /* Toggle single checkbox */
  const handlePermissionChange = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action]
      }
    }));
  };

  /* COLUMN: Tick All */
  const toggleColumn = (action) => {
    const allChecked = modules.every((m) => permissions[m][action]);
    const updated = modules.reduce((acc, m) => {
      acc[m] = { ...permissions[m], [action]: !allChecked };
      return acc;
    }, {});
    setPermissions(updated);
  };

  const isColumnChecked = (action) =>
    modules.every((m) => permissions[m][action] === true);

  /* GLOBAL: Tick All */
  const tickAllPermissions = () => {
    const updated = modules.reduce((acc, m) => {
      acc[m] = { view: true, add: true, update: true, delete: true };
      return acc;
    }, {});
    setPermissions(updated);
  };

  const unTickAllPermissions = () => setPermissions(initialPermissionState);

  const isAllChecked = modules.every(
    (m) =>
      permissions[m].view &&
      permissions[m].add &&
      permissions[m].update &&
      permissions[m].delete
  );

  /* ================= SUBMIT FORM ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      setError("Please enter a role name.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createRole({
        roleName: roleName.trim(),
        permissions
      });

      setShowSuccessModal(true);
    } catch (err) {
      const status = err?.response?.status;
      const resp = err?.response?.data;

      if (status === 401 || status === 403) {
        logout();
        navigate("/", { replace: true });
        return;
      }

      setError(resp?.message || resp?.detail || "Failed to add role.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="container">
        <Sidebar
          isMobileOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          openSection={openSection}
          setOpenSection={setOpenSection}
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
                <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
              )}

              {/* ROLE NAME */}
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

              {/* PERMISSIONS TITLE */}
              <h4 style={{ marginTop: 20 }}>Permissions</h4>

              {/* GLOBAL TICK ALL */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ fontWeight: "600" }}>
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={(e) =>
                      e.target.checked
                        ? tickAllPermissions()
                        : unTickAllPermissions()
                    }
                    style={{ marginRight: 8 }}
                  />
                  Tick All Permissions
                </label>
              </div>

              {/* COLUMN TICK ALL */}
              <div className="permission-grid permission-grid-header">
                <div></div> {/* empty placeholder */}

                {permissionTypes.map((action) => (
                  <label key={action}>
                    <input
                      type="checkbox"
                      checked={isColumnChecked(action)}
                      onChange={() => toggleColumn(action)}
                    />
                    {action.charAt(0).toUpperCase() + action.slice(1)} (All)
                  </label>
                ))}
              </div>

              {/* MODULE ROWS */}
              {modules.map((module) => (
                <div key={module} className="permission-grid">
                  <strong>{module}</strong>

                  {permissionTypes.map((action) => (
                    <label key={action}>
                      <input
                        type="checkbox"
                        checked={permissions[module][action]}
                        onChange={() =>
                          handlePermissionChange(module, action)
                        }
                      />
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </label>
                  ))}
                </div>
              ))}

              {/* BUTTONS */}
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button type="submit" className="btn btn-primary">
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
      </div>

      {showSuccessModal && (
        <SuccessModal
          onOk={() => navigate("/admin/roles-permissions")}
        />
      )}
    </>
  );
}

export default AddRolePage;
