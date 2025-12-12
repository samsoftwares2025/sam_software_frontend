// src/pages/admin/EmploymentHistoryPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

// Same rows as your HTML table
const EMPLOYMENT_HISTORY = [
  {
    id: "#EMP-1001",
    name: "John Smith",
    subTitle: "Senior Software Engineer • Engineering",
    department: "Engineering",
    employmentType: "Full-time",
    joiningDate: "2019-03-15",
    confirmationDate: "2019-09-15",
    lastWorkingDate: "—",
    managerName: "Alice Brown",
    managerTitle: "Engineering Manager",
    status: "Active",
  },
  {
    id: "#EMP-1002",
    name: "Sarah Johnson",
    subTitle: "Marketing Specialist • Marketing",
    department: "Marketing",
    employmentType: "Full-time",
    joiningDate: "2021-01-10",
    confirmationDate: "2021-07-10",
    lastWorkingDate: "2025-02-28",
    managerName: "Kevin White",
    managerTitle: "Marketing Lead",
    status: "On Notice",
  },
  {
    id: "#EMP-1003",
    name: "Mike Davis",
    subTitle: "HR Manager • HR",
    department: "HR",
    employmentType: "Full-time",
    joiningDate: "2018-06-01",
    confirmationDate: "2018-12-01",
    lastWorkingDate: "—",
    managerName: "CEO",
    managerTitle: "Direct Report",
    status: "Active",
  },
  {
    id: "#EMP-1004",
    name: "Emily Carter",
    subTitle: "Account Executive • Sales",
    department: "Sales",
    employmentType: "Contract",
    joiningDate: "2020-09-01",
    confirmationDate: "—",
    lastWorkingDate: "2023-08-31",
    managerName: "Robert King",
    managerTitle: "Sales Manager",
    status: "Resigned",
  },
  {
    id: "#EMP-1005",
    name: "Rahul Sharma",
    subTitle: "DevOps Engineer • Engineering",
    department: "Engineering",
    employmentType: "Full-time",
    joiningDate: "2022-04-01",
    confirmationDate: "2022-10-01",
    lastWorkingDate: "—",
    managerName: "John Smith",
    managerTitle: "Tech Lead",
    status: "Active",
  },
  {
    id: "#EMP-1006",
    name: "Oliver Brown",
    subTitle: "Financial Analyst • Finance",
    department: "Finance",
    employmentType: "Full-time",
    joiningDate: "2020-01-20",
    confirmationDate: "2020-07-20",
    lastWorkingDate: "—",
    managerName: "Maria Gomez",
    managerTitle: "Finance Manager",
    status: "Active",
  },
  {
    id: "#EMP-1007",
    name: "Sophia Lee",
    subTitle: "Sales Intern • Sales",
    department: "Sales",
    employmentType: "Intern",
    joiningDate: "2023-06-01",
    confirmationDate: "—",
    lastWorkingDate: "2023-08-15",
    managerName: "Emily Carter",
    managerTitle: "Account Executive",
    status: "Terminated",
  },
  {
    id: "#EMP-1008",
    name: "Priya Nair",
    subTitle: "HR Executive • HR",
    department: "HR",
    employmentType: "Part-time",
    joiningDate: "2024-02-01",
    confirmationDate: "2024-08-01",
    lastWorkingDate: "—",
    managerName: "Mike Davis",
    managerTitle: "HR Manager",
    status: "Active",
  },
];

function EmploymentHistoryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  const handleMenuClick = () => setIsSidebarOpen((prev) => !prev);
  const handleOverlayClick = () => setIsSidebarOpen(false);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterType("");
    setFilterStatus("");
  };

  const handleAddEmployment = () => {
    // Go to your Add Employee page (same as HTML redirect to add_employee.html)
    navigate("/admin/add-employee");
  };

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return EMPLOYMENT_HISTORY.filter((row) => {
      const rowText = `${row.id} ${row.name} ${row.subTitle} ${row.department} ${row.employmentType} ${row.joiningDate} ${row.confirmationDate} ${row.lastWorkingDate} ${row.managerName} ${row.managerTitle} ${row.status}`.toLowerCase();

      const matchesSearch = !term || rowText.includes(term);
      const matchesDept =
        !filterDepartment || row.department === filterDepartment;
      const matchesType =
        !filterType || row.employmentType === filterType;
      const matchesStatus =
        !filterStatus || row.status === filterStatus;

      return matchesSearch && matchesDept && matchesType && matchesStatus;
    });
  }, [searchTerm, filterDepartment, filterType, filterStatus]);

  const totalCount = EMPLOYMENT_HISTORY.length;
  const visibleCount = filteredRows.length;

  const getStatusStyle = (status) => {
    if (status === "Active")
      return { color: "var(--success)", fontWeight: 600 };
    if (status === "On Notice")
      return { color: "#c27c0e", fontWeight: 600 };
    if (status === "Terminated")
      return { color: "var(--danger)", fontWeight: 600 };
    // Resigned / others
    return { color: "#6b7280", fontWeight: 600 };
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        openSection={openSection}
        setOpenSection={setOpenSection}
      />

      {/* Main area */}
      <main className="main">
        <Header onMenuClick={handleMenuClick} />

        <div className="the_line" />

        <div className="page-title">
          <h3>Employee Employment History</h3>
          <p className="subtitle">
            View and manage employment history including join dates, roles,
            managers and exit details.
          </p>
        </div>

        {/* FILTERS BAR */}
        <div className="filters-container">
          <div className="filters-left">
            <div className="search-input">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                id="searchInput"
                placeholder="Search by name, ID, designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              id="filterDepartment"
              className="filter-select"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              id="filterType"
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>

            <select
              id="filterStatus"
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="On Notice">On Notice</option>
              <option value="Resigned">Resigned</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          <div className="filters-right">
            <button
              className="btn btn-ghost"
              id="clearFiltersBtn"
              type="button"
              onClick={handleClearFilters}
            >
              <i className="fa-solid fa-filter-circle-xmark" />
              Clear Filters
            </button>
            <button
              className="btn btn-primary"
              id="addEmploymentBtn"
              type="button"
              onClick={handleAddEmployment}
            >
              <i className="fa-solid fa-user-plus" />
              Add Employee
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <div className="table-header-bar">
            <h4>
              Employment History{" "}
              <span className="badge-pill" id="employeeCountBadge">
                Total: {visibleCount}
              </span>
            </h4>
            <small>Past and current employment records of employees.</small>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table" id="employeeTable">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee</th>
                  <th>Employment Type</th>
                  <th>Joining Date</th>
                  <th>Confirmation Date</th>
                  <th>Last Working Date</th>
                  <th>Reporting Manager</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    data-department={row.department}
                    data-type={row.employmentType}
                    data-status={row.status}
                  >
                    <td>{row.id}</td>
                    <td>
                      <div className="emp-name">{row.name}</div>
                      <div className="emp-sub">{row.subTitle}</div>
                    </td>
                    <td>{row.employmentType}</td>
                    <td>{row.joiningDate}</td>
                    <td>{row.confirmationDate}</td>
                    <td>{row.lastWorkingDate}</td>
                    <td>
                      <div>{row.managerName}</div>
                      <div className="contact-sub">{row.managerTitle}</div>
                    </td>
                    <td>
                      <span style={getStatusStyle(row.status)}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-btn view"
                          title="View Details"
                          type="button"
                        >
                          <i className="fa-solid fa-eye" />
                        </button>
                        <button
                          className="icon-btn edit"
                          title="Edit Employment"
                          type="button"
                        >
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button
                          className="icon-btn delete"
                          title="Delete Employment Record"
                          type="button"
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleCount === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: "center", padding: "1.5rem" }}
                    >
                      No employment records match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div id="tableInfo">
              Showing 1 to {visibleCount} of {totalCount} records
            </div>
            <div className="pagination">
              <button disabled title="Previous page" type="button">
                <i className="fa-solid fa-angle-left" />
              </button>
              <button className="active-page" type="button">
                1
              </button>
              <button disabled type="button">
                2
              </button>
              <button disabled title="Next page" type="button">
                <i className="fa-solid fa-angle-right" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* mobile sidebar overlay */}
      <div
        id="sidebarOverlay"
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        tabIndex={-1}
        aria-hidden={!isSidebarOpen}
        onClick={handleOverlayClick}
      />
    </div>
  );
}

export default EmploymentHistoryPage;
