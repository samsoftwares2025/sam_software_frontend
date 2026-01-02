import React from "react";
import "../../../assets/styles/admin.css";

export default function PersonalInfoSection({
  initialValues = {},
  photoPreview,
  onPhotoChange,
}) {
  return (
    <div className="form-section">
      <h2 className="section-title">
        <i className="fa-solid fa-user" />
        Personal Information
      </h2>

      {/* PHOTO */}
      <div className="form-group full-width">
        <div className="photo-upload">
          <div className="photo-preview" id="photoPreview">
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
            required
            defaultValue={initialValues.name || ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Date of Birth</label>
          <input
            type="date"
            className="form-input"
            name="date_of_birth"
            required
            defaultValue={initialValues.date_of_birth || ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Gender</label>
          <select
            className="form-select"
            name="gender"
            required
            defaultValue={initialValues.gender || ""}
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
            required
            defaultValue={initialValues.personal_email || ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Phone Number</label>
          <input
            type="tel"
            className="form-input"
            name="phone"
            required
            defaultValue={initialValues.phone || ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Qualification</label>
          <input
            type="text"
            className="form-input"
            name="qualification"
            required
            defaultValue={initialValues.qualification || ""}
          />
        </div>
      </div>

      {/* ADDRESS */}
      <div className="form-group full-width" style={{ marginTop: 20 }}>
        <label className="form-label required">Address</label>
        <textarea
          className="form-textarea"
          name="address"
          required
          defaultValue={initialValues.address || ""}
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
            required
            defaultValue={initialValues.country || ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">State</label>
          <input
            type="text"
            className="form-input"
            name="state"
            required
            defaultValue={initialValues.state || ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">City</label>
          <input
            type="text"
            className="form-input"
            name="city"
            required
            defaultValue={initialValues.city || ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Postal Code</label>
          <input
            type="text"
            className="form-input"
            name="postal_code"
            required
            defaultValue={initialValues.postal_code || ""}
          />
        </div>
      </div>
    </div>
  );
}
