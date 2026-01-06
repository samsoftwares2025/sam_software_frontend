import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import { getSupportTickets } from "../../api/admin/support_tickets";

function ComplianceDocumentationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("compliance");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FILTER STATES ================= */
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

      // ✅ FIX HERE
      setTickets(
        Array.isArray(res?.support_tickets) ? res.support_tickets : []
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load compliance tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  /* ================= FILTERED DATA (CLIENT FALLBACK) ================= */
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (
        searchTerm &&
        !t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      if (status && t.status !== status) return false;
      if (submittedBy && t.submitted_by?.id !== Number(submittedBy))
        return false;
      if (assignedTo && t.assigned_to?.id !== Number(assignedTo)) return false;
      return true;
    });
  }, [tickets, searchTerm, status, submittedBy, assignedTo]);

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

            {/* STATUS */}
            <select
              className="filter-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            {/* SUBMITTED BY */}
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

            {/* ASSIGNED TO */}
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

            {/* DATE RANGE */}
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
                    <th>Subject</th>
                    <th>Submitted By</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Attachment</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((t, index) => (
                    <tr key={t.id}>
                      <td>{index + 1}</td>
                      <td>{t.subject}</td>
                      <td>{t.submitted_by?.name || "-"}</td>
                      <td>{t.assigned_to?.name || "-"}</td>
                      <td>
                        <span
                          className={`status-pill status-${t.status?.toLowerCase()}`}
                        >
                          ● {t.status}
                        </span>
                      </td>
                      <td>
                        {t.attachment?.url ? (
                          <a
                            href={t.attachment.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t.attachment.name || "View"}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td>
                        {new Date(t.created_at).toLocaleDateString("en-GB")}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-btn view"
                            title="View Ticket"
                            onClick={() =>
                              (window.location.href = `/admin/compliance-ticket/${t.id}`)
                            }
                          >
                            <i className="fa-solid fa-eye" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

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

      <div
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}

export default ComplianceDocumentationPage;
