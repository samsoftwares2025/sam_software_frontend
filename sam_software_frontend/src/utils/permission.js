export function hasPermission(permissions, module, action = "view") {
  const isClientAdmin = localStorage.getItem("is_client_admin") === "true";

  // 👑 Client Admin → full access
  if (isClientAdmin) return true;

  if (!permissions) return false;

  // normalize module name to match backend mapping
  const cleanModule = module.trim().toLowerCase();

  if (!permissions[cleanModule]) return false;

  return permissions[cleanModule][action] === true;
}
