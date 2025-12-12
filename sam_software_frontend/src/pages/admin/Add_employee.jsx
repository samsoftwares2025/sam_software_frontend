// src/pages/admin/AddEmployeePage.jsx
import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import EmployeeForm from "../../components/admin/EmployeeForm";
import "../../assets/styles/admin.css";

function AddEmployeePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  const handleMenuClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  const handleFormSubmit = (formData) => {
    console.log("Employee Data:", Object.fromEntries(formData.entries()));
    // here you can call API, etc.
  };

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

        {/* <div className="the_line" /> */}

        <div className="page-header">
          <div className="page-title">
            <h3>Add New Employee</h3>
            <p>Fill in the employee details to create a new profile</p>
          </div>

          <button id="addEmployeeBtn" type="button">
            <i className="fa-solid fa-user-plus" />
            Import Excel
          </button>
        </div>

        <EmployeeForm
          mode="create"
          onSubmit={handleFormSubmit}
        />
      </main>

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

export default AddEmployeePage;
