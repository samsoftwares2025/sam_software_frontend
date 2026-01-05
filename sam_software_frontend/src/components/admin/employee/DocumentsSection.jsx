import React, { useEffect, useState } from "react";

export default function DocumentsSection({
  documents,
  onAdd,
  onChange,
  onFilesChange,
  onRemoveFile,
  onRemoveDocument,
}) {
  /* cleanup blob URLs on unmount */
  useEffect(() => {
    return () => {
      (documents || []).forEach((doc) => {
        (doc.previews || []).forEach((p) => {
          if (p?.url?.startsWith("blob:")) {
            URL.revokeObjectURL(p.url);
          }
        });
      });
    };
  }, [documents]);

  const handleFilesSelect = (index, files) => {
    onFilesChange(index, files); // ✅ parent handles previews
  };

  return (
    <div className="form-section">
      <h2 className="section-title">
        <i className="fa-solid fa-passport"></i>
        Visa / License / Passport Documents
      </h2>

      {(documents || []).map((doc, index) => {
        const previews = doc.previews || [];

        return (
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
            <h3 style={{ marginBottom: 10 }}>Document {index + 1}</h3>

            <div className="form-grid">
              {/* Document Type */}
              <div className="form-group">
                <label className="form-label required">Document Type</label>
                <select
                  className="form-select"
                  value={doc.type}
                  onChange={(e) => onChange(index, "type", e.target.value)}
                  required
                >
                  <option value="">Select Document Type</option>
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
                <input
                  type="text"
                  className="form-input"
                  value={doc.number}
                  onChange={(e) => onChange(index, "number", e.target.value)}
                  required
                />
              </div>

              {/* Country */}
              <div className="form-group">
                <label className="form-label">Country</label>
                <select
                  className="form-select"
                  value={doc.country}
                  onChange={(e) => onChange(index, "country", e.target.value)}
                >
                  <option value="">Select Country</option>
                  <option value="india">India</option>
                  <option value="usa">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Issue Date */}
              <div className="form-group">
                <label className="form-label">Issue Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={doc.issue_date}
                  onChange={(e) =>
                    onChange(index, "issue_date", e.target.value)
                  }
                />
              </div>

              {/* Expiry Date */}
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={doc.expiry_date}
                  onChange={(e) =>
                    onChange(index, "expiry_date", e.target.value)
                  }
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={doc.status}
                  onChange={(e) => onChange(index, "status", e.target.value)}
                >
                  <option value="valid">Valid</option>
                  <option value="expired">Expired</option>
                  <option value="applied">Applied</option>
                </select>
              </div>
            </div>

            {/* Upload */}
            <div className="form-group full-width" style={{ marginTop: 12 }}>
              <label className="form-label">Upload Scans / Images / PDF</label>

              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={(e) => handleFilesSelect(index, e.target.files)}
                className="form-input"
              />

              {/* PREVIEWS */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {previews.map((p, fi) => {
                  const isPdf =
                    p.type === "application/pdf" ||
                    p.url?.toLowerCase().endsWith(".pdf");

                  return (
                    <div
                      key={fi}
                      style={{
                        width: 120,
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        padding: 6,
                        position: "relative",
                      }}
                    >
                      {isPdf ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 12 }}
                        >
                          📄 View PDF
                        </a>
                      ) : (
                        <img
                          src={p.url}
                          alt=""
                          style={{
                            width: "100%",
                            height: 70,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => onRemoveFile(index, fi)}
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          background: "red",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {documents.length > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onRemoveDocument(index)}
              >
                Remove Document
              </button>
            )}
          </div>
        );
      })}

      <button type="button" className="btn btn-primary" onClick={onAdd}>
        <i className="fa-solid fa-plus"></i> Add Document
      </button>
    </div>
  );
}
