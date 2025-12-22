import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/admin/LoginPage";
import ForgotPasswordPage from "./pages/admin/ForgotPasswordPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import DashboardPage from "./pages/admin/DashboardPage";
import DepartmentsPage from "./pages/admin/DepartmentsPage";
import DesignationPage from "./pages/admin/DesignationPage";
import AddDesignationPage from "./pages/admin/AddDesignationPage";
import UpdateDesignationPage from "./pages/admin/UpdateDesignationPage";
import AddDepartmentPage from "./pages/admin/AddDepartmentPage";
import UpdateDepartmentPage from "./pages/admin/UpdateDepartmentPage";
import EmploymentTypePage from "./pages/admin/EmploymentTypePage";
import AddEmploymentTypePage from "./pages/admin/AddEmploymentTypePage";
import UpdateEmploymentTypePage from "./pages/admin/UpdateEmploymentTypePage";
import CompanyRegistrationPage from "./pages/admin/CompanyRegistrationPage";
import AddEmployee from "./pages/admin/AddEmployee";
import EmployeeMasterDataPage from "./pages/admin/EmployeeMasterDataPage";
import EmploymentHistoryPage from "./pages/admin/EmploymentHistoryPage";
import EmployeeDocumentsPage from "./pages/admin/EmployeeDocumentsPage";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
<AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/registration" element={<CompanyRegistrationPage />} />
        <Route path="/admin/forget-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}/> 
        <Route path="/admin/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />
        <Route path="/admin/designations" element={<ProtectedRoute><DesignationPage /></ProtectedRoute>} />
        <Route path="/admin/add-designation" element={<ProtectedRoute><AddDesignationPage /></ProtectedRoute>} />
        <Route path="/admin/update-designation" element={<ProtectedRoute><UpdateDesignationPage /></ProtectedRoute>} />
        <Route path="/admin/add-department" element={<ProtectedRoute><AddDepartmentPage /></ProtectedRoute>}/> 
        <Route path="/admin/update-department" element={<ProtectedRoute><UpdateDepartmentPage /></ProtectedRoute>}/> 
        <Route path="/admin/employment-type" element={<ProtectedRoute><EmploymentTypePage /></ProtectedRoute>} />
        <Route path="/admin/add-employment-type" element={<ProtectedRoute><AddEmploymentTypePage /></ProtectedRoute>} />
        <Route path="/admin/update-employment-type" element={<ProtectedRoute><UpdateEmploymentTypePage /></ProtectedRoute>} />
        <Route path="/admin/add-employee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
        <Route path="/admin/employee-master" element={<ProtectedRoute><EmployeeMasterDataPage /></ProtectedRoute>}/>
        <Route path="/admin/employment-history" element={<ProtectedRoute><EmploymentHistoryPage /></ProtectedRoute>}/>
        <Route path="/admin/employee-documents" element={<ProtectedRoute><EmployeeDocumentsPage /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
