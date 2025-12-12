// src/pages/admin/EmployeeMasterDataPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css"; // make sure this includes your table/filter styles

// Same data as your HTML table
const EMPLOYEES = [
  {
    id: "#EMP-1001",
    name: "John Smith",
    email: "john.smith@abctech.com",
    department: "Engineering",
    designation: "Senior Software Engineer",
    location: "Head Office - New York",
    status: "Active",
    joiningDate: "2022-03-15",
  },
  {
    id: "#EMP-1002",
    name: "Sarah Johnson",
    email: "sarah.johnson@abctech.com",
    department: "Marketing",
    designation: "Marketing Specialist",
    location: "Branch Office - California",
    status: "Probation",
    joiningDate: "2025-01-10",
  },
  {
    id: "#EMP-1003",
    name: "Mike Davis",
    email: "mike.davis@abctech.com",
    department: "HR",
    designation: "HR Manager",
    location: "Head Office - New York",
    status: "Active",
    joiningDate: "2020-11-01",
  },
  {
    id: "#EMP-1004",
    name: "Emily Carter",
    email: "emily.carter@abctech.com",
    department: "Sales",
    designation: "Account Executive",
    location: "Branch Office - Texas",
    status: "Inactive",
    joiningDate: "2019-08-20",
  },
  {
    id: "#EMP-1005",
    name: "Rahul Sharma",
    email: "rahul.sharma@abctech.com",
    department: "Engineering",
    designation: "DevOps Engineer",
    location: "Remote",
    status: "Active",
    joiningDate: "2021-05-12",
  },
  {
    id: "#EMP-1006",
    name: "Oliver Brown",
    email: "oliver.brown@abctech.com",
    department: "Finance",
    designation: "Financial Analyst",
    location: "Head Office - New York",
    status: "Active",
    joiningDate: "2023-02-05",
  },
  {
    id: "#EMP-1007",
    name: "Sophia Lee",
    email: "sophia.lee@abctech.com",
    department: "Sales",
    designation: "Sales Associate",
    location: "Branch Office - California",
    status: "Probation",
    joiningDate: "2025-10-01",
  },
  {
    id: "#EMP-1008",
    name: "Priya Nair",
    email: "priya.nair@abctech.com",
    department: "HR",
    designation: "HR Executive",
    location: "Remote",
    status: "Inactive",
    joiningDate: "2018-07-30",
  },
];

function EmployeeMasterDataPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState(""); 
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  const handleMenuClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterStatus("");
  };

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return EMPLOYEES.filter((emp) => {
      const rowText = `${emp.id} ${emp.name} ${emp.email} ${emp.department} ${emp.designation} ${emp.location} ${emp.status} ${emp.joiningDate}`.toLowerCase();

      const matchesSearch = !term || rowText.includes(term);
      const matchesDept =
        !filterDepartment || emp.department === filterDepartment;
      const matchesStatus = !filterStatus || emp.status === filterStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [searchTerm, filterDepartment, filterStatus]);

  const totalCount = EMPLOYEES.length;
  const visibleCount = filteredEmployees.length;

  const getStatusClassName = (status) => {
    if (status === "Active") return "status-pill status-active";
    if (status === "Probation") return "status-pill status-probation";
    return "status-pill status-inactive";
  };

  const handleAddEmployeeClick = () => {
    // Navigate to your Add Employee React route
    navigate("/admin/add-employee");
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

      {/* Main */}
      <main className="main">
        {/* Header */}
        <Header onMenuClick={handleMenuClick} />

        <div className="the_line" />

        {/* Page title */}
        <div className="page-title">
          <h3>Employee Master Data</h3>
          <p className="subtitle">
            View, filter and manage all employee records in one place.
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
                placeholder="Search by name, ID, department..."
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
              id="filterStatus"
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
              id="addEmployeeBtn"
              type="button"
              onClick={handleAddEmployeeClick}
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
              Employee List{" "}
              <span className="badge-pill" id="employeeCountBadge">
                Total: {visibleCount}
              </span>
            </h4>
            <small>
              Showing key master data, click actions to view full profile.
            </small>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table" id="employeeTable">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Joining Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    data-department={emp.department}
                    data-status={emp.status}
                  >
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.location}</td>
                    <td>
                      <span className={getStatusClassName(emp.status)}>
                        <span className="dot">●</span> {emp.status}
                      </span>
                    </td>
                    <td>{emp.joiningDate}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-btn view"
                          title="View Profile"
                          type="button"
                        >
                          <i className="fa-solid fa-eye" />
                        </button>
                        <button
                          className="icon-btn edit"
                          title="Edit"
                          type="button"
                        >
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button
                          className="icon-btn delete"
                          title="Delete"
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
                      No employees match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div id="tableInfo">
              Showing 1 to {visibleCount} of {totalCount} employees
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

export default EmployeeMasterDataPage;
