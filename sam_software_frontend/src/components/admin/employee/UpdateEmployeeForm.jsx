import React, { useRef, useState, useEffect } from "react";

import PersonalInfoSection from "./PersonalInfoSection";
import EmploymentSection from "./EmploymentSection";
import DocumentsSection from "./DocumentsSection";
import CompensationSection from "./CompensationSection";
import EmergencyContactSection from "./EmergencyContactSection";
import PreviousExperienceSection from "./PreviousExperienceSection";

import "../../../assets/styles/admin.css";

export default function UpdateEmployeeForm({ initialValues = {}, onSubmit }) {
  const formRef = useRef(null);

  const [personalInfo, setPersonalInfo] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  /* ================= TRACK DELETED ================= */
  const [deletedExperienceIds, setDeletedExperienceIds] = useState([]);
  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);

  /* ================= EMPLOYMENT ================= */
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  /* ================= DOCUMENTS ================= */
  const [documents, setDocuments] = useState([]);

  /* ================= EXPERIENCES ================= */
  const [experiences, setExperiences] = useState([]);

  const toDateInput = (value) => {
    if (!value) return "";
    return value.split("T")[0];
  };

  /* ================= PERSONAL INFO ================= */
  useEffect(() => {
    const emp = initialValues?.employee ?? initialValues;
    if (!emp) return;

    setPersonalInfo({
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
    });
  }, [initialValues]);

  /* ================= SYNC INITIAL VALUES ================= */
  useEffect(() => {
    if (initialValues?.image) setPhotoPreview(initialValues.image);

    setSelectedEmploymentType(initialValues?.employment_type_id || "");
    setSelectedDepartment(initialValues?.department_id || "");
    setSelectedDesignation(initialValues?.designation_id || "");
    setSelectedRoleId(initialValues?.user_role_id || "");

    /* ---------- DOCUMENTS ---------- */
    if (Array.isArray(initialValues?.documents) && initialValues.documents.length) {
      setDocuments(
        initialValues.documents.map((doc) => ({
          id: doc.document_id,
          type: doc.document_type || "",
          number: doc.document_number || "",
          country: doc.country || "",
          issue_date: toDateInput(doc.issue_date),
          expiry_date: toDateInput(doc.expiry_date),
          status: doc.status || "",
          notes: doc.note || "",
          files: [],
          previews: (doc.images || []).map((img) => ({
            url: img.url,
            image_id: img.image_id,
            existing: true,
          })),
        }))
      );
    } else {
      setDocuments([{ number: "", files: [], previews: [] }]);
    }

    /* ---------- EXPERIENCES ---------- */
    if (Array.isArray(initialValues?.experiences) && initialValues.experiences.length) {
      setExperiences(
        initialValues.experiences.map((exp) => ({
          _key: exp.experience_id ?? exp.id ?? crypto.randomUUID(),
          experience_id: exp.experience_id ?? exp.id ?? null,
          company_name: exp.company_name || "",
          job_title: exp.job_title || "",
          start_date: toDateInput(exp.start_date),
          end_date: toDateInput(exp.end_date),
          responsibilities: exp.responsibilities || "",
        }))
      );
    } else {
      setExperiences([
        {
          _key: crypto.randomUUID(),
          experience_id: null,
          company_name: "",
          job_title: "",
          start_date: "",
          end_date: "",
          responsibilities: "",
        },
      ]);
    }
  }, [initialValues]);

  /* ================= DOCUMENT HANDLERS ================= */
  const handleAddDocument = () => {
    setDocuments((prev) => [...prev, { number: "", files: [], previews: [] }]);
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
    setDocuments((prev) => {
      const docToRemove = prev[index];

      if (docToRemove?.id) {
        setDeletedDocumentIds((ids) =>
          ids.includes(docToRemove.id)
            ? ids
            : [...ids, docToRemove.id]
        );
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  /* ================= EXPERIENCE HANDLERS ================= */
  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        _key: crypto.randomUUID(),
        experience_id: null,
        company_name: "",
        job_title: "",
        start_date: "",
        end_date: "",
        responsibilities: "",
      },
    ]);
  };

  const handleExperienceChange = (key, field, value) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp._key === key ? { ...exp, [field]: value } : exp))
    );
  };

  const handleRemoveExperience = (key) => {
    setExperiences((prev) => {
      const expToRemove = prev.find((e) => e._key === key);

      if (expToRemove?.experience_id) {
        setDeletedExperienceIds((ids) =>
          ids.includes(expToRemove.experience_id)
            ? ids
            : [...ids, expToRemove.experience_id]
        );
      }

      return prev.filter((e) => e._key !== key);
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("user_role_id", selectedRoleId);

    /* ---------- DOCUMENTS ---------- */
    const mappedDocs = documents.map((doc, idx) => ({
      document_id: doc.id,
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

    /* ---------- EXPERIENCES ---------- */
    const cleanedExperiences = experiences.map(({ _key, ...rest }) => rest);
    formData.append("experience", JSON.stringify(cleanedExperiences));

    deletedExperienceIds.forEach((id) => {
      formData.append("deleted_experience_ids", id);
    });

    /* ---------- DELETED DOCUMENTS (🔥 MISSING FIX) ---------- */
    deletedDocumentIds.forEach((id) => {
      formData.append("deleted_document_ids", id);
    });

    await onSubmit(formData);
  };

  /* ================= RENDER ================= */
  return (
    <form className="form-container" ref={formRef} onSubmit={handleSubmit}>
      <PersonalInfoSection
        personalInfo={personalInfo}
        setPersonalInfo={setPersonalInfo}
        photoPreview={photoPreview}
        onPhotoChange={(e) =>
          setPhotoPreview(URL.createObjectURL(e.target.files[0]))
        }
      />

      <EmploymentSection
        initialValues={initialValues}
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

      <CompensationSection initialValues={initialValues} />
      <EmergencyContactSection initialValues={initialValues} />

      <div className="form-actions" style={{ justifyContent: "flex-end" }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedRoleId}
        >
          <i className="fa-solid fa-save" /> Update Employee
        </button>
      </div>
    </form>
  );
}
