import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";
import {
  getEmployeeHistoryData,
  filterEmployeeHistoryData,
} from "../../api/admin/employees";

// 🔹 ADD helper at top (AFTER imports)
const applyClientSideFilters = (
  rows,
  department,
  employmentType
) => {
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
  const [departments, setDepartments] = useState([]);          // ✅ NEW
  const [employmentTypes, setEmploymentTypes] = useState([]);  // ✅ NEW
  const [statuses, setStatuses] = useState([]);                // ✅ NEW

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 🔹 Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // ==============================
  // Load history list (MASTER LOAD)
  // ==============================
  const loadHistoryList = (pageNo = 1) => {
    setLoading(true);
    setError(null);

    getEmployeeHistoryData({
      page: pageNo,
      page_size: pageSize,
    })
      .then((resp) => {
        const rows = resp?.users_data || [];

        setHistory(rows);
        setTotalCount(resp?.total_count || 0);
        setTotalPages(resp?.total_pages || 1);

        // ✅ Extract filter master values ONCE
        setDepartments([
          ...new Set(rows.map((r) => r.department).filter(Boolean)),
        ]);

        setEmploymentTypes([
          ...new Set(rows.map((r) => r.employment_type).filter(Boolean)),
        ]);

        setStatuses([
          ...new Set(rows.map((r) => r.status).filter(Boolean)),
        ]);
      })
      .catch(() => {
        setError("Unable to load employment history.");
      })
      .finally(() => setLoading(false));
  };

  // Initial load
  useEffect(() => {
    loadHistoryList(1);
  }, []);

  // ==============================
  // Filtering
  // ==============================
  useEffect(() => {
  setPage(1);

  setLoading(true);

  filterEmployeeHistoryData({
    search: searchTerm,
    status: filterStatus,
    page: 1,
    page_size: pageSize,
  })
    .then((resp) => {
      let rows = resp?.users_data || [];

      // ✅ CLIENT-SIDE FILTERING (SAME IDEA AS MASTER)
      rows = applyClientSideFilters(
        rows,
        filterDepartment,
        filterType
      );

      setHistory(rows);
      setTotalCount(rows.length);
      setTotalPages(Math.ceil(rows.length / pageSize) || 1);
    })
    .catch(() => {
      setError("Unable to filter employment history.");
    })
    .finally(() => setLoading(false));
}, [searchTerm, filterDepartment, filterType, filterStatus]);


  // ==============================
  // Page change
  // ==============================
  const handlePageChange = (newPage) => {
  if (newPage < 1 || newPage > totalPages) return;

  setPage(newPage);
  setLoading(true);

  filterEmployeeHistoryData({
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
        filterType
      );

      setHistory(rows);
      setTotalCount(rows.length);
      setTotalPages(Math.ceil(rows.length / pageSize) || 1);
    })
    .finally(() => setLoading(false));
};


  // ==============================
  // Helpers
  // ==============================
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterType("");
    setFilterStatus("");
    setPage(1);
    loadHistoryList(1); // ✅ reload master
  };

  const handleAddEmployment = () => {
    navigate("/admin/add-employee");
  };

  const getStatusStyle = (status) => {
    if (status === "Active") return { color: "var(--success)", fontWeight: 600 };
    if (status === "On Notice")
      return { color: "#c27c0e", fontWeight: 600 };
    if (status === "Terminated")
      return { color: "var(--danger)", fontWeight: 600 };
    return { color: "#6b7280", fontWeight: 600 };
  };

  const startRow = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalCount);

  // ==============================
  // Render
  // ==============================
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

            {/* ✅ FIXED FILTERS */}
            <select
              className="filter-select"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Employment Types</option>
              {employmentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
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
            <div style={{ padding: "1rem" }}>
              Loading employment history...
            </div>
          ) : error ? (
            <div style={{ padding: "1rem", color: "orange" }}>{error}</div>
          ) : (
            <>
              <div className="data-table-wrapper">
                 <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order No</th>
                      <th>Employee ID</th>
                      <th>Employee</th>
                      <th>Employment Type</th>
                      <th>Joining Date</th>
                      <th>Confirmation Date</th>
                      <th>Last Working Date</th>
                      <th>Reporting Manager</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row, index) => {
                      const orderNo = (page - 1) * pageSize + index + 1;

                      return (
                        <tr key={row.id}>
                          <td>{orderNo}</td>
                          <td>{row.employee_id}</td>
                          <td>{row.name}</td>
                          <td>{row.employment_type}</td>
                          <td>
                            {row.joining_date
                              ? new Date(row.joining_date).toLocaleDateString("en-GB")
                              : "-"}
                          </td>
                          <td>
                            {row.confirmation_date
                              ? new Date(row.confirmation_date).toLocaleDateString("en-GB")
                              : "-"}
                          </td>
                          <td>
                            {row.last_working_date
                              ? new Date(row.last_working_date).toLocaleDateString("en-GB")
                              : "-"}
                          </td>
                          <td>
                            <div>{row.reporting_manager || "-"}</div>
                            <div className="contact-sub">
                              {row.manager_designation || ""}
                            </div>
                          </td>
                          <td>
                            <span style={getStatusStyle(row.status)}>
                              {row.status}
                            </span>
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
              <div className="pagination-wrapper">
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

                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        className={page === pageNum ? "active-page" : ""}
                        disabled={page === pageNum}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

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
