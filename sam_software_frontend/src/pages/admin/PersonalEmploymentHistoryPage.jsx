import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import "../../assets/styles/admin.css";

import { PersonalEmploymentHistory } from "../../api/admin/employees";

const PersonalEmploymentHistoryPage = () => {
  const { id: userId } = useParams(); // ✅ ID FROM URL

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
     FETCH HISTORY
  ===================== */
  useEffect(() => {
  if (!userId) return;

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const authUserId = JSON.parse(
        localStorage.getItem("user")
      )?.id;

      const res = await PersonalEmploymentHistory({
        auth_user_id: authUserId, // ✅ logged-in user
        employee_id: userId,      // ✅ employee from URL
        page: 1,
        page_size: 50,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Failed to load history");
      }

      const emp = res.users_data?.[0] || null;
      setEmployee(emp);

      const events = [];

      res.users_data?.forEach((item) => {
        events.push({
          date:
            item.confirmation_date ||
            item.last_working_date ||
            item.joining_date ||
            null,
          details: buildHistoryDetails(item),
        });
      });

      events.sort(
        (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
      );

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
     HELPERS
  ===================== */
  const buildHistoryDetails = (item) => {
    const parts = [];

    if (item.designation) parts.push(`Designation: ${item.designation}`);
    if (item.department) parts.push(`Department: ${item.department}`);
    if (item.employment_type) parts.push(`Type: ${item.employment_type}`);
    if (item.work_location) parts.push(`Location: ${item.work_location}`);
    if (item.annual_ctc) parts.push(`CTC: ₹${item.annual_ctc}`);
    if (item.reporting_manager)
      parts.push(`Manager: ${item.reporting_manager}`);
    if (item.status) parts.push(`Status: ${item.status}`);

    return parts.length
      ? parts.join(" | ")
      : "Profile information updated";
  };

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

  /* =====================
     STATES
  ===================== */
  if (loading) {
    return <main className="main">Loading history...</main>;
  }

  if (error) {
    return <main className="main">{error}</main>;
  }

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

        <section className="top-grid">
          <div className="card">
            <h3>TENURE</h3>
            <div className="big">{getTenure()}</div>
          </div>

          <div className="card">
            <h3>PROFILE COMPLETION</h3>
            <div className="big">{getProfileCompletion()}%</div>
          </div>
        </section>

        <section className="card history-card">
          <h3>Employment History</h3>

          {history.length === 0 ? (
            <p className="small">No history available.</p>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default PersonalEmploymentHistoryPage;
