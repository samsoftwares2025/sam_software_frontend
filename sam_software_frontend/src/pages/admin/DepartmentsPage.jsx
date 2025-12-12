// src/pages/admin/DepartmentsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";
import { getDepartments as apiGetDepartments } from "../../api/admin/departments";

/**
 * DepartmentsPage (API-only)
 * - Loads departments from API /companies/list-departments/ (POST with user_id)
 * - No static defaults, no localStorage usage for initial data
 */

function DepartmentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("organization");

  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]); // empty initial list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await apiGetDepartments();

      // Backend returns { success: true, departments: [...] }
      let list = [];
      if (resp && Array.isArray(resp.departments)) {
        list = resp.departments;
      } else if (Array.isArray(resp)) {
        // fallback if backend ever returns direct array
        list = resp;
      } else if (Array.isArray(resp.results)) {
        list = resp.results;
      } else if (Array.isArray(resp.data)) {
        list = resp.data;
      } else if (resp && typeof resp === "object") {
        list = resp.departments || resp.results || resp.items || resp.data || [];
      }

      if (!Array.isArray(list)) list = [];
      setDepartments(list);
    } catch (err) {
      console.error("Failed to load departments from API:", err);
      const status = err?.response?.status;
      const respData = err?.response?.data;
      const message =
        respData?.message ||
        respData?.detail ||
        (status ? `Unable to load departments (status ${status})` : "Unable to load departments from server.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMenuClick = () => setIsSidebarOpen((prev) => !prev);
  const handleOverlayClick = () => setIsSidebarOpen(false);

  const filteredDepartments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return departments;
    return departments.filter((row) => (row.name || "").toLowerCase().includes(term));
  }, [searchTerm, departments]);

  const totalCount = departments.length;
  const visibleCount = filteredDepartments.length;

  return (
    <div className="container">
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        openSection={openSection}
        setOpenSection={setOpenSection}
      />

      <main className="main">
        <Header onMenuClick={handleMenuClick} />

        <div className="the_line" />

        <div className="page-title">
          <h3>Departments</h3>
          <p className="subtitle">Manage company departments easily.</p>
        </div>

        <div className="filters-container">
          <div className="filters-left">
            <div className="search-input">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                placeholder="Search by department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading && <div style={{ marginLeft: 12, fontSize: 13 }}>Loading...</div>}
            {error && (
              <div style={{ marginLeft: 12, fontSize: 13, color: "orange" }}>{error}</div>
            )}
          </div>

          <div className="filters-right" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="btn"
              onClick={() => fetchDepartments()}
              disabled={loading}
              title="Refresh departments"
            >
              <i className="fa-solid fa-rotate" /> Refresh
            </button>

            <button
              className="btn btn-primary"
              id="addDeptBtn"
              onClick={() => (window.location.href = "/admin/add-department")}
            >
              <i className="fa-solid fa-plus" />
              Add Department
            </button>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header-bar">
            <h4>
              Departments <span className="badge-pill">Total: {visibleCount}</span>
            </h4>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table" id="deptTable">
              <thead>
  <tr>
    <th style={{ width: "80px" }}>Order No</th>
    <th>Department</th>
    <th>Actions</th>
  </tr>
</thead>


              <tbody>
  {filteredDepartments.map((row, index) => (
    <tr key={row.id}>
      <td style={{ textAlign: "center" }}>{index + 1}</td>
      <td>
        <div className="emp-name">{row.name}</div>
      </td>

      <td>
        <div className="table-actions">
          <button
            className="icon-btn view"
            title="View Details"
            onClick={() =>
              (window.location.href = `/admin/update-department?id=${row.id}&mode=view`)
            }
          >
            <i className="fa-solid fa-eye" />
          </button>

          <button
            className="icon-btn edit"
            title="Edit Department"
            onClick={() =>
              (window.location.href = `/admin/update-department?id=${row.id}`)
            }
          >
            <i className="fa-solid fa-pen" />
          </button>

          <button
            className="icon-btn delete"
            title="Delete Department"
            onClick={() => {
              const confirmDelete = window.confirm(
                `Delete department "${row.name}"? This action cannot be undone.`
              );
              if (!confirmDelete) return;

              const remaining = departments.filter((d) => d.id !== row.id);
              setDepartments(remaining);
            }}
          >
            <i className="fa-solid fa-trash" />
          </button>
        </div>
      </td>
    </tr>
  ))}

  {visibleCount === 0 && (
    <tr>
      <td colSpan={3} style={{ textAlign: "center", padding: "1.5rem" }}>
        {loading ? "Loading departments..." : "No departments found."}
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>

          <div className="table-footer">
            <div>
              Showing {visibleCount} of {totalCount} departments
            </div>
          </div>
        </div>
      </main>

      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={handleOverlayClick}
      />
    </div>
  );
}

export default DepartmentsPage;
