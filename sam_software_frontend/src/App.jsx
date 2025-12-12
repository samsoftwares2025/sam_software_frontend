import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/admin/LoginPage";
import ForgotPasswordPage from "./pages/admin/ForgotPasswordPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import DashboardPage from "./pages/admin/DashboardPage";
import DepartmentsPage from "./pages/admin/DepartmentsPage";
import AddDepartmentPage from "./pages/admin/AddDepartmentPage";
import EditDepartmentPage from "./pages/admin/UpdateDepartmentPage";
import CompanyRegistrationPage from "./pages/admin/CompanyRegistrationPage";
import AddEmployeePage from "./pages/admin/Add_employee";
import EmployeeMasterDataPage from "./pages/admin/EmployeeMasterDataPage";
import EmploymentHistoryPage from "./pages/admin/EmploymentHistoryPage";
import EmployeeDocumentsPage from "./pages/admin/EmployeeDocumentsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/registration" element={<CompanyRegistrationPage />} />
       
        <Route path="/admin/forget-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}/> 
        <Route path="/admin/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />
        <Route path="/admin/add-department" element={<ProtectedRoute><AddDepartmentPage /></ProtectedRoute>}/> 
        <Route path="/admin/update-department" element={<EditDepartmentPage />} />
        <Route path="/admin/add-employee" element={<AddEmployeePage />} />
        <Route
          path="/admin/employee-master"
          element={<EmployeeMasterDataPage />}
        />
        <Route
          path="/admin/employment-history"
          element={<EmploymentHistoryPage />}
        />
        <Route
          path="/admin/employee-documents"
          element={<EmployeeDocumentsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
