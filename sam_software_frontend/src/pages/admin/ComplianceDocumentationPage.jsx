import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import { getSupportTickets } from "../../api/admin/support_tickets";

/* ================= FILE URL NORMALIZER ================= */
const getFileUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${window.location.origin}${url}`;
};

function ComplianceDocumentationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("organization");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* preview modal */
  const [previewImage, setPreviewImage] = useState(null);

  /* ================= FILTER STATES ================= */
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= DOWNLOAD HELPER (SAME AS CompanyRulesPage) ================= */
  const downloadFile = async (fileUrl, fileName = "attachment") => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Unable to download file.");
    }
  };

  /* ================= FETCH TICKETS ================= */
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getSupportTickets({
        search: searchTerm,
        status,
        submitted_by: submittedBy,
        assigned_to: assignedTo,
        from_date: fromDate,
        to_date: toDate,
      });

      const normalized = Array.isArray(res?.support_tickets)
        ? res.support_tickets.map((t) => ({
            ...t,
            submitted_by: t.submitted_by
              ? { id: t.submitted_by, name: t.submitted_by_name }
              : null,
            assigned_to: t.assigned_to
              ? { id: t.assigned_to, name: t.assigned_to_name }
              : null,
          }))
        : [];

      setTickets(normalized);
    } catch (err) {
      console.error(err);
      setError("Failed to load compliance tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= FILTERED DATA ================= */
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (
        searchTerm &&
        !t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      if (status && t.status !== status) return false;
      if (submittedBy && t.submitted_by?.id !== Number(submittedBy))
        return false;
      if (assignedTo && t.assigned_to?.id !== Number(assignedTo)) return false;

      if (fromDate && new Date(t.created_at) < new Date(fromDate)) return false;
      if (toDate && new Date(t.created_at) > new Date(toDate)) return false;

      return true;
    });
  }, [tickets, searchTerm, status, submittedBy, assignedTo, fromDate, toDate]);

  /* ================= HELPERS ================= */
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatus("");
    setSubmittedBy("");
    setAssignedTo("");
    setFromDate("");
    setToDate("");
    fetchTickets();
  };

  const uniqueSubmitters = [
    ...new Map(
      tickets
        .filter((t) => t.submitted_by)
        .map((t) => [t.submitted_by.id, t.submitted_by])
    ).values(),
  ];

  const uniqueAssignees = [
    ...new Map(
      tickets
        .filter((t) => t.assigned_to)
        .map((t) => [t.assigned_to.id, t.assigned_to])
    ).values(),
  ];

  /* ================= RENDER ================= */
  return (
    <div className="container">
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        openSection={openSection}
        setOpenSection={setOpenSection}
      />

      <main className="main">
        <Header onMenuClick={() => setIsSidebarOpen((p) => !p)} />
        <div className="the_line" />

        <div className="page-title">
          <h3>Compliance Documentation</h3>
          <p className="subtitle">
            View, filter and manage compliance support tickets.
          </p>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="filters-container">
          <div className="filters-left">
            <div className="search-input">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                placeholder="Search by subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Hold">Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              className="filter-select"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
            >
              <option value="">Submitted By</option>
              {uniqueSubmitters.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assigned To</option>
              {uniqueAssignees.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="filter-select"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className="filter-select"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button className="btn btn-ghost" onClick={handleClearFilters}>
            <i className="fa-solid fa-filter-circle-xmark" /> Clear Filters
          </button>
        </div>

        {/* ================= TABLE ================= */}
        <div className="table-container">
          <div className="table-header-bar">
            <h4>
              Compliance Tickets{" "}
              <span className="badge-pill">
                Total: {filteredTickets.length}
              </span>
            </h4>
          </div>

          {loading ? (
            <div style={{ padding: "1rem" }}>Loading tickets...</div>
          ) : error ? (
            <div style={{ padding: "1rem", color: "orange" }}>{error}</div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Submitted By</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Attachment</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((t, index) => {
                    const file = getFileUrl(t.attachment?.url);
                    const isImage =
                      file && /\.(jpg|jpeg|png|gif|webp)$/i.test(file);

                    return (
                      <tr key={t.id}>
                        <td>{index + 1}</td>
                        <td>
                          {new Date(t.created_at).toLocaleDateString("en-GB")}
                        </td>
                        <td>{t.subject}</td>
                        <td>{t.submitted_by?.name || "-"}</td>
                        <td>{t.assigned_to?.name || "-"}</td>

                        <td>
                          <span
                            className={`status-pill status-${t.status
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`}
                          >
                            ● {t.status}
                          </span>
                        </td>

                        <td>
                          {file ? (
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                className="icon-btn"
                                title="View"
                                onClick={() =>
                                  isImage
                                    ? setPreviewImage(file)
                                    : window.open(file, "_blank")
                                }
                              >
                                <i className="fa-solid fa-eye" />
                              </button>

                              <button
                                className="icon-btn"
                                title="Download"
                                onClick={() =>
                                  downloadFile(
                                    file,
                                    t.attachment?.name || "attachment"
                                  )
                                }
                              >
                                <i className="fa-solid fa-download" />
                              </button>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td>
                          <button
                            className="icon-btn view"
                            title="View Ticket"
                            onClick={() =>
                              (window.location.href = `/admin/compliance-ticket/${t.id}`)
                            }
                          >
                            <i className="fa-solid fa-eye" />
                          </button>
                          <button
                            className="icon-btn edit"
                            title="Edit Rule"
                            onClick={() =>
                              (window.location.href = `/admin/update/compliance-ticket/${t.id}`)
                            }
                          >
                            <i className="fa-solid fa-pen" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center" }}>
                        No tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="modal-backdrop" style={backdropStyle}>
          <div style={previewModalStyle}>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <button
                className="icon-btn"
                title="Download"
                onClick={() => downloadFile(previewImage, "attachment")}
              >
                <i className="fa-solid fa-download" />
              </button>

              <button className="btn" onClick={() => setPreviewImage(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}

/* ================= MODAL STYLES ================= */
const backdropStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const previewModalStyle = {
  background: "#fff",
  padding: 16,
  borderRadius: 8,
  maxWidth: "95%",
};

export default ComplianceDocumentationPage;
