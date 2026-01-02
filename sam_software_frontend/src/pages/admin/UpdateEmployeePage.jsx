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
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  /* ============================
     FETCH EMPLOYEE DATA
  ============================ */
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

        if (!emp) {
          throw new Error("Employee not found");
        }

        // ✅ PASS EVERYTHING THE FORM NEEDS
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
          image: emp.image ?? null, // 👈 profile photo

          /* ---------- Employment ---------- */
          employee_id: emp.employee_id ?? "",
          official_email: emp.official_email ?? "",
          joining_date: emp.joining_date ? emp.joining_date.split("T")[0]: "",

          employment_type_id: String(emp.employment_type_id ?? ""),
          department_id: String(emp.department_id ?? ""),
          designation_id: String(emp.designation_id ?? ""),
          parent_id: emp.parent_id ? String(emp.parent_id) : "",

          work_location: emp.work_location ?? "",

          /* ---------- Compensation ---------- */
          annual_ctc: emp.annual_ctc ?? "",
          basic_salary: emp.basic_salary ?? "",
          variable_pay: emp.variable_pay ?? "",
          bank_name: emp.bank_name ?? "",
          account_number: emp.account_number ?? "",
          ifsc_code: emp.ifsc_code ?? "",

          /* ---------- Emergency ---------- */
          emergency_contact_name:
            emp.emergency_contact_name ?? "",
          emergency_contact_relationship:
            emp.emergency_contact_relationship ?? "",
          emergency_contact_number:
            emp.emergency_contact_number ?? "",
          emergency_contact_email:
            emp.emergency_contact_email ?? "",

          /* ---------- Documents & Experience ---------- */
          documents,       // ✅ FIXED
          experiences,     // optional, future-proof
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

  /* ============================
     SUBMIT HANDLER
  ============================ */
  const handleFormSubmit = async (formData) => {
    try {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      // REQUIRED BY BACKEND
      formData.append("id", id);
      formData.append("user_id", userId);

      await updateEmployee(formData);

      navigate("/admin/employee-master");
    } catch (err) {
      console.error("❌ Failed to update employee:", err);
      alert("Failed to update employee. Please try again.");
    }
  };

  /* ============================
     RENDER
  ============================ */
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

        <div className="page-header">
          <div className="page-title">
            <h3>Update Employee</h3>
            <p>Update employee profile</p>
          </div>
        </div>

        {loading && (
          <div style={{ padding: "2rem" }}>
            Loading employee data...
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: "2rem", color: "orange" }}>
            {error}
          </div>
        )}

        {!loading && !error && initialValues && (
          <UpdateEmployeeForm
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
          />
        )}
      </main>
    </div>
  );
}

export default UpdateEmployeePage;
