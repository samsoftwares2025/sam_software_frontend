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
  const userId = getUserId();

  const { data } = await http.post(
    "/user-view-support-ticket/",
    {
      user_id: userId,
      ticket_id: ticketId,
    }
  );

  return data;
};

/**
 * ===============================
 * Update Ticket Status
 * ===============================
 */
export const updateSupportTicketStatus = async (ticketId, status) => {
  const userId = getUserId();

  const payload = {
    user_id: userId,
    ticket_id: ticketId,
    status,
  };

  const { data } = await http.post(
    "/user-update-support-ticket-status/",
    payload
  );

  return data;
};

/**
 * ===============================
 * Assign Ticket to User
 * ===============================
 */
export const assignSupportTicket = async (ticketId, assignedToId) => {
  const userId = getUserId();

  const payload = {
    user_id: userId,
    ticket_id: ticketId,
    assigned_to: assignedToId,
  };

  const { data } = await http.post(
    "/user-assign-support-ticket/",
    payload
  );

  return data;
};
