import React, { useEffect, useState } from "react";
import "../../../assets/styles/admin.css";
import Select from "react-select";

import { checkUserFieldExists } from "../../../api/admin/checkUserField";

import { getUserRoles, createRole } from "../../../api/admin/roles";
import {
  getDepartments,
  createDepartment,
} from "../../../api/admin/departments";
import {
  getDesignations,
  createDesignation,
} from "../../../api/admin/designations";
import {
  getEmployementTypes,
  createEmployementType,
} from "../../../api/admin/employement_type";
import { getEmployeesList } from "../../../api/admin/employees";

export default function EmploymentSection({
  initialValues = {},
  mode = "add",
  selectedEmploymentType,
  setSelectedEmploymentType,
  selectedDepartment,
  setSelectedDepartment,
  selectedDesignation,
  setSelectedDesignation,
  selectedRoleId,
  setSelectedRoleId,
  setFormErrors, // ✅ ADDED HERE
}) {
  const [status, setStatus] = useState("active");

  const [errors, setErrors] = useState({
    employee_id: "",
    official_email: "",
  });

  /* ================= EMPLOYMENT TYPE ================= */
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [isAddingEmploymentType, setIsAddingEmploymentType] = useState(false);
  const [newEmploymentTypeName, setNewEmploymentTypeName] = useState("");

  const [employees, setEmployees] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState("");

  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: `${emp.name} (${emp.employee_id})`,
  }));

  /* ================= ROLES ================= */
  const [roles, setRoles] = useState([]);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  useEffect(() => {
    if (initialValues?.parent_id && employees.length > 0) {
      setSelectedParentId(String(initialValues.parent_id));
    }
  }, [initialValues, employees]);

  useEffect(() => {
    if (initialValues?.user_role_id && roles.length > 0) {
      setSelectedRoleId(String(initialValues.user_role_id));
    }
  }, [initialValues, roles]);

  const fetchEmploymentTypes = async () => {
    const resp = await getEmployementTypes();
    const list = Array.isArray(resp?.employment_types)
      ? resp.employment_types
      : Array.isArray(resp)
      ? resp
      : [];
    setEmploymentTypes(list);
  };

  useEffect(() => {
    fetchEmploymentTypes();
  }, []);

  const handleEmploymentTypeChange = (e) => {
    const val = e.target.value;
    if (val === "__add_employment_type__") {
      setIsAddingEmploymentType(true);
      return;
    }
    setSelectedEmploymentType(val);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const list = await getEmployeesList();
        setEmployees(list);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };

    fetchEmployees();
  }, []);

  const handleConfirmAddEmploymentType = async () => {
    if (!newEmploymentTypeName.trim()) return;
    const res = await createEmployementType(newEmploymentTypeName.trim());
    await fetchEmploymentTypes();
    setSelectedEmploymentType(String(res.id));
    setIsAddingEmploymentType(false);
    setNewEmploymentTypeName("");
  };

  const handleRoleChange = (e) => {
    const val = e.target.value;

    if (val === "__add_role__") {
      setIsAddingRole(true);
      return;
    }

    setSelectedRoleId(val);
  };

  const handleConfirmAddRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      const res = await createRole(newRoleName.trim());

      const refreshed = await getUserRoles();
      if (refreshed?.success) {
        setRoles(refreshed.user_roles || []);
      }

      setSelectedRoleId(String(res.id));
      setIsAddingRole(false);
      setNewRoleName("");
    } catch (err) {
      console.error("Failed to create role", err);
    }
  };

  /* ================= DEPARTMENT / DESIGNATION ================= */
  const [departments, setDepartments] = useState([]);
  const [designationsByDept, setDesignationsByDept] = useState({});
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [newDeptLabel, setNewDeptLabel] = useState("");
  const [isAddingDesig, setIsAddingDesig] = useState(false);
  const [newDesigLabel, setNewDesigLabel] = useState("");

  const fetchDepartments = async () => {
    const res = await getDepartments();
    const list = Array.isArray(res) ? res : res?.departments || [];
    setDepartments(list.map((d) => ({ value: d.id, label: d.name })));
  };

  const fetchDesignations = async () => {
    const res = await getDesignations();
    const list = Array.isArray(res) ? res : res?.designations || [];
    const grouped = {};
    list.forEach((d) => {
      if (!grouped[d.department_id]) grouped[d.department_id] = [];
      grouped[d.department_id].push(d);
    });
    setDesignationsByDept(grouped);
  };

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);

  const handleDepartmentChange = (e) => {
    const val = e.target.value;
    if (val === "__add_dept__") {
      setIsAddingDept(true);
      return;
    }
    setSelectedDepartment(val);
    setSelectedDesignation("");
  };

  const handleDesignationChange = (e) => {
    const val = e.target.value;
    if (val === "__add_desig__") {
      setIsAddingDesig(true);
      return;
    }
    setSelectedDesignation(val);
  };

  const handleConfirmAddDepartment = async () => {
    if (!newDeptLabel.trim()) return;
    const res = await createDepartment(newDeptLabel.trim());
    await fetchDepartments();
    setSelectedDepartment(String(res.id));
    setIsAddingDept(false);
    setNewDeptLabel("");
  };

  const handleConfirmAddDesignation = async () => {
    if (!newDesigLabel.trim() || !selectedDepartment) return;
    const res = await createDesignation({
      name: newDesigLabel.trim(),
      department_id: Number(selectedDepartment),
    });
    await fetchDesignations();
    setSelectedDesignation(String(res.id));
    setIsAddingDesig(false);
    setNewDesigLabel("");
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getUserRoles();
        if (res?.success) {
          setRoles(res.user_roles || []);
        }
      } catch (err) {
        console.error("Failed to load roles", err);
      }
    };

    fetchRoles();
  }, []);

  /* ====================================================================
     🔥 DUPLICATION CHECKS — now forwarded to parent via setFormErrors()
     ==================================================================== */

  const updateErrorState = (field, value) => {
    // internal component error
    setErrors((prev) => ({
      ...prev,
      [field]: value,
    }));

    // send error to parent (modal)
    setFormErrors((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ================= RENDER ================= */
  return (
    <div className="form-section">
      <h2 className="section-title">
        <i className="fa-solid fa-briefcase" /> Employment Details
      </h2>

      <div className="form-grid">
        {/* =======================================
            🔥 EMPLOYEE ID (DUPLICATION CHECK)
        ======================================== */}
        <div className={`form-group ${errors.employee_id ? "has-error" : ""}`}>
          <div className="label-row">
            <label className="form-label required">
              Employee ID{" "}
              {errors.employee_id && (
                <span className="inline-error">{errors.employee_id}</span>
              )}
            </label>
          </div>

          <input
            className={`form-input ${errors.employee_id ? "input-error" : ""}`}
            name="employee_id"
            defaultValue={initialValues.employee_id || ""}
            onChange={async (e) => {
              const empId = e.target.value.trim();

              if (empId.length > 2) {
                try {
                  const res = await checkUserFieldExists(
                    "employee_id",
                    empId,
                    initialValues?.id || ""
                  );

                  updateErrorState(
                    "employee_id",
                    res.success ? "" : "already exists!"
                  );
                } catch (err) {
                  console.error("Employee ID duplicate check failed:", err);
                }
              } else {
                updateErrorState("employee_id", "");
              }
            }}
            required
          />
        </div>

        {/* =======================================
            🔥 COMPANY EMAIL (DUPLICATION CHECK)
        ======================================== */}
        <div
          className={`form-group ${errors.official_email ? "has-error" : ""}`}
        >
          <div className="label-row">
            <label className="form-label required">
              Company Email{" "}
              {errors.official_email && (
                <span className="inline-error">{errors.official_email}</span>
              )}
            </label>
          </div>

          <input
            type="email"
            className={`form-input ${
              errors.official_email ? "input-error" : ""
            }`}
            name="official_email"
            defaultValue={initialValues.official_email || ""}
            onChange={async (e) => {
              const email = e.target.value.trim();

              if (email.length > 3) {
                try {
                  const res = await checkUserFieldExists(
                    "official_email",
                    email,
                    initialValues?.id || ""
                  );

                  updateErrorState(
                    "official_email",
                    res.success ? "" : "already exists!"
                  );
                } catch (err) {
                  console.error("Official email duplicate check failed:", err);
                }
              } else {
                updateErrorState("official_email", "");
              }
            }}
            required
          />
        </div>

        {/* Joining Date */}
        <div className="form-group">
          <label className="form-label required">Joining Date</label>
          <input
            type="date"
            className="form-input"
            name="joining_date"
            defaultValue={initialValues.joining_date || ""}
            required
          />
        </div>

        {/* Employment Type */}
        <div className="form-group">
          <label className="form-label required">Employment Type</label>

          <div style={{ display: "flex", gap: 8 }}>
            <select
              className="form-select"
              value={selectedEmploymentType}
              onChange={handleEmploymentTypeChange}
              required
              style={{ flex: 1 }}
            >
              <option value="">Select Employment Type</option>
              {employmentTypes.map((et) => (
                <option key={et.id} value={et.id}>
                  {et.name}
                </option>
              ))}
              <option value="__add_employment_type__">
                + Add Employment Type
              </option>
            </select>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchEmploymentTypes}
            >
              <i className="fa-solid fa-rotate-right" />
            </button>
          </div>

          {isAddingEmploymentType && (
            <div className="form-group">
              <input
                className="form-input"
                placeholder="Enter new employment type"
                value={newEmploymentTypeName}
                onChange={(e) => setNewEmploymentTypeName(e.target.value)}
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmAddEmploymentType}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddingEmploymentType(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Department */}
        <div className="form-group">
          <label className="form-label required">Department</label>

          <div style={{ display: "flex", gap: 8 }}>
            <select
              className="form-select"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              required
              style={{ flex: 1 }}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
              <option value="__add_dept__">+ Add Department</option>
            </select>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchDepartments}
            >
              <i className="fa-solid fa-rotate-right" />
            </button>
          </div>

          {isAddingDept && (
            <div className="form-group">
              <input
                className="form-input"
                placeholder="Enter new department"
                value={newDeptLabel}
                onChange={(e) => setNewDeptLabel(e.target.value)}
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmAddDepartment}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddingDept(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Designation */}
        <div className="form-group">
          <label className="form-label required">Designation</label>

          <div style={{ display: "flex", gap: 8 }}>
            <select
              className="form-select"
              value={selectedDesignation}
              onChange={handleDesignationChange}
              disabled={!selectedDepartment}
              required
              style={{ flex: 1 }}
            >
              <option value="">
                {selectedDepartment
                  ? "Select Designation"
                  : "Select Department first"}
              </option>

              {(designationsByDept[selectedDepartment] || []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}

              {selectedDepartment && (
                <option value="__add_desig__">+ Add Designation</option>
              )}
            </select>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchDesignations}
              disabled={!selectedDepartment}
            >
              <i className="fa-solid fa-rotate-right" />
            </button>
          </div>

          {isAddingDesig && (
            <div className="form-group">
              <input
                className="form-input"
                placeholder="Enter new designation"
                value={newDesigLabel}
                onChange={(e) => setNewDesigLabel(e.target.value)}
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmAddDesignation}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddingDesig(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reporting Manager */}
        <div className="form-group">
          <label className="form-label">Reporting Manager</label>

          <Select
            options={employeeOptions}
            isClearable
            placeholder="Search & select manager..."
            value={employeeOptions.find(
              (opt) => opt.value === Number(selectedParentId)
            )}
            onChange={(option) =>
              setSelectedParentId(option ? option.value : "")
            }
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label className="form-label required">Role</label>

          <div style={{ display: "flex", gap: 8 }}>
            <select
              className="form-select"
              value={selectedRoleId}
              onChange={handleRoleChange}
              required
              style={{ flex: 1 }}
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.role}
                </option>
              ))}
              <option value="__add_role__">+ Add Role</option>
            </select>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                const res = await getUserRoles();
                if (res?.success) {
                  setRoles(res.user_roles || []);
                }
              }}
            >
              <i className="fa-solid fa-rotate-right" />
            </button>
          </div>

          {isAddingRole && (
            <div className="form-group">
              <input
                className="form-input"
                placeholder="Enter new role"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmAddRole}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddingRole(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        {mode === "edit" && (
          <div className="form-group">
            <label className="form-label required">Status</label>

            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
