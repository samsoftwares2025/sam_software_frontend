import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";
import {
  getCompanyRules as apiGetCompanyRules,
  updateCompanyRule,
} from "../../api/admin/company_rules";

function UpdateCompanyRulePage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const ruleId = params.get("id");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [originalRule, setOriginalRule] = useState(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState(null);

  /* ===============================
     LOAD RULE
  ================================ */
  useEffect(() => {
    if (!ruleId) {
      setError("No rule id provided.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    apiGetCompanyRules()
      .then((resp) => {
        if (!mounted) return;

        let list = [];
        if (resp && Array.isArray(resp.rules)) list = resp.rules;
        else if (Array.isArray(resp)) list = resp;
        else if (Array.isArray(resp.results)) list = resp.results;
        else if (Array.isArray(resp.data)) list = resp.data;
        else if (resp && typeof resp === "object")
          list = resp.rules || resp.results || resp.data || [];

        const found = list.find((r) => String(r.id) === String(ruleId));

        if (!found) {
          setError("Company rule not found.");
          return;
        }

        setTitle(found.title || "");
        setShortDescription(found.short_description || "");
        setDescription(found.description || "");
        setExistingFileUrl(found.image || null);
        setOriginalRule(found);
      })
      .catch((err) => {
        console.error("Failed to load company rule for edit:", err);
        setError("Failed to load company rule.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [ruleId]);

  /* ===============================
     FILE HANDLER
  ================================ */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(null);

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  /* ===============================
     SUBMIT
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Rule title is required.");
      return;
    }

    // nothing changed
    if (
      originalRule &&
      title.trim() === (originalRule.title || "").trim() &&
      shortDescription.trim() ===
        (originalRule.short_description || "").trim() &&
      description.trim() === (originalRule.description || "").trim() &&
      !file
    ) {
      navigate("/admin/company-rules", { replace: true });
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("short_description", shortDescription.trim());
      formData.append("description", description.trim());

      if (file) {
        formData.append("image", file); // ✅ matches backend
      }

      const resp = await updateCompanyRule(ruleId, formData);

      if (resp?.success === false) {
        setError(resp.message || "Failed to update company rule.");
        setSaving(false);
        return;
      }

      navigate("/admin/company-rules", { replace: true });
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update company rule.");
    } finally {
      setSaving(false);
    }
  };

  /* ===============================
     RENDER
  ================================ */
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
          <h3>Update Company Rule</h3>
          <p className="subtitle">Update company rule details.</p>
        </div>

        <div className="card">
          {loading ? (
            <div>Loading company rule details...</div>
          ) : error ? (
            <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
              {/* Title */}
              <div className="designation-page-form-row">
                <label>Rule Title</label>
                <input
                  className="designation-page-form-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Short Description */}
              <div className="designation-page-form-row">
                <label>Short Description</label>
                <textarea
                  className="designation-page-form-input"
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief summary of the rule..."
                />
              </div>

              {/* Description */}
              <div className="designation-page-form-row">
                <label>Description</label>
                <textarea
                  className="designation-page-form-input"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Existing File */}
              {existingFileUrl && !previewUrl && (
                <div className="designation-page-form-row">
                  <label>Current Document</label>
                  {/\.(jpg|jpeg|png|gif|webp)$/i.test(existingFileUrl) ? (
                    <img
                      src={existingFileUrl}
                      alt="Current"
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                      }}
                    />
                  ) : (
                    <a
                      href={existingFileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View current document
                    </a>
                  )}
                </div>
              )}

              {/* Replace File */}
              <div className="designation-page-form-row">
                <label>Replace Document / Image (optional)</label>
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
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
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
          )}
        </div>
      </main>
    </div>
  );
}

export default UpdateCompanyRulePage;
