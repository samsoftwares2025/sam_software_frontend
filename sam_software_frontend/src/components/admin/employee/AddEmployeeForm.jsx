import React, { useRef, useState, useEffect } from "react";

import PersonalInfoSection from "./PersonalInfoSection";
import EmploymentSection from "./EmploymentSection";
import DocumentsSection from "./DocumentsSection";
import CompensationSection from "./CompensationSection";
import EmergencyContactSection from "./EmergencyContactSection";
import PreviousExperienceSection from "./PreviousExperienceSection";
import "../../../assets/styles/admin.css";

import { getEmployementTypes } from "../../../api/admin/employement_type";
import { getDepartments } from "../../../api/admin/departments";
import { getDesignations } from "../../../api/admin/designations";

/* ================= SUCCESS MODAL ================= */
const SuccessModal = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-card">
      <div className="success-icon">
        <i className="fa-solid fa-circle-check"></i>
      </div>
      <h2>Employee Added Successfully</h2>
      <p>The employee has been added to the system.</p>
      <button className="btn btn-primary" onClick={onClose}>
        OK
      </button>
    </div>
  </div>
);

/* ================= ERROR MODAL ================= */
const ErrorModal = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-card error">
      <div className="error-icon">
        <i className="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h2>⚠️ Validation Error</h2>
      <p>Fix the highlighted duplicate fields before submitting.</p>
      <button className="btn btn-primary" onClick={onClose}>
        OK
      </button>
    </div>
  </div>
);

export default function AddEmployeeForm({ onSubmit }) {
  const formRef = useRef(null);

  /* ================= CORRECT INITIAL ERROR STRUCTURE ================= */
  const initialErrorState = {
    personal_email: "",
    phone: "",
    official_email: "",
    employee_id: "",
    emergency_contact_number: "",
    emergency_contact_email: "",
    account_number: "",
  };

  const [formErrors, setFormErrors] = useState(initialErrorState);

  /* ================= MODAL STATES ================= */
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  /* ================= PERSONAL INFO ================= */
  const [personalInfo, setPersonalInfo] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  /* ================= EMPLOYMENT ================= */
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  /* ================= DOCUMENT ================= */
  const emptyDocument = {
    type: "",
    number: "",
    country: "",
    issue_date: "",
    expiry_date: "",
    status: "valid",
    notes: "",
    files: [],
    previews: [],
  };

  const [documents, setDocuments] = useState([emptyDocument]);

  /* ================= EXPERIENCE ================= */
  const emptyExperience = {
    _key: crypto.randomUUID(),
    experience_id: null,
    company_name: "",
    job_title: "",
    start_date: "",
    end_date: "",
    responsibilities: "",
  };

  const [experiences, setExperiences] = useState([emptyExperience]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await getEmployementTypes();
        await getDepartments();
        await getDesignations();
      } catch (err) {
        console.error("Failed to load dropdown data", err);
      }
    };

    fetchAll();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Check if any duplicate errors exist
    const hasErrors = Object.values(formErrors).some(
      (err) => err && err.length > 0
    );

    if (hasErrors) {
      setShowErrorModal(true);
      return;
    }

    const formData = new FormData(e.target);

  

    if (personalInfo.image) {
      formData.append("image", personalInfo.image);
    }

    /* EMPLOYMENT */
    formData.append("employment_type", selectedEmploymentType || "");
    formData.append("department_id", selectedDepartment || "");
    formData.append("designation_id", selectedDesignation || "");
    formData.append("role_id", selectedRoleId || "");

    /* DOCUMENTS */
    const mappedDocs = documents.map((doc, idx) => ({
      document_type: doc.type,
      document_number: doc.number,
      country: doc.country,
      issue_date: doc.issue_date,
      expiry_date: doc.expiry_date,
      status: doc.status,
      note: doc.notes,
      image_field: `document_files_${idx}`,
    }));

    formData.append("documents", JSON.stringify(mappedDocs));

    documents.forEach((doc, idx) => {
      doc.files.forEach((file) => {
        formData.append(`document_files_${idx}`, file);
      });
    });

    /* EXPERIENCE */
    formData.append("experience", JSON.stringify(experiences));

    /* SUBMIT TO SERVER */
    try {
      const res = await onSubmit(formData);
      if (res?.success) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= RESET ================= */
  const handleReset = () => {
    formRef.current?.reset();

    setPersonalInfo({});
    setPhotoPreview(null);
    setSelectedEmploymentType("");
    setSelectedDepartment("");
    setSelectedDesignation("");
    setSelectedRoleId("");
    setDocuments([emptyDocument]);
    setExperiences([emptyExperience]);

    setFormErrors(initialErrorState); // ✅ correct reset
  };

  /* ================= RENDER ================= */
  return (
    <>
      <form className="form-container" ref={formRef} onSubmit={handleSubmit}>
        <PersonalInfoSection
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
          photoPreview={photoPreview}
          onPhotoChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setPhotoPreview(URL.createObjectURL(file));
              setPersonalInfo((prev) => ({ ...prev, image: file }));
            }
          }}
          mode="add"
          employeeId={null}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />

        <EmploymentSection
          mode="add"
          selectedEmploymentType={selectedEmploymentType}
          setSelectedEmploymentType={setSelectedEmploymentType}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedDesignation={selectedDesignation}
          setSelectedDesignation={setSelectedDesignation}
          selectedRoleId={selectedRoleId}
          setSelectedRoleId={setSelectedRoleId}
          setFormErrors={setFormErrors}
        />

        <PreviousExperienceSection
          experiences={experiences}
          onAdd={() =>
            setExperiences((prev) => [...prev, { ...emptyExperience }])
          }
          onChange={(key, field, value) =>
            setExperiences((prev) =>
              prev.map((exp) =>
                exp._key === key ? { ...exp, [field]: value } : exp
              )
            )
          }
          onRemove={(key) =>
            setExperiences((prev) => prev.filter((exp) => exp._key !== key))
          }
        />

        <DocumentsSection
          documents={documents}
          onAdd={() => setDocuments((prev) => [...prev, { ...emptyDocument }])}
          onChange={(index, field, value) =>
            setDocuments((prev) =>
              prev.map((doc, i) =>
                i === index ? { ...doc, [field]: value } : doc
              )
            )
          }
          onFilesChange={(index, files) => {
            const arr = Array.from(files);
            setDocuments((prev) =>
              prev.map((doc, i) =>
                i === index
                  ? {
                      ...doc,
                      files: [...doc.files, ...arr],
                      previews: arr.map((f) => ({
                        url: URL.createObjectURL(f),
                      })),
                    }
                  : doc
              )
            );
          }}
          onRemoveFile={(docIdx, fileIdx) =>
            setDocuments((prev) =>
              prev.map((doc, i) =>
                i === docIdx
                  ? {
                      ...doc,
                      files: doc.files.filter((_, fi) => fi !== fileIdx),
                      previews: doc.previews.filter((_, fi) => fi !== fileIdx),
                    }
                  : doc
              )
            )
          }
          onRemoveDocument={(index) =>
            setDocuments((prev) => prev.filter((_, i) => i !== index))
          }
          setFormErrors={setFormErrors}
        />

        <CompensationSection
          setFormErrors={setFormErrors}
          formErrors={formErrors}
          employeeId={null}
        />

        <EmergencyContactSection
          setFormErrors={setFormErrors}
          formErrors={formErrors}
          employeeId={null}
        />

        <div className="form-actions" style={{ justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            <i className="fa-solid fa-rotate-left" /> Reset
          </button>

          <button type="submit" className="btn btn-primary">
            <i className="fa-solid fa-check" /> Add Employee
          </button>
        </div>
      </form>

      {showSuccessModal && (
        <SuccessModal
          onClose={() => {
            setShowSuccessModal(false);
            handleReset();
          }}
        />
      )}

      {showErrorModal && (
        <ErrorModal onClose={() => setShowErrorModal(false)} />
      )}
    </>
  );
}
