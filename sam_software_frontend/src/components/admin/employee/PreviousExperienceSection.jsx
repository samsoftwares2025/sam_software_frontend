import React from "react";
import "../../../assets/styles/admin.css";

export default function PreviousExperienceSection({
  experiences = [],
  onAdd,
  onChange,
  onRemove,
}) {
  return (
    <div className="form-section">
      <h2 className="section-title">
        <i className="fa-solid fa-briefcase" />
        Previous Experience
      </h2>

      {(experiences || []).map((exp, index) => (
        <div
          key={index}
          className="exp-block"
          style={{
            border: "1px solid #ddd",
            padding: 15,
            borderRadius: 8,
            marginBottom: 15,
          }}
        >
          <h3 style={{ marginBottom: 10 }}>
            Experience {index + 1}
          </h3>

          <div className="form-grid">
            {/* Company Name */}
            <div className="form-group">
              <label className="form-label required">
                Company Name
              </label>
              <input
                type="text"
                className="form-input"
                value={exp.company_name}
                onChange={(e) =>
                  onChange(index, "company_name", e.target.value)
                }
                required
              />
            </div>

            {/* Job Title */}
            <div className="form-group">
              <label className="form-label required">
                Job Title
              </label>
              <input
                type="text"
                className="form-input"
                value={exp.job_title}
                onChange={(e) =>
                  onChange(index, "job_title", e.target.value)
                }
                required
              />
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label className="form-label required">
                Start Date
              </label>
              <input
                type="date"
                className="form-input"
                value={exp.start_date}
                onChange={(e) =>
                  onChange(index, "start_date", e.target.value)
                }
                required
              />
            </div>

            {/* End Date */}
            <div className="form-group">
              <label className="form-label">
                End Date
              </label>
              <input
                type="date"
                className="form-input"
                value={exp.end_date}
                onChange={(e) =>
                  onChange(index, "end_date", e.target.value)
                }
              />
            </div>
          </div>

          {/* Responsibilities */}
          <div className="form-group full-width" style={{ marginTop: 12 }}>
            <label className="form-label required">
              Responsibilities
            </label>
            <textarea
              className="form-textarea"
              rows={4}
              value={exp.responsibilities}
              onChange={(e) =>
                onChange(index, "responsibilities", e.target.value)
              }
              required
              placeholder="Describe key responsibilities and achievements..."
            />
          </div>

          {experiences.length > 1 && (
            <button
              type="button"
              className="btn btn-secondary"
               style={{ marginTop: 16 }} 
              onClick={() => onRemove(index)}
            >
              Remove Experience
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn btn-primary"
        onClick={onAdd}
      >
        <i className="fa-solid fa-plus" /> Add Experience
      </button>
    </div>
  );
}
