// src/pages/admin/AddCompanyRulePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";
import { createCompanyRule } from "../../api/admin/company_rules";

import { useAuth } from "../../context/AuthContext";

function AddCompanyRulePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(null);

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a rule title.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("short_description", shortDescription.trim());

      if (file) formData.append("image", file);

      await createCompanyRule(formData);

      navigate("/admin/company-rules", { replace: true });
    } catch (err) {
      console.error("CREATE COMPANY RULE FAILED:", err);

      const status = err?.response?.status;
      const respData = err?.response?.data;

      if (status === 401 || status === 403) {
        setError(respData?.detail || "Session expired. Please sign in again.");
        logout();
        navigate("/", { replace: true });
        return;
      }

      setError(
        respData?.detail ||
          respData?.error ||
          "Failed to add company rule."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        openSection={openSection}
        setOpenSection={() => {}}
      />

      <main className="main">
        <Header onMenuClick={() => setIsSidebarOpen((p) => !p)} />
        <div className="the_line" />

        <div className="page-title">
          <h3>Add Company Rule</h3>
          <p className="subtitle">Create a new company rule.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
            {error && (
              <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
            )}

            <div className="designation-page-form-row">
              <label>Rule Title</label>
              <input
                className="designation-page-form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
           {/*short Description */}
            <div className="designation-page-form-row">
              <label>Short Description</label>
              <textarea
                className="designation-page-form-input"
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary of the policy..."
              />
            </div>
            <div className="designation-page-form-row">
              <label>Description</label>
              <textarea
                className="designation-page-form-input"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="designation-page-form-row">
              <label>Document / Image</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
              />

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    marginTop: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              )}

              {!previewUrl && file && (
                <div style={{ fontSize: 12, marginTop: 6 }}>
                  Selected: <strong>{file.name}</strong>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Add Rule"}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/admin/company-rules")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <div
        className={`sidebar-overlay ${isSidebarOpen ? " w" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}

export default AddCompanyRulePage;
