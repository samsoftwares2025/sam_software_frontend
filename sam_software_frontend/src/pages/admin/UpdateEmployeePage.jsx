// src/pages/admin/UpdateEmployeePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import UpdateEmployeeForm from "../../components/admin/employee/UpdateEmployeeForm";

import "../../assets/styles/admin.css";
import {
  getEmployeeById,
  updateEmployee,
} from "../../api/admin/employees";

function UpdateEmployeePage() {
  /* ======================================================
     MODAL: UPDATE FAILURE
  ====================================================== */
  const [showFailureModal, setShowFailureModal] = useState(false);

  const FailureModal = ({ onClose }) => (
    <div className="modal-overlay">
      <div className="modal-card error">
        
        <h2>❌ Update Failed</h2>
        <p>Failed to update employee. Please try again.</p>

        <button className="btn btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );

  const { id } = useParams();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  /* ======================================================
     FETCH EMPLOYEE DATA
  ====================================================== */
  useEffect(() => {
    if (!id) {
      setError("Invalid employee id");
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        const resp = await getEmployeeById(id);

        const emp = resp?.employee;
        const documents = resp?.documents || [];
        const experiences = resp?.experiences || [];

        if (!emp) throw new Error("Employee not found");

        setInitialValues({
          id: emp.id,

          /* ---------- Personal Info ---------- */
          name: emp.name ?? "",
          date_of_birth: emp.date_of_birth ?? "",
          gender: emp.gender ?? "",
          personal_email: emp.personal_email ?? "",
          phone: emp.phone ?? "",
          qualification: emp.qualification ?? "",
          address: emp.address ?? "",
          country: emp.country ?? "",
          state: emp.state ?? "",
          city: emp.city ?? "",
          postal_code: emp.postal_code ?? "",
          image: emp.image ?? null,

          /* ---------- Employment ---------- */
          employee_id: emp.employee_id ?? "",
          official_email: emp.official_email ?? "",
          joining_date: emp.joining_date
            ? emp.joining_date.split("T")[0]
            : "",
          last_working_date: emp.last_working_date
            ? emp.last_working_date.split("T")[0]
            : "",

          employment_type_id: String(emp.employment_type_id ?? ""),
          department_id: String(emp.department_id ?? ""),
          designation_id: String(emp.designation_id ?? ""),
          parent_id: emp.parent_id ? String(emp.parent_id) : "",
          user_role_id: emp.user_role_id ? String(emp.user_role_id) : "",

          work_location: emp.work_location ?? "",
          is_active: emp.is_active,

          /* ---------- Compensation ---------- */
          annual_ctc: emp.annual_ctc ?? "",
          basic_salary: emp.basic_salary ?? "",
          variable_pay: emp.variable_pay ?? "",
          bank_name: emp.bank_name ?? "",
          account_number: emp.account_number ?? "",
          ifsc_code: emp.ifsc_code ?? "",

          /* ---------- Emergency ---------- */
          emergency_contact_name: emp.emergency_contact_name ?? "",
          emergency_contact_relationship:
            emp.emergency_contact_relationship ?? "",
          emergency_contact_number: emp.emergency_contact_number ?? "",
          emergency_contact_email: emp.emergency_contact_email ?? "",

          /* ---------- Additional ---------- */
          documents,
          experiences,
        });
      } catch (err) {
        console.error("❌ UpdateEmployeePage error:", err);
        setError("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  /* ======================================================
     SUBMIT HANDLER (WITH MODAL ON FAILURE)
  ====================================================== */
  const handleFormSubmit = async (formData) => {
    try {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        setShowFailureModal(true);
        return;
      }

      formData.append("id", id);
      formData.append("user_id", userId);

      const response = await updateEmployee(formData);

      // backend error response handling
      if (!response?.success) {
        setShowFailureModal(true);
        return;
      }

      navigate("/admin/employee-master");
    } catch (err) {
      console.error("❌ Failed to update employee:", err);
      setShowFailureModal(true); // SHOW MODAL INSTEAD OF ALERT
    }
  };

  /* ======================================================
     RENDER PAGE
  ====================================================== */
  return (
    <div className="container">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        openSection={openSection}
        setOpenSection={setOpenSection}
      />

      <main className="main">
        <Header onMenuClick={() => setIsSidebarOpen((p) => !p)} />

        <div className="page-header">
          <div className="page-title">
            <h3>Update Employee</h3>
            <p>Update employee profile</p>
          </div>
        </div>

        {loading && (
          <div style={{ padding: "2rem" }}>Loading employee data...</div>
        )}

        {!loading && error && (
          <div style={{ padding: "2rem", color: "orange" }}>{error}</div>
        )}

        {!loading && !error && initialValues && (
          <UpdateEmployeeForm
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
          />
        )}
      </main>

      {/* FAILURE MODAL */}
      {showFailureModal && (
        <FailureModal onClose={() => setShowFailureModal(false)} />
      )}
    </div>
  );
}

export default UpdateEmployeePage;
