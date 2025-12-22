import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";
import {
  getEmployeeMasterData,
  filterEmployeeMasterData,
} from "../../api/admin/employees";

function EmployeeMasterDataPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); // ✅ NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 🔹 Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // ==============================
  // Load employee list (INITIAL)
  // ==============================
  const loadEmployeeList = (pageNo = 1) => {
    setLoading(true);
    setError(null);

    getEmployeeMasterData({
      page: pageNo,
      page_size: pageSize,
    })
      .then((resp) => {
        const users = resp?.users_data || [];

        setEmployees(users);
        setTotalCount(resp?.total_count || 0);
        setTotalPages(resp?.total_pages || 1);

        // ✅ Extract departments ONCE
        const uniqueDepartments = [
          ...new Set(users.map((e) => e.department).filter(Boolean)),
        ];
        setDepartments(uniqueDepartments);
      })
      .catch(() => {
        setError("Unable to load employee master data.");
      })
      .finally(() => setLoading(false));
  };

  // Initial load
  useEffect(() => {
    loadEmployeeList(1);
  }, []);

  // ==============================
  // Filtering
  // ==============================
  useEffect(() => {
    setPage(1);

    if (!searchTerm && !filterDepartment && !filterStatus) {
      loadEmployeeList(1);
      return;
    }

    setLoading(true);

    filterEmployeeMasterData({
      search: searchTerm,
      department: filterDepartment,
      status: filterStatus,
      page: 1,
      page_size: pageSize,
    })
      .then((resp) => {
        setEmployees(resp?.users_data || []);
        setTotalCount(resp?.total_count || 0);
        setTotalPages(resp?.total_pages || 1);
      })
      .catch(() => {
        setError("Unable to filter employee data.");
      })
      .finally(() => setLoading(false));
  }, [searchTerm, filterDepartment, filterStatus]);

  // ==============================
  // Page change
  // ==============================
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
    setLoading(true);

    const payload = {
      search: searchTerm,
      department: filterDepartment,
      status: filterStatus,
      page: newPage,
      page_size: pageSize,
    };

    const apiCall =
      !searchTerm && !filterDepartment && !filterStatus
        ? getEmployeeMasterData(payload)
        : filterEmployeeMasterData(payload);

    apiCall
      .then((resp) => {
        setEmployees(resp?.users_data || []);
        setTotalCount(resp?.total_count || 0);
        setTotalPages(resp?.total_pages || 1);
      })
      .finally(() => setLoading(false));
  };

  // ==============================
  // Helpers
  // ==============================
  const getStatusClassName = (status) => {
    if (status === "Active") return "status-pill status-active";
    if (status === "Probation") return "status-pill status-probation";
    return "status-pill status-inactive";
  };

  const handleAddEmployee = () => {
    navigate("/admin/add-employee");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterStatus("");
    setPage(1);
    loadEmployeeList(1); // ✅ reload master data
  };

  // Pagination info
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
          <h3>Employee Master Data</h3>
          <p className="subtitle">
            View, filter and manage all employee records.
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

            {/* ✅ FIXED DEPARTMENT FILTER */}
            <select
              className="filter-select"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button className="btn btn-ghost" onClick={handleClearFilters}>
            <i className="fa-solid fa-filter-circle-xmark" /> Clear Filters
          </button>

          <button className="btn btn-primary" onClick={handleAddEmployee}>
            <i className="fa-solid fa-user-plus" /> Add Employee
          </button>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <div className="table-header-bar">
            <h4>
              Employee List{" "}
              <span className="badge-pill">Total: {totalCount}</span>
            </h4>
          </div>

          {loading ? (
            <div style={{ padding: "1rem" }}>Loading employees...</div>
          ) : error ? (
            <div style={{ padding: "1rem", color: "orange" }}>{error}</div>
          ) : (
            <>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Joining Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, index) => (
                      <tr key={emp.id}>
                        <td>{(page - 1) * pageSize + index + 1}</td>
                        <td>{emp.employee_id}</td>
                        <td>{emp.name}</td>
                        <td>{emp.official_email}</td>
                        <td>{emp.department || "-"}</td>
                        <td>{emp.designation || "-"}</td>
                        <td>{emp.work_location || "-"}</td>
                        <td>
                          <span className={getStatusClassName(emp.status)}>
                            ● {emp.status}
                          </span>
                        </td>
                        <td>
                          {emp.joining_date
                            ? new Date(emp.joining_date).toLocaleDateString(
                                "en-GB"
                              )
                            : "-"}
                        </td>
                      </tr>
                    ))}

                    {employees.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center" }}>
                          No employees found.
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

export default EmployeeMasterDataPage;
