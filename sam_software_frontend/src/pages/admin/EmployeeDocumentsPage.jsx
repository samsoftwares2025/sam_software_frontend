// src/pages/admin/EmployeeDocumentsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";
import {
  getEmployeeDocuments,
  filterEmployeeDocuments,
} from "../../api/admin/employees";

/* ===============================
   Client-side filters helper
================================ */
const applyClientSideFilters = (
  rows,
  department,
  country,
  visaType
) => {
  return rows.filter((r) => {
    if (department && r.department !== department) return false;
    if (country && r.country_of_work !== country) return false;
    if (visaType && r.visa_type !== visaType) return false;
    return true;
  });
};

function EmployeeDocumentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  const [documents, setDocuments] = useState([]);

  /* 🔹 filter master values */
  const [departments, setDepartments] = useState([]);
  const [countries, setCountries] = useState([]);
  const [visaTypes, setVisaTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* 🔹 filters */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterVisaType, setFilterVisaType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  /* 🔹 pagination */
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  /* ===============================
     MASTER LOAD
  ================================ */
  const loadDocuments = (pageNo = 1) => {
    setLoading(true);
    setError(null);

    getEmployeeDocuments({
      page: pageNo,
      page_size: pageSize,
    })
      .then((resp) => {
        const rows = resp?.users_data || [];

        setDocuments(rows);
        setTotalCount(resp?.total_count || 0);
        setTotalPages(resp?.total_pages || 1);

        /* 🔹 extract filter masters */
        setDepartments([
          ...new Set(rows.map((r) => r.department).filter(Boolean)),
        ]);

        setCountries([
          ...new Set(rows.map((r) => r.country_of_work).filter(Boolean)),
        ]);

        setVisaTypes([
          ...new Set(rows.map((r) => r.visa_type).filter(Boolean)),
        ]);

        setStatuses([
          ...new Set(rows.map((r) => r.status).filter(Boolean)),
        ]);
      })
      .catch(() => setError("Unable to load employee documents."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDocuments(1);
  }, []);

  /* ===============================
     FILTERING
  ================================ */
  useEffect(() => {
    setPage(1);
    setLoading(true);

    filterEmployeeDocuments({
      search: searchTerm,
      status: filterStatus,
      page: 1,
      page_size: pageSize,
    })
      .then((resp) => {
        let rows = resp?.users_data || [];

        rows = applyClientSideFilters(
          rows,
          filterDepartment,
          filterCountry,
          filterVisaType
        );

        setDocuments(rows);
        setTotalCount(rows.length);
        setTotalPages(Math.ceil(rows.length / pageSize) || 1);
      })
      .catch(() => setError("Unable to filter documents."))
      .finally(() => setLoading(false));
  }, [searchTerm, filterDepartment, filterCountry, filterVisaType, filterStatus]);

  /* ===============================
     PAGE CHANGE
  ================================ */
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
    setLoading(true);

    filterEmployeeDocuments({
      search: searchTerm,
      status: filterStatus,
      page: newPage,
      page_size: pageSize,
    })
      .then((resp) => {
        let rows = resp?.users_data || [];

        rows = applyClientSideFilters(
          rows,
          filterDepartment,
          filterCountry,
          filterVisaType
        );

        setDocuments(rows);
        setTotalCount(rows.length);
        setTotalPages(Math.ceil(rows.length / pageSize) || 1);
      })
      .finally(() => setLoading(false));
  };

  /* ===============================
     HELPERS
  ================================ */
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterCountry("");
    setFilterVisaType("");
    setFilterStatus("");
    setPage(1);
    loadDocuments(1);
  };

  const handleAddEmployee = () => {
    navigate("/admin/add-employee");
  };

  const getStatusStyle = (status) => {
    if (status === "Valid")
      return { color: "var(--success)", fontWeight: 600 };
    if (status === "Expiring Soon")
      return { color: "#c27c0e", fontWeight: 600 };
    if (status === "Applied")
      return { color: "#2563eb", fontWeight: 600 };
    return { color: "#6b7280", fontWeight: 600 };
  };

  const startRow = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalCount);

  /* ===============================
     RENDER
  ================================ */
  return (
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
          <h3>Employee Visa & Pro Work</h3>
          <p className="subtitle">
            Track and manage visa, work permit and professional authorization.
          </p>
        </div>

        {/* FILTERS */}
        <div className="filters-container">
          <div className="filters-left">
            <div className="search-input">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterVisaType}
              onChange={(e) => setFilterVisaType(e.target.value)}
            >
              <option value="">All Visa Types</option>
              {visaTypes.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filters-right">
            <button className="btn btn-ghost" onClick={handleClearFilters}>
              <i className="fa-solid fa-filter-circle-xmark" /> Clear Filters
            </button>
            <button className="btn btn-primary" onClick={handleAddEmployee}>
              <i className="fa-solid fa-user-plus" /> Add Employee
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <div className="table-header-bar">
            <h4>
              Visa & Pro Work Records{" "}
              <span className="badge-pill">Total: {totalCount}</span>
            </h4>
          </div>

          {loading ? (
            <div style={{ padding: "1rem" }}>Loading documents...</div>
          ) : error ? (
            <div style={{ padding: "1rem", color: "orange" }}>{error}</div>
          ) : (
            <>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Employee</th>
                      <th>Visa Type</th>
                      <th>Visa No.</th>
                      <th>Country</th>
                      <th>Issue Date</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((row) => (
                      <tr key={row.id}>
                        <td>{row.employee_id}</td>
                        <td>{row.name}</td>
                        <td>{row.visa_type}</td>
                        <td>{row.visa_number}</td>
                        <td>{row.country_of_work}</td>
                        <td>{row.issue_date || "-"}</td>
                        <td>{row.expiry_date || "-"}</td>
                        <td>
                          <span style={getStatusStyle(row.status)}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {documents.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center" }}>
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="pagination-wrapper">
                <div>
                  Showing {startRow} to {endRow} of {totalCount} records
                </div>

                <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    <i className="fa-solid fa-angle-left" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={page === i + 1 ? "active-page" : ""}
                      disabled={page === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    <i className="fa-solid fa-angle-right" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default EmployeeDocumentsPage;
