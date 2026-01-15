import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({
  children,
  module,
  action = "view",
  noPermissionCheck = false,
}) => {
  const { isAuthenticated, permissions, isClientAdmin, isLoading } = useAuth();

  const [showModal, setShowModal] = useState(false);

  // ---- CLEAN MODULE NAME ----
  const cleanModule = module?.trim().toLowerCase() || null;

  // ---- CHECK ACCESS ----
  const hasAccess =
    isClientAdmin ||
    noPermissionCheck ||
    permissions?.[cleanModule]?.[action] === true;

  /* ============================================================
       HOOK (must always run, not in conditional)
       This hook listens to changes in permissions or access
  ============================================================ */
  useEffect(() => {
    if (!isAuthenticated || isClientAdmin || noPermissionCheck) {
      setShowModal(false);
      return;
    }

    if (!hasAccess) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [
    isAuthenticated,
    permissions,
    isClientAdmin,
    noPermissionCheck,
    hasAccess,
  ]);

  /* ============================================================
       LOADING STATE
  ============================================================ */
  if (isLoading) return null;

  /* ============================================================
       NOT AUTHENTICATED → redirect
  ============================================================ */
  if (!isAuthenticated) {
    window.location.href = "/";
    return null;
  }

  /* ============================================================
       ACCESS DENIED → Show modal + block page
  ============================================================ */
  /* =============== NO PERMISSION =============== */
if (!hasAccess) {
  if (!showModal) setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
    window.location.href = "/admin/dashboard"; // 🔥 redirect to dashboard
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay small-modal">
          <div className="modal-card">
            <h3>No Permission</h3>
            <p>You do not have permission to access this module.</p>

            <button className="btn btn-primary" onClick={handleClose}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}


  /* ============================================================
       ALLOW ROUTE
  ============================================================ */
  return children;
};

export default ProtectedRoute;
