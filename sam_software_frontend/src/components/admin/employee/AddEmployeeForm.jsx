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

export default function AddEmployeeForm({ onSubmit }) {
  const [errors, setErrors] = useState({});

  const formRef = useRef(null);

  /* ================= MODAL ================= */
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /* ================= PHOTO ================= */
  const [photoPreview, setPhotoPreview] = useState(null);

  /* ================= EMPLOYMENT ================= */
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designationsByDept, setDesignationsByDept] = useState({});
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [selectedEmploymentType, setSelectedEmploymentType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");

  /* ================= DOCUMENTS ================= */
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
  const [personalInfo, setPersonalInfo] = useState({});

  /* ================= PREVIOUS EXPERIENCE ================= */
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

  /* ================= FETCH DROPDOWNS ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const etRes = await getEmployementTypes();
        setEmploymentTypes(
          Array.isArray(etRes?.employment_types)
            ? etRes.employment_types
            : Array.isArray(etRes)
            ? etRes
            : []
        );

        const deptRes = await getDepartments();
        const deptList = Array.isArray(deptRes)
          ? deptRes
          : deptRes?.departments || [];

        setDepartments(deptList.map((d) => ({ value: d.id, label: d.name })));

        const desigRes = await getDesignations();
        const desigList = Array.isArray(desigRes)
          ? desigRes
          : desigRes?.designations || [];

        const grouped = {};
        desigList.forEach((d) => {
          if (!grouped[d.department_id]) grouped[d.department_id] = [];
          grouped[d.department_id].push(d);
        });

        setDesignationsByDept(grouped);
      } catch (err) {
        console.error("Failed to load dropdown data", err);
      }
    };

    fetchAll();
  }, []);

  /* ================= DOCUMENT HANDLERS ================= */
  const handleAddDocument = () => {
    setDocuments((prev) => [...prev, { ...emptyDocument }]);
  };

  const handleDocumentChange = (index, field, value) => {
    setDocuments((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, [field]: value } : doc))
    );
  };

  const handleDocumentFilesChange = (index, files) => {
    const arr = Array.from(files);
    setDocuments((prev) =>
      prev.map((doc, i) =>
        i === index
          ? {
              ...doc,
              files: [...doc.files, ...arr],
              previews: [
                ...doc.previews,
                ...arr.map((f) => ({ url: URL.createObjectURL(f) })),
              ],
            }
          : doc
      )
    );
  };

  const handleRemoveDocumentFile = (docIdx, fileIdx) => {
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
    );
  };

  const handleRemoveDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= EXPERIENCE HANDLERS ================= */
  const handleAddExperience = () => {
    setExperiences((prev) => [...prev, { ...emptyExperience }]);
  };

const handleExperienceChange = (key, field, value) => {
  setExperiences(prev =>
    prev.map(exp =>
      exp._key === key ? { ...exp, [field]: value } : exp
    )
  );
};

const handleRemoveExperience = (key) => {
  setExperiences(prev => prev.filter(exp => exp._key !== key));
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
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Documents
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

    // Experiences
    formData.append("experience", JSON.stringify(experiences));

    try {
      const res = await onSubmit(formData);
      if (res?.success) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error(err);
    }
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
      setPersonalInfo((prev) => ({
        ...prev,
        image: file,
      }));
    }
  }}
  mode="add"
/>


        <EmploymentSection
          selectedEmploymentType={selectedEmploymentType}
          setSelectedEmploymentType={setSelectedEmploymentType}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedDesignation={selectedDesignation}
          setSelectedDesignation={setSelectedDesignation}
          selectedRoleId={selectedRoleId}
          setSelectedRoleId={setSelectedRoleId}
        />
        <PreviousExperienceSection
          experiences={experiences}
          onAdd={handleAddExperience}
          onChange={handleExperienceChange}
          onRemove={handleRemoveExperience}
        />
        <DocumentsSection
          documents={documents}
          onAdd={handleAddDocument}
          onChange={handleDocumentChange}
          onFilesChange={handleDocumentFilesChange}
          onRemoveFile={handleRemoveDocumentFile}
          onRemoveDocument={handleRemoveDocument}
        />

        <CompensationSection />
        <EmergencyContactSection />

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
    </>
  );
}
