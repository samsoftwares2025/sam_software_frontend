// src/components/admin/EmployeeForm.jsx
import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../../api/config"; // <-- adjust path if needed

// Default data for departments & designations
const defaultDepartments = [
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "hr", label: "HR" },
  { value: "sales", label: "Sales" },
  { value: "finance", label: "Finance" },
];

const defaultDesignationsByDept = {
  engineering: [
    "Software Engineer",
    "Senior Software Engineer",
    "Tech Lead",
    "Engineering Manager",
  ],
  marketing: ["Marketing Executive", "Marketing Manager", "SEO Specialist"],
  hr: ["HR Executive", "HR Manager"],
  sales: ["Sales Executive", "Sales Manager", "Account Manager"],
  finance: ["Accountant", "Finance Manager"],
};

function EmployeeForm({ onSubmit, onSuccess, initialValues = {}, mode = "create" }) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef(null);

  // Departments + Designations state
  const [departments, setDepartments] = useState(defaultDepartments);
  const [designationsByDept, setDesignationsByDept] = useState(defaultDesignationsByDept);

  const [selectedDepartment, setSelectedDepartment] = useState(initialValues.department || "");
  const [selectedDesignation, setSelectedDesignation] = useState(initialValues.designation || "");

  // NEW STATE: inline add fields instead of window.prompt
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [newDeptLabel, setNewDeptLabel] = useState("");

  const [isAddingDesig, setIsAddingDesig] = useState(false);
  const [newDesigLabel, setNewDesigLabel] = useState("");

  // Previous Work Experience State
  const [experienceList, setExperienceList] = useState(
    Array.isArray(initialValues.experienceList) && initialValues.experienceList.length > 0
      ? initialValues.experienceList
      : [{ company: "", title: "", start: "", end: "", responsibilities: "" }]
  );

  // Documents initial shape (includes files + previews arrays)
  const emptyDocument = () => ({
    type: "visa",
    number: "",
    country: "",
    issue_date: "",
    expiry_date: "",
    status: "valid",
    notes: "",
    files: [], // Array<File>
    previews: [], // Array<{name, url}>
  });

  const [documents, setDocuments] = useState(() => {
    if (Array.isArray(initialValues.documents) && initialValues.documents.length > 0) {
      // map initial docs but ensure files/previews keys exist
      return initialValues.documents.map((d) => ({ ...emptyDocument(), ...d, files: d.files || [], previews: d.previews || [] }));
    }
    return [emptyDocument()];
  });

  // keep a ref to documents for unmount cleanup
  const documentsRef = useRef(documents);
  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  // -----------------------
  // Document handlers
  // -----------------------
  const handleDocumentChange = (index, key, value) => {
    setDocuments((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  // Create previews for File[] and append to existing ones
  const makePreviews = (filesArray) =>
    Array.from(filesArray || []).map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));

  // Add/replace files for document: this appends new files (doesn't replace existing ones)
  const handleDocumentFilesChange = (index, fileList) => {
    const filesArray = Array.from(fileList || []);
    if (filesArray.length === 0) return;

    const newPreviews = makePreviews(filesArray);

    setDocuments((prev) => {
      const copy = [...prev];
      const doc = { ...copy[index] };
      doc.files = [...(doc.files || []), ...filesArray];
      doc.previews = [...(doc.previews || []), ...newPreviews];
      copy[index] = doc;
      return copy;
    });
  };

  const handleRemoveDocumentFile = (docIndex, fileIndex) => {
    setDocuments((prev) => {
      const copy = [...prev];
      const doc = { ...copy[docIndex] };
      if (doc.previews && doc.previews[fileIndex] && doc.previews[fileIndex].url) {
        try {
          URL.revokeObjectURL(doc.previews[fileIndex].url);
        } catch (e) {
          /* ignore revoke errors */
        }
      }
      doc.files = (doc.files || []).filter((_, i) => i !== fileIndex);
      doc.previews = (doc.previews || []).filter((_, i) => i !== fileIndex);
      copy[docIndex] = doc;
      return copy;
    });
  };

  const handleAddDocument = () => {
    setDocuments((prev) => [...prev, emptyDocument()]);
  };

  const handleRemoveDocument = (index) => {
    // revoke previews for removed doc
    setDocuments((prev) => {
      const copy = [...prev];
      const removed = copy.splice(index, 1)[0];
      if (removed && removed.previews) {
        removed.previews.forEach((p) => {
          try {
            URL.revokeObjectURL(p.url);
          } catch (e) {}
        });
      }
      return copy;
    });
  };

  // -----------------------
  // Experience handlers
  // -----------------------
  const handleAddExperience = () => {
    setExperienceList((prev) => [
      ...prev,
      { company: "", title: "", start: "", end: "", responsibilities: "" },
    ]);
  };

  const handleRemoveExperience = (index) => {
    setExperienceList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index, field, value) => {
    setExperienceList((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  // effects for initial values
  useEffect(() => {
    if (initialValues.photo) {
      setPhotoPreview(initialValues.photo);
    }
  }, [initialValues.photo]);

  useEffect(() => {
    if (initialValues.department) setSelectedDepartment(initialValues.department);
  }, [initialValues.department]);

  useEffect(() => {
    if (initialValues.designation) setSelectedDesignation(initialValues.designation);
  }, [initialValues.designation]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setPhotoPreview(event.target.result);
    reader.readAsDataURL(file);
  };

  // Department / Designation handlers (unchanged)
  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    if (value === "__add_dept__") {
      setIsAddingDept(true);
      setNewDeptLabel("");
      return;
    }
    setIsAddingDept(false);
    setSelectedDepartment(value);
    setSelectedDesignation("");
  };

  const handleConfirmAddDepartment = () => {
    const label = newDeptLabel.trim();
    if (!label) return;
    const value = label.toLowerCase().replace(/\s+/g, "_");
    setDepartments((prev) => {
      if (prev.some((d) => d.value === value)) return prev;
      return [...prev, { value, label }];
    });
    setDesignationsByDept((prev) => ({ ...prev, [value]: prev[value] || [] }));
    setSelectedDepartment(value);
    setSelectedDesignation("");
    setIsAddingDept(false);
    setNewDeptLabel("");
  };

  const handleCancelAddDepartment = () => {
    setIsAddingDept(false);
    setNewDeptLabel("");
    if (!selectedDepartment) setSelectedDepartment("");
  };

  const handleDesignationChange = (e) => {
    const value = e.target.value;
    if (value === "__add_desig__") {
      setIsAddingDesig(true);
      setNewDesigLabel("");
      return;
    }
    setIsAddingDesig(false);
    setSelectedDesignation(value);
  };

  const handleConfirmAddDesignation = () => {
    if (!selectedDepartment) return;
    const newDesignation = newDesigLabel.trim();
    if (!newDesignation) return;
    setDesignationsByDept((prev) => {
      const existing = prev[selectedDepartment] || [];
      if (existing.includes(newDesignation)) return prev;
      return { ...prev, [selectedDepartment]: [...existing, newDesignation] };
    });
    setSelectedDesignation(newDesignation);
    setIsAddingDesig(false);
    setNewDesigLabel("");
  };

  const handleCancelAddDesignation = () => {
    setIsAddingDesig(false);
    setNewDesigLabel("");
    if (!selectedDesignation) setSelectedDesignation("");
  };

  const refreshDepartments = () => {
    setDepartments(defaultDepartments);
    setSelectedDepartment("");
    setIsAddingDept(false);
  };

  const refreshDesignations = () => {
    setDesignationsByDept(defaultDesignationsByDept);
    setSelectedDesignation("");
    setIsAddingDesig(false);
  };

  // Submit: append experience_list, documents (metadata) and files
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // include experienceList in request as JSON
    formData.append("experience_list", JSON.stringify(experienceList));

    // prepare document metadata (omit file objects & previews)
    const docsMeta = documents.map(({ files, previews, ...rest }) => rest);
    formData.append("documents", JSON.stringify(docsMeta));

    // append files for each document as documents_files_<index>[]
    documents.forEach((doc, docIndex) => {
      (doc.files || []).forEach((file) => {
        formData.append(`documents_files_${docIndex}[]`, file, file.name);
      });
    });

    if (onSubmit) onSubmit(formData);

    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/`, {
        method: mode === "edit" ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Backend error:", await response.text());
        alert("Failed to save employee (backend error). Check console.");
        return;
      }

      const data = await response.json();
      console.log("Employee saved:", data);

      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) onSuccess();
      }, 3000);
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Is Django running?");
    }
  };

  // Reset: clear form inputs + revoke previews
  const handleReset = () => {
    if (formRef.current) formRef.current.reset();

    // revoke previews
    (documentsRef.current || []).forEach((d) => (d.previews || []).forEach((p) => {
      try { URL.revokeObjectURL(p.url); } catch (e) {}
    }));

    setPhotoPreview(null);
    setSelectedDepartment(initialValues.department || "");
    setSelectedDesignation(initialValues.designation || "");
    setIsAddingDept(false);
    setIsAddingDesig(false);
    setNewDeptLabel("");
    setNewDesigLabel("");
    setExperienceList(
      Array.isArray(initialValues.experienceList) && initialValues.experienceList.length > 0
        ? initialValues.experienceList
        : [{ company: "", title: "", start: "", end: "", responsibilities: "" }]
    );
    setDocuments(
      Array.isArray(initialValues.documents) && initialValues.documents.length > 0
        ? initialValues.documents.map((d) => ({ ...emptyDocument(), ...d, files: d.files || [], previews: d.previews || [] }))
        : [emptyDocument()]
    );
  };

  // cleanup on unmount: revoke any remaining object URLs
  useEffect(() => {
    return () => {
      (documentsRef.current || []).forEach((d) => (d.previews || []).forEach((p) => {
        try { URL.revokeObjectURL(p.url); } catch (e) {}
      }));
    };
  }, []);

  return (
    <>
      <div className={`success-message ${showSuccess ? "show" : ""}`}>
        <i className="fa-solid fa-check-circle" />
        {mode === "edit" ? "Employee updated successfully!" : "Employee added successfully!"}
      </div>

      <form className="form-container" id="employeeForm" onSubmit={handleSubmit} ref={formRef}>
        {/* Personal Information */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fa-solid fa-user" />
            Personal Information
          </h2>

          <div className="form-group full-width">
            <div className="photo-upload">
              <div className="photo-preview" id="photoPreview">
                {photoPreview ? <img src={photoPreview} alt="Employee" /> : <i className="fa-solid fa-user" />}
              </div>
              <div>
                <label htmlFor="photoUpload" className="upload-btn">
                  <i className="fa-solid fa-upload" /> Upload Photo
                </label>
                <input type="file" id="photoUpload" className="file-input" accept="image/*" name="photo" onChange={handlePhotoChange} />
              </div>
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: 20 }}>
            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <input type="text" className="form-input" name="full_name" required defaultValue={initialValues.first_name || ""} />
            </div>

            <div className="form-group">
              <label className="form-label required">Date of Birth</label>
              <input type="date" className="form-input" name="dob" required defaultValue={initialValues.dob || ""} />
            </div>
            <div className="form-group">
              <label className="form-label required">Gender</label>
              <select className="form-select" name="gender" required defaultValue={initialValues.gender || ""}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label required">Personal Email</label>
              <input type="email" className="form-input" name="personal_email" required defaultValue={initialValues.personal_email || ""} />
            </div>
            <div className="form-group">
              <label className="form-label required">Phone Number</label>
              <input type="tel" className="form-input" name="phone" required defaultValue={initialValues.phone || ""} />
            </div>
            <div className="form-group">
              <label className="form-label required">Qualification</label>
              <input type="text" className="form-input" name="qualification" required defaultValue={initialValues.last_name || ""} />
            </div>
          </div>

          <div className="form-group full-width" style={{ marginTop: 20 }}>
            <label className="form-label required">Address</label>
            <textarea className="form-textarea" name="address" required defaultValue={initialValues.address || ""}></textarea>
          </div>
        </div>

        {/* Employment Details */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fa-solid fa-briefcase" />
            Employment Details
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label required">Employee ID</label>
              <input type="text" className="form-input" name="employee_id" required defaultValue={initialValues.employee_id || ""} />
            </div>
            <div className="form-group">
              <label className="form-label required">Company Email</label>
              <input type="email" className="form-input" name="company_email" required defaultValue={initialValues.company_email || ""} />
            </div>
            <div className="form-group">
              <label className="form-label required">Joining Date</label>
              <input type="date" className="form-input" name="joining_date" required defaultValue={initialValues.joining_date || ""} />
            </div>
            <div className="form-group">
              <label className="form-label required">Employment Type</label>
              <select className="form-select" name="employment_type" defaultValue={initialValues.employment_type || ""} required>
                <option value="">Select Type</option>
                <option value="fulltime">Full-Time</option>
                <option value="parttime">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>

            {/* Department with "Add Department" option + Refresh button */}
            <div className="form-group">
              <label className="form-label required">Department</label>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <select
                  className="form-select"
                  name="department"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                  <option value="__add_dept__">+ Add Department</option>
                </select>

                <button
                  type="button"
                  className="btn btn-icon"
                  onClick={refreshDepartments}
                  title="Refresh Department List"
                  style={{
                    background: "#f1f1f1",
                    border: "1px solid #ccc",
                    padding: "0 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
              </div>

              {isAddingDept && (
                <div className="inline-add-group" style={{ marginTop: 8 }}>
                  <input type="text" className="form-select" placeholder="Enter new department" value={newDeptLabel} onChange={(e) => setNewDeptLabel(e.target.value)} style={{ width: "100%" }} />

                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button type="button" className="btn btn-primary" onClick={handleConfirmAddDepartment}>
                      Save
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelAddDepartment}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Designation with "Add Designation" option + Refresh button */}
            <div className="form-group">
              <label className="form-label required">Designation</label>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <select
                  className="form-select"
                  name="designation"
                  required
                  value={selectedDesignation}
                  onChange={handleDesignationChange}
                  disabled={!selectedDepartment}
                  style={{ flex: 1 }}
                >
                  <option value="">{selectedDepartment ? "Select Designation" : "Select Department first"}</option>
                  {(designationsByDept[selectedDepartment] || []).map((desig) => (
                    <option key={desig} value={desig}>
                      {desig}
                    </option>
                  ))}
                  {selectedDepartment && <option value="__add_desig__">+ Add Designation</option>}
                </select>

                <button type="button" className="btn btn-icon" onClick={refreshDesignations} title="Refresh Designation List" style={{ background: "#f1f1f1", border: "1px solid #ccc", padding: "0 12px", borderRadius: 6, cursor: "pointer", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
              </div>

              {isAddingDesig && (
                <div className="inline-add-group" style={{ marginTop: 8 }}>
                  <input type="text" className="form-select" placeholder="Enter new designation" value={newDesigLabel} onChange={(e) => setNewDesigLabel(e.target.value)} style={{ width: "100%" }} />

                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button type="button" className="btn btn-primary" onClick={handleConfirmAddDesignation}>
                      Save
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelAddDesignation}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label required">Reporting Manager</label>
              <select className="form-select" name="manager" defaultValue={initialValues.manager || ""} required>
                <option value="">Select Manager</option>
                <option value="john">John Smith - Engineering Lead</option>
                <option value="sarah">Sarah Johnson - Marketing Director</option>
                <option value="mike">Mike Davis - HR Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label required">Work Location</label>
              <select className="form-select" name="location" defaultValue={initialValues.location || ""} required>
                <option value="">Select Location</option>
                <option value="hq">Head Office - New York</option>
                <option value="remote">Remote</option>
                <option value="branch1">Branch Office - California</option>
                <option value="branch2">Branch Office - Texas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visa & Pro Work */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fa-solid fa-passport" />
            Visa &amp; Pro Work
          </h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label required">Citizenship / Nationality</label>
              <select className="form-select" name="citizenship" defaultValue={initialValues.citizenship || ""} required>
                <option value="">Select Citizenship / Nationality</option>
                <option value="usa">United States</option>
                <option value="india">India</option>
                <option value="uk">United Kingdom</option>
                <option value="canada">Canada</option>
                <option value="germany">Germany</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Passport Number</label>
              <input type="text" className="form-input" name="passport_number" required defaultValue={initialValues.passport_number || ""} />
            </div>

            <div className="form-group">
              <label className="form-label required">Visa / Permit Type</label>
              <select className="form-select" name="visa_type" defaultValue={initialValues.visa_type || ""} required>
                <option value="">Select Visa / Permit Type</option>
                <option value="h1b">H1B</option>
                <option value="l1">L1</option>
                <option value="b1b2">B1/B2</option>
                <option value="work_permit">Work Permit</option>
                <option value="ict">Intra-company Transfer</option>
                <option value="resident">Resident Permit</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Visa / Permit Number</label>
              <input type="text" className="form-input" name="visa_number" required defaultValue={initialValues.visa_number || ""} />
            </div>

            <div className="form-group">
              <label className="form-label required">Country of Work (Visa)</label>
              <select className="form-select" name="visa_country" defaultValue={initialValues.visa_country || ""} required>
                <option value="">Select Country of Work</option>
                <option value="usa">United States</option>
                <option value="india">India</option>
                <option value="uk">United Kingdom</option>
                <option value="canada">Canada</option>
                <option value="germany">Germany</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Visa Issue Date</label>
              <input type="date" className="form-input" name="visa_issue_date" required defaultValue={initialValues.visa_issue_date || ""} />
            </div>

            <div className="form-group">
              <label className="form-label required">Visa Expiry Date</label>
              <input type="date" className="form-input" name="visa_expiry_date" required defaultValue={initialValues.visa_expiry_date || ""} />
            </div>

            <div className="form-group">
              <label className="form-label required">Visa Status</label>
              <select className="form-select" name="visa_status" defaultValue={initialValues.visa_status || ""} required>
                <option value="">Select Status</option>
                <option value="valid">Valid</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="applied">Applied</option>
                <option value="not_required">Not Required</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width" style={{ marginTop: 20 }}>
            <label className="form-label">Visa / Pro Work Notes</label>
            <textarea className="form-textarea" name="visa_notes" rows={3} placeholder="Any additional notes on visa processing, PRO work, dependents, renewal reminders, etc." defaultValue={initialValues.visa_notes || ""}></textarea>
          </div>
        </div>

        {/* Documents (dynamic) */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fa-solid fa-passport"></i>
            Visa / License / Passport Documents
          </h2>

          {(documents || []).map((doc, index) => (
            <div key={index} className="exp-block" style={{ border: "1px solid #ddd", padding: 15, borderRadius: 8, marginBottom: 15, background: "#fafafa" }}>
              <h3 style={{ marginBottom: 10 }}>Document {index + 1}</h3>

              <div className="form-grid">
                {/* Document Type */}
                <div className="form-group">
                  <label className="form-label required">Document Type</label>
                  <select className="form-select" value={doc.type} onChange={(e) => handleDocumentChange(index, "type", e.target.value)} required>
                    <option value="visa">Visa</option>
                    <option value="license">License</option>
                    <option value="passport">Passport</option>
                    <option value="id">National ID</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Document Number */}
                <div className="form-group">
                  <label className="form-label required">Document Number</label>
                  <input type="text" className="form-input" value={doc.number} onChange={(e) => handleDocumentChange(index, "number", e.target.value)} required />
                </div>

                {/* Country */}
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select className="form-select" value={doc.country} onChange={(e) => handleDocumentChange(index, "country", e.target.value)}>
                    <option value="">Select Country</option>
                    <option value="usa">United States</option>
                    <option value="india">India</option>
                    <option value="uk">United Kingdom</option>
                    <option value="canada">Canada</option>
                    <option value="germany">Germany</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Issue Date */}
                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input type="date" className="form-input" value={doc.issue_date} onChange={(e) => handleDocumentChange(index, "issue_date", e.target.value)} />
                </div>

                {/* Expiry Date */}
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input type="date" className="form-input" value={doc.expiry_date} onChange={(e) => handleDocumentChange(index, "expiry_date", e.target.value)} />
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={doc.status} onChange={(e) => handleDocumentChange(index, "status", e.target.value)}>
                    <option value="valid">Valid</option>
                    <option value="expiring_soon">Expiring Soon</option>
                    <option value="expired">Expired</option>
                    <option value="applied">Applied</option>
                    <option value="not_required">Not Required</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="form-group full-width" style={{ marginTop: 12 }}>
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" rows={3} value={doc.notes} onChange={(e) => handleDocumentChange(index, "notes", e.target.value)}></textarea>
              </div>

              {/* File upload (multiple) */}
              <div className="form-group full-width" style={{ marginTop: 12 }}>
                <label className="form-label">Upload Scans / Images</label>

                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={(e) => handleDocumentFilesChange(index, e.target.files)}
                  className="form-input"
                  style={{ marginTop: 8 }}
                />

                {/* previews */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  {(doc.previews || []).map((p, fi) => {
                    const isPdf = doc.files && doc.files[fi] && doc.files[fi].type === "application/pdf";
                    return (
                      <div key={fi} style={{ width: 110, border: "1px solid #ddd", borderRadius: 6, padding: 6, background: "#fff", position: "relative" }}>
                        {isPdf ? (
                          <div style={{ fontSize: 12, wordBreak: "break-word", height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {doc.files[fi]?.name}
                          </div>
                        ) : (
                          <img src={p.url} alt={doc.files[fi]?.name || "preview"} style={{ width: "100%", height: 64, objectFit: "cover", borderRadius: 4 }} />
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveDocumentFile(index, fi)}
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "2px 6px",
                            cursor: "pointer",
                          }}
                          title="Remove image"
                        >
                          ✕
                        </button>

                        <div style={{ fontSize: 11, marginTop: 6, textAlign: "center", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {doc.files[fi]?.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Remove Button */}
              {documents.length > 1 && (
                <button type="button" className="btn btn-secondary" onClick={() => handleRemoveDocument(index)}>
                  <i className="fa-solid fa-trash"></i> Remove Document
                </button>
              )}
            </div>
          ))}

          {/* Add Button */}
          <button type="button" className="btn btn-primary" onClick={handleAddDocument}>
            <i className="fa-solid fa-plus"></i> Add Document
          </button>
        </div>

        {/* Compensation */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fa-solid fa-money-bill-wave" />
            Compensation Details
          </h2>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label required">Annual CTC</label>
              <input type="number" className="form-input" name="ctc" required placeholder="$" defaultValue={initialValues.ctc || ""} />
            </div>
            <div className="form-group">
              <label className="form-label required">Basic Salary</label>
              <input type="number" className="form-input" name="basic_salary" required placeholder="$" defaultValue={initialValues.basic_salary || ""} />
            </div>
            <div className="form-group">
              <label className="form-label">Variable Pay</label>
              <input type="number" className="form-input" name="variable_pay" placeholder="$" defaultValue={initialValues.variable_pay || ""} />
            </div>
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input type="text" className="form-input" name="bank_name" defaultValue={initialValues.bank_name || ""} />
            </div>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input type="text" className="form-input" name="account_number" defaultValue={initialValues.account_number || ""} />
            </div>
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input type="text" className="form-input" name="ifsc_code" defaultValue={initialValues.ifsc_code || ""} />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="form-section">
          <h2 className="section-title">
            <i className="fa-solid fa-phone" />
            Emergency Contact
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label required">Contact Name</label>
              <input type="text" className="form-input" name="emergency_name" required defaultValue={initialValues.emergency_name || ""} />
            </div>
            <div className="form-group">
              <label className="form-label required">Relationship</label>
              <input type="text" className="form-input" name="emergency_relation" required defaultValue={initialValues.emergency_relation || ""} />
            </div>
            <div className="form-group">
              <label className="form-label required">Phone Number</label>
              <input type="tel" className="form-input" name="emergency_phone" required defaultValue={initialValues.emergency_phone || ""} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" name="emergency_email" defaultValue={initialValues.emergency_email || ""} />
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            <i className="fa-solid fa-rotate-left" />
            Reset
          </button>
          <button type="submit" className="btn btn-primary">
            <i className="fa-solid fa-check" />
            {mode === "edit" ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </form>
    </>
  );
}

export default EmployeeForm;
