import React from "react";
import "../../../assets/styles/admin.css";

export default function CompensationSection({ initialValues = {} }) {
  return (
    <div className="form-section">
      <h2 className="section-title">
        <i className="fa-solid fa-money-bill-wave" />
        Compensation Details
      </h2>
    
      <div className="form-grid-3">
        {/* Annual CTC */}
        <div className="form-group">
          <label className="form-label required">Annual CTC</label>
          <input
            type="number"
            className="form-input"
            name="annual_ctc"
            placeholder="$"
            required
            defaultValue={initialValues.annual_ctc || ""}
          />
        </div>

        {/* Basic Salary */}
        <div className="form-group">
          <label className="form-label required">Basic Salary</label>
          <input
            type="number"
            className="form-input"
            name="basic_salary"
            placeholder="$"
            required
            defaultValue={initialValues.basic_salary || ""}
          />
        </div>

        {/* Variable Pay */}
        <div className="form-group">
          <label className="form-label">Variable Pay</label>
          <input
            type="number"
            className="form-input"
            name="variable_pay"
            placeholder="$"
            defaultValue={initialValues.variable_pay || ""}
          />
        </div>

        {/* Bank Name */}
        <div className="form-group">
          <label className="form-label">Bank Name</label>
          <input
            type="text"
            className="form-input"
            name="bank_name"
            defaultValue={initialValues.bank_name || ""}
          />
        </div>

        {/* Account Number */}
        <div className="form-group">
          <label className="form-label">Account Number</label>
          <input
            type="text"
            className="form-input"
            name="account_number"
            defaultValue={initialValues.account_number || ""}
          />
        </div>

        {/* IFSC Code */}
        <div className="form-group">
          <label className="form-label">IFSC Code</label>
          <input
            type="text"
            className="form-input"
            name="ifsc_code"
            defaultValue={initialValues.ifsc_code || ""}
          />
        </div>
      </div>
    </div>
  );
}
