import { API_BASE_URL } from "./config";

export async function createEmployee(formData) {
  const res = await fetch(`${API_BASE_URL}/api/employees/`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}
