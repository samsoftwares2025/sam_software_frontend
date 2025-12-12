// src/pages/admin/EmployeeDocumentsPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

// Same rows as your HTML table
const EMPLOYEE_VISA_RECORDS = [
  {
    id: "#EMP-1001",
    name: "John Smith",
    subTitle: "Senior Software Engineer • Engineering",
    department: "Engineering",
    citizenship: "India",
    visaType: "H1B",
    visaNumber: "H1B-2022-00123",
    countryOfWork: "USA",
    issueDate: "2022-01-10",
    expiryDate: "2025-01-09",
    status: "Valid",
  },
  {
    id: "#EMP-1002",
    name: "Sarah Johnson",
    subTitle: "Marketing Specialist • Marketing",
    department: "Marketing",
    citizenship: "USA",
    visaType: "B1/B2",
    visaNumber: "B1B2-2019-45567",
    countryOfWork: "USA",
    issueDate: "2019-05-01",
    expiryDate: "2025-02-15",
    status: "Expiring Soon",
  },
  {
    id: "#EMP-1003",
    name: "Mike Davis",
    subTitle: "HR Manager • HR",
    department: "HR",
    citizenship: "UK",
    visaType: "Work Permit",
    visaNumber: "WP-UK-2020-99881",
    countryOfWork: "UK",
    issueDate: "2020-03-01",
    expiryDate: "2026-02-28",
    status: "Valid",
  },
  {
    id: "#EMP-1004",
    name: "Emily Carter",
    subTitle: "Account Executive • Sales",
    department: "Sales",
    citizenship: "Canada",
    visaType: "Work Permit",
    visaNumber: "WP-CA-2018-33221",
    countryOfWork: "Canada",
    issueDate: "2018-01-01",
    expiryDate: "2021-12-31",
    status: "Expired",
  },
  {
    id: "#EMP-1005",
    name: "Rahul Sharma",
    subTitle: "DevOps Engineer • Engineering",
    department: "Engineering",
    citizenship: "India",
    visaType: "H1B",
    visaNumber: "H1B-2025-APPL",
    countryOfWork: "USA",
    issueDate: "—",
    expiryDate: "—",
    status: "Applied",
  },
  {
    id: "#EMP-1006",
    name: "Oliver Brown",
    subTitle: "Financial Analyst • Finance",
    department: "Finance",
    citizenship: "Germany",
    visaType: "Intra-company Transfer",
    visaNumber: "ICT-DE-2023-77889",
    countryOfWork: "Germany",
    issueDate: "2023-04-01",
    expiryDate: "2026-03-31",
    status: "Valid",
  },
  {
    id: "#EMP-1007",
    name: "Sophia Lee",
    subTitle: "Sales Intern • Sales",
    department: "Sales",
    citizenship: "USA",
    visaType: "B1/B2",
    visaNumber: "B1B2-2017-11442",
    countryOfWork: "USA",
    issueDate: "2017-07-15",
    expiryDate: "2022-07-14",
    status: "Expired",
  },
  {
    id: "#EMP-1008",
    name: "Priya Nair",
    subTitle: "HR Executive • HR",
    department: "HR",
    citizenship: "India",
    visaType: "Work Permit",
    visaNumber: "WP-IN-2024-55511",
    countryOfWork: "India",
    issueDate: "2024-01-01",
    expiryDate: "2027-12-31",
    status: "Valid",
  },
];

function VisaProWorkPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterVisaType, setFilterVisaType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  const handleMenuClick = () => setIsSidebarOpen((prev) => !prev);
  const handleOverlayClick = () => setIsSidebarOpen(false);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterCountry("");
    setFilterVisaType("");
    setFilterStatus("");
  };

  const handleAddEmployee = () => {
    // Same behavior as HTML redirect to add_employee.html
    navigate("/admin/add-employee");
  };

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return EMPLOYEE_VISA_RECORDS.filter((row) => {
      const rowText = `${row.id} ${row.name} ${row.subTitle} ${row.department} ${row.citizenship} ${row.visaType} ${row.visaNumber} ${row.countryOfWork} ${row.issueDate} ${row.expiryDate} ${row.status}`.toLowerCase();

      const matchesSearch = !term || rowText.includes(term);
      const matchesDept =
        !filterDepartment || row.department === filterDepartment;
      const matchesCountry =
        !filterCountry || row.countryOfWork === filterCountry;
      const matchesVisa =
        !filterVisaType || row.visaType === filterVisaType;
      const matchesStatus =
        !filterStatus || row.status === filterStatus;

      return (
        matchesSearch &&
        matchesDept &&
        matchesCountry &&
        matchesVisa &&
        matchesStatus
      );
    });
  }, [searchTerm, filterDepartment, filterCountry, filterVisaType, filterStatus]);

  const totalCount = EMPLOYEE_VISA_RECORDS.length;
  const visibleCount = filteredRows.length;

  const getStatusStyle = (status) => {
    if (status === "Valid")
      return { color: "var(--success)", fontWeight: 600 };
    if (status === "Expiring Soon")
      return { color: "#c27c0e", fontWeight: 600 };
    if (status === "Applied")
      return { color: "#2563eb", fontWeight: 600 };
    // Expired / others
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

      {/* Main Area */}
      <main className="main">
        <Header onMenuClick={handleMenuClick} />

        <div className="the_line" />

        <div className="page-title">
          <h3>Employee Visa &amp; Pro Work</h3>
          <p className="subtitle">
            Track and manage employee visa, work permits and professional work
            authorization details.
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
                placeholder="Search by name, ID, passport, visa no..."
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
              id="filterCountry"
              className="filter-select"
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <option value="">All Countries</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Germany">Germany</option>
            </select>

            <select
              id="filterVisaType"
              className="filter-select"
              value={filterVisaType}
              onChange={(e) => setFilterVisaType(e.target.value)}
            >
              <option value="">All Visa Types</option>
              <option value="H1B">H1B</option>
              <option value="L1">L1</option>
              <option value="B1/B2">B1/B2</option>
              <option value="Work Permit">Work Permit</option>
              <option value="Intra-company Transfer">
                Intra-company Transfer
              </option>
            </select>

            <select
              id="filterStatus"
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Valid">Valid</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
              <option value="Applied">Applied</option>
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
              id="addVisaBtn"
              type="button"
              onClick={handleAddEmployee}
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
              Visa &amp; Pro Work Records{" "}
              <span className="badge-pill" id="employeeCountBadge">
                Total: {visibleCount}
              </span>
            </h4>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table" id="employeeTable">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee</th>
                  <th>Citizenship</th>
                  <th>Visa / Permit Type</th>
                  <th>Visa / Permit No.</th>
                  <th>Country of Work</th>
                  <th>Issue Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    data-department={row.department}
                    data-country={row.countryOfWork}
                    data-visa-type={row.visaType}
                    data-status={row.status}
                  >
                    <td>{row.id}</td>
                    <td>
                      <div className="emp-name">{row.name}</div>
                      <div className="emp-sub">{row.subTitle}</div>
                    </td>
                    <td>{row.citizenship}</td>
                    <td>{row.visaType}</td>
                    <td>{row.visaNumber}</td>
                    <td>{row.countryOfWork}</td>
                    <td>{row.issueDate}</td>
                    <td>{row.expiryDate}</td>
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
                          title="Edit Visa / Pro Work"
                          type="button"
                        >
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button
                          className="icon-btn delete"
                          title="Delete Record"
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
                      colSpan={10}
                      style={{ textAlign: "center", padding: "1.5rem" }}
                    >
                      No visa or pro work records match the selected filters.
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

export default VisaProWorkPage;
