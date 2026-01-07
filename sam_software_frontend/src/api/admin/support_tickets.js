import http from "../http";

/**
 * Helper: get userId safely
 */
const getUserId = () => {
  return localStorage.getItem("userId");
};

/**
 * ===============================
 * Get Support Tickets (Admin)
 * ===============================
 * Filters supported:
 * - status
 * - from_date
 * - to_date
 * - assigned_to
 * - submitted_by
 * - search
 */
export const getSupportTickets = async (filters = {}) => {
  const userId = getUserId();

  const payload = {
    user_id: userId,

    // optional filters
    status: filters.status || "",
    from_date: filters.from_date || "",
    to_date: filters.to_date || "",
    assigned_to: filters.assigned_to || "",
    submitted_by: filters.submitted_by || "",
    search: filters.search || "",
  };

  const { data } = await http.post(
    "/hr/list-all-support-ticket/",
    payload
  );

  return data;
};

/**
 * ===============================
 * Get Single Support Ticket
 * ===============================
 */


export const getSupportTicketById = async (ticketId) => {
  const userId = localStorage.getItem("userId");


  if (!userId) {
    throw new Error("Session expired");
  }

  const { data } = await http.post("/users/user-get-support-ticket/", {
    user_id: userId,
    ticket_id: ticketId,

  });

  return data;
};


/**
 * ===============================
 * Update Ticket Status
 * ===============================
 */
export const updateSupportTicket = async (payload) => {
  const userId = localStorage.getItem("userId");

  const form = new FormData();
  form.append("user_id", userId);
  form.append("ticket_id", payload.ticket_id);
  form.append("assigned_user_id", payload.assigned_to);
  form.append("status", payload.status);

  const { data } = await http.post(
    "/hr/assign-and-change-status-support-ticket/",
    form,
    {
      headers: { "Content-Type": "multipart/form-data" } // <--- FIX HERE
    }
  );

  return data;
};

