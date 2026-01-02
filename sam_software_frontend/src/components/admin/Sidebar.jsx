// Sidebar.jsx
import React from "react";
import { logoutUser } from "../../api/auth";
import { NavLink, useNavigate } from "react-router-dom"; // ✅ ADD useNavigate

function Sidebar({ isMobileOpen, onClose, openSection, setOpenSection }) {
  const navigate = useNavigate(); // ✅ INITIALIZE navigate
  const handleSectionToggle = (sectionId) => {
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));
  };

  const navHasSubmenu = (id) =>
    `nav-item nav-has-submenu ${openSection === id ? "open" : ""}`;

  const submenuHidden = (id) => String(openSection !== id);

  /* ================= AUTH DATA ================= */
  const userName = localStorage.getItem("userName") || "User";
  const userImage = localStorage.getItem("userImage");
  const companyName = localStorage.getItem("companyName") || "Company";
  const companyLogo = localStorage.getItem("companyLogo");

  // initials fallback (AB)
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <aside
      className={`sidebar ${isMobileOpen ? "mobile-open mobile-visible" : ""}`}
      id="sidebar"
    >
      {/* ================= COMPANY LOGO ================= */}
      <div className="logo-container">
        <a href="#" className="logo">
          <div className="logo-icon">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                style={{ width: 36, height: 36, objectFit: "contain" }}
              />
            ) : (
              initials
            )}
          </div>
          <div className="logo-text">{companyName}</div>
        </a>
      </div>

      <ul className="nav-menu">
        <li className="nav-item">
          <a href="index.html" className="nav-link">
            <span className="nav-icon">
              <i className="fa-solid fa-chart-line" />
            </span>
            Dashboard
          </a>
        </li>

        {/* Employees */}
        <li className={navHasSubmenu("employees")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "employees"}
            onClick={() => handleSectionToggle("employees")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-users" />
            </span>
            <span className="nav-text">Employees</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("employees")}>
            <li>
              <NavLink
                to="/admin/employee-master" // 👈 your React route
                className={({ isActive }) =>
                  `submenu-link ${isActive ? "active-submenu" : ""}`
                }
              >
                Master Data
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/employment-history" // 👈 your React route
                className={({ isActive }) =>
                  `submenu-link ${isActive ? "active-submenu" : ""}`
                }
              >
                History
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/employee-documents" // 👈 your React route
                className={({ isActive }) =>
                  `submenu-link ${isActive ? "active-submenu" : ""}`
                }
              >
                Documents
              </NavLink>
            </li>
          </ul>
        </li>

        {/* Organization (active) */}
        <li className={navHasSubmenu("organization")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "organization"}
            onClick={() => handleSectionToggle("organization")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-building" />
            </span>
            <span className="nav-text">Organization</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("organization")}>
            <li>
              <NavLink
                to="/admin/departments" // 👈 your React route
                className={({ isActive }) =>
                  `submenu-link ${isActive ? "active-submenu" : ""}`
                }
              >
                Departments
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/designations" // 👈 your React route
                className={({ isActive }) =>
                  `submenu-link ${isActive ? "active-submenu" : ""}`
                }
              >
                Designations
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/employment-type" // 👈 your React route
                className={({ isActive }) =>
                  `submenu-link ${isActive ? "active-submenu" : ""}`
                }
              >
                Employment Type
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/roles-permissions" // 👈 your React route
                className={({ isActive }) =>
                  `submenu-link ${isActive ? "active-submenu" : ""}`
                }
              >
                Roles & Permissions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/policies" // 👈 your React route
                className={({ isActive }) =>
                  `submenu-link ${isActive ? "active-submenu" : ""}`
                }
              >
                Policies
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/company-rules" // 👈 your React route
                className={({ isActive }) =>
                  `submenu-link ${isActive ? "active-submenu" : ""}`
                }
              >
                Company Rules
              </NavLink>
            </li>

            <li>
              <a className="submenu-link">Compliance Documentation</a>
            </li>
          </ul>
        </li>

        {/* Recruitment & ATS */}
        <li className={navHasSubmenu("recruitment")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "recruitment"}
            onClick={() => handleSectionToggle("recruitment")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-user-tie" />
            </span>
            <span className="nav-text">Recruitment &amp; ATS</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("recruitment")}>
            <li>
              <a className="submenu-link">Job Management</a>
            </li>
            <li>
              <a className="submenu-link">Candidate Management</a>
            </li>
            <li>
              <a className="submenu-link">Interview Management</a>
            </li>
            <li>
              <a className="submenu-link">Offer &amp; Hiring</a>
            </li>
            <li>
              <a className="submenu-link">Onboarding</a>
            </li>
            <li>
              <a className="submenu-link">Offboarding</a>
            </li>
          </ul>
        </li>

        {/* Attendance */}
        <li className={navHasSubmenu("attendance")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "attendance"}
            onClick={() => handleSectionToggle("attendance")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-clock" />
            </span>
            <span className="nav-text">Attendance</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("attendance")}>
            <li>
              <a className="submenu-link">Attendance</a>
            </li>
            <li>
              <a className="submenu-link">Leave</a>
            </li>
            <li>
              <a className="submenu-link">Timesheets</a>
            </li>
            <li>
              <a className="submenu-link">Shift Management</a>
            </li>
          </ul>
        </li>

        {/* Payroll Management */}
        <li className={navHasSubmenu("payroll")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "payroll"}
            onClick={() => handleSectionToggle("payroll")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-money-check-dollar" />
            </span>
            <span className="nav-text">Payroll Management</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("payroll")}>
            <li>
              <a className="submenu-link">Payroll Setup</a>
            </li>
            <li>
              <a className="submenu-link">Payroll Processing</a>
            </li>
            <li>
              <a className="submenu-link">Payroll Output</a>
            </li>
            <li>
              <a className="submenu-link">Compliance</a>
            </li>
          </ul>
        </li>

        {/* Performance & Appraisals */}
        <li className={navHasSubmenu("performance")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "performance"}
            onClick={() => handleSectionToggle("performance")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-chart-pie" />
            </span>
            <span className="nav-text">Performance &amp; Appraisals</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("performance")}>
            <li>
              <a className="submenu-link">Goal &amp; KPI Management</a>
            </li>
            <li>
              <a className="submenu-link">Assessment</a>
            </li>
            <li>
              <a className="submenu-link">Appraisal Cycles</a>
            </li>
          </ul>
        </li>

        {/* Learning & Development */}
        <li className={navHasSubmenu("learning")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "learning"}
            onClick={() => handleSectionToggle("learning")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-graduation-cap" />
            </span>
            <span className="nav-text">Learning &amp; Development</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("learning")}>
            <li>
              <a className="submenu-link">Training Management</a>
            </li>
            <li>
              <a className="submenu-link">e-Learning</a>
            </li>
            <li>
              <a className="submenu-link">Skill Development</a>
            </li>
          </ul>
        </li>

        {/* Employee Engagement */}
        <li className={navHasSubmenu("engagement")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "engagement"}
            onClick={() => handleSectionToggle("engagement")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-heart" />
            </span>
            <span className="nav-text">Employee Engagement</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("engagement")}>
            <li>
              <a className="submenu-link">Surveys &amp; Feedback</a>
            </li>
            <li>
              <a className="submenu-link">Recognition</a>
            </li>
            <li>
              <a className="submenu-link">Communication</a>
            </li>
          </ul>
        </li>

        {/* Talent & Succession Planning */}
        <li className={navHasSubmenu("talent")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "talent"}
            onClick={() => handleSectionToggle("talent")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-sitemap" />
            </span>
            <span className="nav-text">Talent &amp; Succession Planning</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("talent")}>
            <li>
              <a className="submenu-link">Competency Framework</a>
            </li>
            <li>
              <a className="submenu-link">Succession Planning</a>
            </li>
          </ul>
        </li>

        {/* Benefits & Compensation */}
        <li className={navHasSubmenu("benefits")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "benefits"}
            onClick={() => handleSectionToggle("benefits")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-gift" />
            </span>
            <span className="nav-text">Benefits &amp; Compensation</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("benefits")}>
            <li>
              <a className="submenu-link">Health &amp; Insurance Plans</a>
            </li>
            <li>
              <a className="submenu-link">Allowance Policies</a>
            </li>
            <li>
              <a className="submenu-link">Bonus Planning</a>
            </li>
            <li>
              <a className="submenu-link">Increment Budgeting</a>
            </li>
          </ul>
        </li>

        {/* Expense */}
        <li className={navHasSubmenu("expense")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "expense"}
            onClick={() => handleSectionToggle("expense")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-file-invoice-dollar" />
            </span>
            <span className="nav-text">Expense</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("expense")}>
            <li>
              <a className="submenu-link">Expense Category</a>
            </li>
            <li>
              <a className="submenu-link">Expenses</a>
            </li>
            <li>
              <a className="submenu-link">Expense Claims</a>
            </li>
          </ul>
        </li>

        {/* Asset Management */}
        <li className={navHasSubmenu("asset")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "asset"}
            onClick={() => handleSectionToggle("asset")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-boxes-stacked" />
            </span>
            <span className="nav-text">Asset Management</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("asset")}>
            <li>
              <a className="submenu-link">Fixed Assets</a>
            </li>
            <li>
              <a className="submenu-link">Depreciation</a>
            </li>
          </ul>
        </li>

        {/* Reporting & Analytics */}
        <li className={navHasSubmenu("reporting")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "reporting"}
            onClick={() => handleSectionToggle("reporting")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-chart-bar" />
            </span>
            <span className="nav-text">Reporting &amp; Analytics</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("reporting")}>
            <li>
              <a className="submenu-link">Attendance Reports</a>
            </li>
            <li>
              <a className="submenu-link">Leave Trends</a>
            </li>
            <li>
              <a className="submenu-link">Payroll Summary</a>
            </li>
            <li>
              <a className="submenu-link">Employee Analytics</a>
            </li>
            <li>
              <a className="submenu-link">Custom Reports</a>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a href="#" className="nav-link">
            <span className="nav-icon">
              <i className="fa-solid fa-users-gear" />
            </span>
            Customer Management
          </a>
        </li>

        {/* Loan / EMI / Advance Module */}
        <li className={navHasSubmenu("loan")}>
          <button
            className="nav-toggle"
            aria-expanded={openSection === "loan"}
            onClick={() => handleSectionToggle("loan")}
          >
            <span className="nav-icon">
              <i className="fa-solid fa-hand-holding-dollar" />
            </span>
            <span className="nav-text">Loan / EMI / Advance Module</span>
            <span className="nav-caret">▸</span>
          </button>
          <ul className="submenu" aria-hidden={submenuHidden("loan")}>
            <li>
              <a className="submenu-link">Employee Loan Request</a>
            </li>
            <li>
              <a className="submenu-link">EMI Calculation</a>
            </li>
            <li>
              <a className="submenu-link">EMI Auto Deduction</a>
            </li>
            <li>
              <a className="submenu-link">Loan Balance Status</a>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a href="#" className="nav-link">
            <span className="nav-icon">
              <i className="fa-solid fa-gear" />
            </span>
            Settings
          </a>
        </li>

        <button
          className="nav-link logout-btn-mob"
          type="button"
          title="Log out"
          aria-label="Log out"
          onClick={async () => {
            try {
              await logoutUser(); // 🔥 call backend + clear storage
            } finally {
              onClose(); // close sidebar / menu
              window.location.href = "/"; // redirect
            }
          }}
        >
          <span className="nav-icon">
            <i className="fa-solid fa-right-from-bracket" />
          </span>
          Logout
        </button>
      </ul>
      {/* ================= USER PROFILE ================= */}
      <div
        className="user-profile"
        onClick={() => navigate("/admin/my-profile")} // ✅ NOW WORKS
        style={{ cursor: "pointer" }}
      >
        <div className="user-avatar">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            initials
          )}
        </div>

        <div className="user-info">
          <h4>{userName}</h4>
          <p>Admin</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
