// src/pages/admin/AddEmployeePage.jsx
import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import AddEmployeeForm from "../../components/admin/employee/AddEmployeeForm";
import "../../assets/styles/admin.css";
import { createEmploye } from "../../api/admin/employees";

function AddEmployeePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  /* ======================================================
     FAILURE MODAL
  ====================================================== */
  const [showFailureModal, setShowFailureModal] = useState(false);

  const FailureModal = ({ onClose }) => (
    <div className="modal-overlay">
      <div className="modal-card error">
     
        <h2>❌ Failed to Add Employee</h2>
        <p>Something went wrong while creating the employee. Please try again.</p>

        <button className="btn btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );

  const handleMenuClick = () => setIsSidebarOpen((prev) => !prev);
  const handleOverlayClick = () => setIsSidebarOpen(false);

  /* ======================================================
     HANDLE FORM SUBMIT
  ====================================================== */
  const handleFormSubmit = async (formData) => {
    try {
      const userId = localStorage.getItem("userId");
      formData.append("user_id", userId);

      const response = await createEmploye(formData);

      // If backend returns success:false → Show modal
      if (!response?.success) {
        setShowFailureModal(true);
        return response;
      }

      return response; // Important for AddEmployeeForm success modal
    } catch (error) {
      console.error("Failed to create employee:", error);
      setShowFailureModal(true); // Show modal on exception
      return { success: false };
    }
  };

  /* ======================================================
     RENDER
  ====================================================== */
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

        <AddEmployeeForm mode="create" onSubmit={handleFormSubmit} />
      </main>

      {/* Sidebar dark overlay */}
      <div
        id="sidebarOverlay"
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        tabIndex={-1}
        aria-hidden={!isSidebarOpen}
        onClick={handleOverlayClick}
      />

      {/* Failure Modal */}
      {showFailureModal && (
        <FailureModal onClose={() => setShowFailureModal(false)} />
      )}
    </div>
  );
}

export default AddEmployeePage;
