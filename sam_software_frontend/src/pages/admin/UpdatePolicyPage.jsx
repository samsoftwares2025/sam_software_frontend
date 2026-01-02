// src/pages/admin/UpdatePolicyPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";
import {
  getPolicies as apiGetPolicies,
  updatePolicy,
} from "../../api/admin/policies";

function UpdatePolicyPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const policyId = params.get("id");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection] = useState("organization");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [originalPolicy, setOriginalPolicy] = useState(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState(null);

  /* ===============================
     LOAD POLICY
  ================================ */
  useEffect(() => {
    if (!policyId) {
      setError("No policy id provided.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    apiGetPolicies()
      .then((resp) => {
        if (!mounted) return;

        let list = [];
        if (resp && Array.isArray(resp.policies)) list = resp.policies;
        else if (Array.isArray(resp)) list = resp;
        else if (Array.isArray(resp.results)) list = resp.results;
        else if (Array.isArray(resp.data)) list = resp.data;
        else if (resp && typeof resp === "object")
          list = resp.policies || resp.results || resp.data || [];

        const found = list.find((p) => String(p.id) === String(policyId));

        if (!found) {
          setError("Policy not found.");
          return;
        }

        setTitle(found.title || "");
        setShortDescription(found.short_description || "");
        setDescription(found.description || "");
        setExistingFileUrl(found.image || null);
        setOriginalPolicy(found);
      })
      .catch((err) => {
        console.error("Failed to load policy for edit:", err);
        setError("Failed to load policy.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [policyId]);

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
      setError("Policy title is required.");
      return;
    }

    // nothing changed
    if (
      originalPolicy &&
      title.trim() === (originalPolicy.title || "").trim() &&
      shortDescription.trim() ===
        (originalPolicy.short_description || "").trim() &&
      description.trim() === (originalPolicy.description || "").trim() &&
      !file
    ) {
      navigate("/admin/policies", { replace: true });
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("short_description", shortDescription.trim());
      formData.append("description", description.trim());

      if (file) {
        formData.append("image", file); // ✅ correct key
      }

      const resp = await updatePolicy(policyId, formData);

      if (resp?.success === false) {
        setError(resp.message || "Failed to update policy.");
        setSaving(false);
        return;
      }

      navigate("/admin/policies", { replace: true });
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update policy.");
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
          <h3>Update Policy</h3>
          <p className="subtitle">Update policy details.</p>
        </div>

        <div className="card">
          {loading ? (
            <div>Loading policy details...</div>
          ) : error ? (
            <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: "1.25rem" }}>
              {/* Title */}
              <div className="designation-page-form-row">
                <label>Policy Title</label>
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
                  placeholder="Brief summary of the policy..."
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
                    <a href={existingFileUrl} target="_blank" rel="noreferrer">
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
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/admin/policies")}
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

export default UpdatePolicyPage;
