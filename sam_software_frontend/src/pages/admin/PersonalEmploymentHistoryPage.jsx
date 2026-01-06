import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import { PersonalEmploymentHistory } from "../../api/admin/employees";

const PersonalEmploymentHistoryPage = () => {
  const { id: userId } = useParams();

  /* =====================
     SIDEBAR STATE
  ===================== */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState("employees");

  /* =====================
     DATA STATE
  ===================== */
  const [employee, setEmployee] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================
     IMAGE MODAL STATE
  ===================== */
  const [isImageOpen, setIsImageOpen] = useState(false);

  /* =====================
     FILTER STATE
  ===================== */
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* =====================
     FETCH HISTORY
  ===================== */
  useEffect(() => {
    const authUserId = localStorage.getItem("userId");
    if (!userId || !authUserId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await PersonalEmploymentHistory({
          auth_user_id: authUserId,
          employee_id: userId,
          page: 1,
          page_size: 50,
        });

        if (!res?.success) {
          throw new Error(res?.message || "Failed to load history");
        }

        const emp = res.users_data?.[0] || null;
        setEmployee(emp);

        const events = res.users_data.map((item) => ({
          date:
            item.confirmation_date ||
            item.last_working_date ||
            item.joining_date ||
            null,
          item,
        }));

        events.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        setHistory(events);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  /* =====================
     FILTERED HISTORY
  ===================== */
  const filteredHistory = useMemo(() => {
    return history.filter(({ date }) => {
      if (!date) return false;

      const d = new Date(date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (from && d < from) return false;
      if (to && d > to) return false;

      return true;
    });
  }, [history, fromDate, toDate]);

  /* =====================
     HELPERS
  ===================== */
  const getTenure = () => {
    if (!employee?.joining_date) return "—";

    const join = new Date(employee.joining_date);
    const today = new Date();
    const days = Math.floor((today - join) / (1000 * 60 * 60 * 24));

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);

    if (years > 0) return `${years} yrs ${months} mos`;
    if (months > 0) return `${months} mos`;
    return `${days} days`;
  };

  const getProfileCompletion = () => {
    let score = 0;
    const total = 6;

    if (employee?.name) score++;
    if (employee?.designation) score++;
    if (employee?.department) score++;
    if (employee?.joining_date) score++;
    if (employee?.annual_ctc) score++;
    if (history.length > 0) score++;

    return Math.round((score / total) * 100);
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
  };

  /* =====================
     STATES
  ===================== */
  if (loading) return <main className="main">Loading history...</main>;
  if (error) return <main className="main">{error}</main>;

  /* =====================
     RENDER
  ===================== */
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

        {/* ===== SUMMARY ===== */}
        <section className="summary-grid">
          <div className="summary-box">
            <span className="summary-label">TENURE</span>
            <strong className="summary-value">{getTenure()}</strong>
          </div>

          <div className="summary-box">
            <span className="summary-label">PROFILE COMPLETION</span>
            <strong className="summary-value">
              {getProfileCompletion()}%
            </strong>
          </div>
        </section>

        {/* ===== EMPLOYEE INFO ===== */}
        <section className="info-section">
          {/* <h3 className="section-title">Employee Information</h3> */}

          <div className="employee-header">
            {/* Profile Photo */}
            <div
              className="profile-photo"
              onClick={() => employee?.image && setIsImageOpen(true)}
              style={{ cursor: employee?.image ? "pointer" : "default" }}
            >
              {employee?.image ? (
                <img
                  src={employee.image}
                  alt={employee.name || "Employee"}
                  className="profile-photo-img"
                />
              ) : (
                <span className="profile-initial">
                  {employee?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>

            {/* Info Grid */}
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Employee ID:</span>
                <span className="value">
                  {employee?.employee_id || "—"}
                </span>
              </div>
            
              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">{employee?.phone || "—"}</span>
              </div>
             
              <div className="info-item">
                <span className="label">Official Email:</span>
                <span className="value">
                  {employee?.official_email || "—"}
                </span>
              </div>
             <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{employee?.name || "—"}</span>
              </div>
              <div className="info-item">
                <span className="label">Personal Email:</span>
                <span className="value">
                  {employee?.personal_email || "—"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== IMAGE MODAL ===== */}
        {isImageOpen && (
          <div
            className="image-modal"
            onClick={() => setIsImageOpen(false)}
          >
            <div
              className="image-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="image-modal-close"
                onClick={() => setIsImageOpen(false)}
              >
                ✕
              </button>

              <img
                src={employee.image}
                alt={employee.name}
              />
            </div>
          </div>
        )}

        {/* ===== FILTERS ===== */}
        <section className="filter-section">
          <div className="filter-group">
            <label>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <button className="btn btn-ghost" onClick={clearFilters}>
              Clear
            </button>
          </div>
        </section>

        {/* ===== HISTORY ===== */}
        <section className="history-section">
          <h3 className="section-title">Employment History</h3>

          {filteredHistory.length === 0 ? (
            <p className="small">No history available.</p>
          ) : (
            <div className="timeline">
              {filteredHistory.map(({ date, item }, index) => (
                <div className="timeline-row" key={index}>
                  <div className="timeline-date">
                    {date
                      ? new Date(date).toLocaleDateString("en-GB")
                      : "—"}
                  </div>

                  <div className="timeline-body">
                    <div className="timeline-title">
                      {item.department || "—"} →{" "}
                      {item.designation || "—"}
                    </div>

                    <div className="timeline-meta">
                      {item.employment_type && (
                        <span>Type: {item.employment_type}</span>
                      )}
                      {item.work_location && (
                        <span>Location: {item.work_location}</span>
                      )}
                      {item.user_role && (
                        <span>Role: {item.user_role}</span>
                      )}
                    </div>

                    <div className="timeline-pay">
                      {item.annual_ctc && (
                        <span>CTC ₹{item.annual_ctc}</span>
                      )}
                      {item.basic_salary && (
                        <span>Basic ₹{item.basic_salary}</span>
                      )}
                      {item.variable_pay && (
                        <span>Variable ₹{item.variable_pay}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
       {/* ===== STYLES ===== */}
      <style>{`
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-top:2%;
        }

        .summary-box {
          padding: 16px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .summary-label {
          font-size: 12px;
          color: #64748b;
        }

        .summary-value {
          font-size: 22px;
          color: #0f172a;
        }

        .info-section,
        .filter-section,
        .history-section {
          padding: 20px;
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .info-grid label {
          font-size: 12px;
          color: #64748b;
        }

        .info-grid span {
          font-size: 14px;
          font-weight: 500;
        }

        .filter-section {
          display: flex;
          gap: 16px;
          align-items: flex-end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .timeline-row {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 16px;
          padding: 14px;
          border-radius: 8px;
          background: #f9fafb;
        }

        .timeline-date {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .timeline-title {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .timeline-meta,
        .timeline-pay {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
          color: #475569;
        }
          .filter-section {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  padding: 16px 20px;
  margin-bottom: 24px;

  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 12px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.filter-group input {
  padding: 8px 12px;
  min-width: 160px;

  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;

  font-size: 13px;
  color: #0f172a;

  transition: all 0.2s ease;
}



.filter-group input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.filter-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.filter-actions .btn {
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
}


.info-section {
  padding: 22px 26px;
  margin-bottom: 28px;

  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 14px;

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.05);
}

.section-title {
  margin-bottom: 18px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #0f172a;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  row-gap: 18px;
  column-gap: 40px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item .label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.info-item .value {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  word-break: break-word;
}



.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
  margin-bottom: 30px;
}

.summary-box {
  position: relative;
  padding: 22px 26px;

  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 16px;

  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.06);

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;

  transition: transform 0.2s ease, box-shadow 0.2s ease;
}



.summary-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #64748b;
}

.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
}

/* Accent line on left */
.summary-box::before {
  content: "";
  position: absolute;
  left: 0;
  top: 14px;
  bottom: 14px;
  width: 4px;
  border-radius: 4px;
  background: linear-gradient(180deg, #3b82f6, #2563eb);
}

/* Different accent for second card */
.summary-box:nth-child(2)::before {
  background: linear-gradient(180deg, #10b981, #059669);
}


      `}</style>
    </div>
  );
};

export default PersonalEmploymentHistoryPage;
