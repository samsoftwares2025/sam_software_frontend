import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import { getDepartments } from "../../api/admin/departments";
import { getEmployementTypes } from "../../api/admin/employement_type";
import { filterEmployeeHistoryData } from "../../api/admin/employees";

/* ===============================
   Client-side filters
================================ */
const applyClientSideFilters = (rows, department, employmentType) => {
  return rows.filter((r) => {
    if (department && r.department !== department) return false;
    if (employmentType && r.employment_type !== employmentType) return false;
    return true;
  });
};

function EmploymentHistoryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  const [history, setHistory] = useState([]);

  // master data
  const [departments, setDepartments] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  /* ===============================
     LOAD MASTER DATA
  ================================ */
  useEffect(() => {
    getDepartments()
      .then((resp) => setDepartments(resp?.departments || []))
      .catch(() => console.error("Failed to load departments"));

    getEmployementTypes()
      .then((resp) =>
        setEmploymentTypes(resp?.employment_types || resp || [])
      )
      .catch(() => console.error("Failed to load employment types"));
  }, []);

  /* ===============================
     SINGLE SOURCE OF TRUTH (DATA LOAD)
  ================================ */
  const loadHistory = (pageNo = 1) => {
    setLoading(true);
    setError(null);

    filterEmployeeHistoryData({
      search: searchTerm,
      status: filterStatus,
      page: pageNo,
      page_size: pageSize,
    })
      .then((resp) => {
        let rows = resp?.users_data || [];

        rows = applyClientSideFilters(rows, filterDepartment, filterType);

        setHistory(rows);
        setTotalCount(resp?.total_count || 0);
        setTotalPages(resp?.total_pages || 1);
        setPage(pageNo);

        setStatuses([...new Set(rows.map((r) => r.status).filter(Boolean))]);
      })
      .catch(() => setError("Unable to load employment history."))
      .finally(() => setLoading(false));
  };

  /* ===============================
     INITIAL LOAD + FILTERS
  ================================ */
  useEffect(() => {
    loadHistory(1);
  }, [searchTerm, filterDepartment, filterType, filterStatus]);

  /* ===============================
     PAGINATION
  ================================ */
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    loadHistory(newPage);
  };

  /* ===============================
     HELPERS
  ================================ */
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterType("");
    setFilterStatus("");
    loadHistory(1);
  };

  const handleAddEmployment = () => {
    navigate("/admin/add-employee");
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
          <h3>Employee Employment History</h3>
          <p className="subtitle">
            View and manage employment history records.
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
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Employment Types</option>
              {employmentTypes.map((t, idx) => (
                <option key={t.id ?? idx} value={t.name ?? t}>
                  {t.name ?? t}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="filters-right">
            <button className="btn btn-ghost" onClick={handleClearFilters}>
              <i className="fa-solid fa-filter-circle-xmark" /> Clear Filters
            </button>
            <button className="btn btn-primary" onClick={handleAddEmployment}>
              <i className="fa-solid fa-user-plus" /> Add Employee
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <div className="table-header-bar">
            <h4>
              Employment History{" "}
              <span className="badge-pill">Total: {totalCount}</span>
            </h4>
          </div>

          {loading ? (
            <div style={{ padding: "1rem" }}>Loading employment history...</div>
          ) : error ? (
            <div style={{ padding: "1rem", color: "orange" }}>{error}</div>
          ) : (
            <>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                     <th style={{ width: "5%" }}>Order No</th>
                      <th style={{ width: "5%" }}>Employee ID</th>
                      <th style={{ width: "15%" }}>Name</th>
                      <th style={{ width: "10%" }}>Employment Type</th>
                      <th style={{ width: "10%" }}>Joining Date</th>
                      <th style={{ width: "10%" }}>Confirmation Date</th>
                      <th style={{ width: "10%" }}>Last Working Date</th>
                      <th style={{ width: "15%" }}>Reporting Manager</th>
                      <th style={{ width: "10%" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row, index) => {
                      const orderNo =
                        (page - 1) * pageSize + index + 1;

                      return (
                        <tr key={row.id}>
                          <td>{orderNo}</td>
                          <td>{row.employee_id}</td>
                          <td>{row.name}</td>
                          <td>{row.employment_type}</td>
                          <td>
                            {row.joining_date
                              ? new Date(row.joining_date).toLocaleDateString(
                                  "en-GB"
                                )
                              : "-"}
                          </td>
                          <td>
                            {row.confirmation_date
                              ? new Date(
                                  row.confirmation_date
                                ).toLocaleDateString("en-GB")
                              : "-"}
                          </td>
                          <td>
                            {row.last_working_date
                              ? new Date(
                                  row.last_working_date
                                ).toLocaleDateString("en-GB")
                              : "-"}
                          </td>
                          <td>{row.reporting_manager || "-"}</td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="icon-btn view"
                                onClick={() =>
                                  navigate(
                                    `/admin/view-employment-history/${row.id}`
                                  )
                                }
                              >
                                <i className="fa-solid fa-eye" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {history.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center" }}>
                          No employment records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="table-footer">
                <div id="tableInfo">
                  Showing {startRow} to {endRow} of {totalCount} employees
                </div>

                <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    <i className="fa-solid fa-angle-left" />
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, i) => i + 1
                  ).map((p) => (
                    <button
                      key={p}
                      className={p === page ? "active-page" : ""}
                      onClick={() => handlePageChange(p)}
                      disabled={p === page}
                    >
                      {p}
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

export default EmploymentHistoryPage;
