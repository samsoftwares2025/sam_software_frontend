import React from "react";
import "../../../assets/styles/admin.css";

export default function PersonalInfoSection({
  personalInfo = {},
  setPersonalInfo,
  photoPreview,
  onPhotoChange,
  mode = "add", // "add" | "edit"
}) {
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
        {mode === "edit" ? "Update Personal Information" : "Add Personal Information"}
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

        <div className="form-group">
          <label className="form-label required">Personal Email</label>
          <input
            type="email"
            className="form-input"
            name="personal_email"
            value={personalInfo.personal_email || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Phone Number</label>
          <input
            type="tel"
            className="form-input"
            name="phone"
            value={personalInfo.phone || ""}
            onChange={handleChange}
            required
          />
        </div>

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

      {/* LOCATION DETAILS */}
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
