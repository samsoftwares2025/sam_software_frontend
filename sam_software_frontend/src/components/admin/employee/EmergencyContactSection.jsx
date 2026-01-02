import React from "react";
import "../../../assets/styles/admin.css";

export default function EmergencyContactSection({ initialValues = {} }) {
  return (
    <div className="form-section">
      <h2 className="section-title">
        <i className="fa-solid fa-phone" />
        Emergency Contact
      </h2>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label required">Contact Name</label>
          <input
            type="text"
            className="form-input"
            name="emergency_contact_name"
            required
            defaultValue={initialValues.emergency_contact_name || ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Relationship</label>
          <input
            type="text"
            className="form-input"
            name="emergency_contact_relationship"
            required
            defaultValue={initialValues.emergency_contact_relationship || ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Phone Number</label>
          <input
            type="tel"
            className="form-input"
            name="emergency_contact_number"
            required
            defaultValue={initialValues.emergency_contact_number || ""}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            name="emergency_contact_email"
            defaultValue={initialValues.emergency_contact_email || ""}
          />
        </div>
      </div>
    </div>
  );
}
