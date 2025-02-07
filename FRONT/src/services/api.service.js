export async function call({ uri, method = "GET", body = undefined }) {
  const API_URL = "http://localhost:3333/api";
  const token = localStorage.getItem("token");

  const headers = {
      Authorization: `Bearer ${token}`, 
  };

  if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}/${uri}`, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body), 
  });

  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error desconocido.");
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  return isJson ? response.json() : {};
}
