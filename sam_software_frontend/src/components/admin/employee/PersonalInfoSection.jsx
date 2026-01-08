import "../../../assets/styles/admin.css";
import { checkUserFieldExists } from "../../../api/admin/checkUserField";
import React, { useState, useEffect } from "react";

export default function PersonalInfoSection({
  personalInfo = {},
  setPersonalInfo,
  photoPreview,
  onPhotoChange,
  mode = "add",
  employeeId,
  formErrors, // parent errors
  setFormErrors, // parent setter
}) {
  const [errors, setErrors] = useState({});

  /** ⛔ FIXED: Sync local errors with parent formErrors */
  useEffect(() => {
    setErrors(formErrors);
  }, [formErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="form-section">
      <h2 className="section-title">
        <i className="fa-solid fa-user" />{" "}
        {mode === "edit"
          ? "Update Personal Information"
          : "Add Personal Information"}
      </h2>

      {/* PHOTO */}
      <div className="form-group full-width">
        <div className="photo-upload">
          <div className="photo-preview">
            {photoPreview ? (
              <img src={photoPreview} alt="Employee" />
            ) : (
              <i className="fa-solid fa-user" />
            )}
          </div>

          <div>
            <label htmlFor="photoUpload" className="upload-btn">
              <i className="fa-solid fa-upload" /> Upload Photo
            </label>

            <input
              type="file"
              id="photoUpload"
              className="file-input"
              accept="image/*"
              name="image"
              onChange={onPhotoChange}
            />
          </div>
        </div>
      </div>

      {/* BASIC GRID */}
      <div className="form-grid" style={{ marginTop: 20 }}>
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label required">Full Name</label>
          <input
            type="text"
            className="form-input"
            name="name"
            value={personalInfo.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* DOB */}
        <div className="form-group">
          <label className="form-label required">Date of Birth</label>
          <input
            type="date"
            className="form-input"
            name="date_of_birth"
            value={
              personalInfo.date_of_birth
                ? personalInfo.date_of_birth.slice(0, 10)
                : ""
            }
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender */}
        <div className="form-group">
          <label className="form-label required">Gender</label>
          <select
            className="form-select"
            name="gender"
            value={personalInfo.gender || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* PERSONAL EMAIL */}
        <div
          className={`form-group ${errors.personal_email ? "has-error" : ""}`}
        >
          <div className="label-row">
            <label className="form-label required">
              Personal Email{" "}
              {errors.personal_email && (
                <span className="inline-error">{errors.personal_email}</span>
              )}
            </label>
          </div>

          <input
            type="email"
            className={`form-input ${
              errors.personal_email ? "input-error" : ""
            }`}
            name="personal_email"
            value={personalInfo.personal_email || ""}
            onChange={async (e) => {
              handleChange(e);
              const email = e.target.value.trim();

              if (email.length > 3) {
                try {
                  const res = await checkUserFieldExists(
                    "personal_email",
                    email,
                    employeeId
                  );
                  const msg = res.success ? "" : "already exists!";

                  setErrors((prev) => ({ ...prev, personal_email: msg }));
                  setFormErrors((prev) => ({ ...prev, personal_email: msg }));
                } catch (err) {
                  console.error("Duplicate personal email check failed:", err);
                }
              } else {
                setErrors((prev) => ({ ...prev, personal_email: "" }));
                setFormErrors((prev) => ({ ...prev, personal_email: "" }));
              }
            }}
            required
          />
        </div>

        {/* PHONE */}
        <div className={`form-group ${errors.phone ? "has-error" : ""}`}>
          <div className="label-row">
            <label className="form-label required">
              Phone Number{" "}
              {errors.phone && (
                <span className="inline-error">{errors.phone}</span>
              )}
            </label>
          </div>

          <input
            type="tel"
            className={`form-input ${errors.phone ? "input-error" : ""}`}
            name="phone"
            value={personalInfo.phone || ""}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            onChange={async (e) => {
              handleChange(e);
              const phone = e.target.value.trim();

              if (phone.length > 5) {
                try {
                  const res = await checkUserFieldExists(
                    "phone",
                    phone,
                    employeeId
                  );
                  const msg = res.success ? "" : "already exists!";

                  setErrors((prev) => ({ ...prev, phone: msg }));
                  setFormErrors((prev) => ({ ...prev, phone: msg }));
                } catch (err) {
                  console.error("Phone duplicate check failed:", err);
                }
              } else {
                setErrors((prev) => ({ ...prev, phone: "" }));
                setFormErrors((prev) => ({ ...prev, phone: "" }));
              }
            }}
            required
          />
        </div>

        {/* Qualification */}
        <div className="form-group">
          <label className="form-label required">Qualification</label>
          <input
            type="text"
            className="form-input"
            name="qualification"
            value={personalInfo.qualification || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* ADDRESS */}
      <div className="form-group full-width" style={{ marginTop: 20 }}>
        <label className="form-label required">Address</label>
        <textarea
          className="form-textarea"
          name="address"
          value={personalInfo.address || ""}
          onChange={handleChange}
          required
        />
      </div>

      {/* LOCATION */}
      <div className="form-grid" style={{ marginTop: 20 }}>
        <div className="form-group">
          <label className="form-label required">Country</label>
          <input
            type="text"
            className="form-input"
            name="country"
            value={personalInfo.country || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label required">State</label>
          <input
            type="text"
            className="form-input"
            name="state"
            value={personalInfo.state || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label required">City</label>
          <input
            type="text"
            className="form-input"
            name="city"
            value={personalInfo.city || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Postal Code</label>
          <input
            type="text"
            className="form-input"
            name="postal_code"
            value={personalInfo.postal_code || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </div>
  );
}
