import apiClient from "./ApiClient";

export default {
  obtenerTodos: () => apiClient.get("/suministros"),
  obtenerPorId: (id) => apiClient.get(`/suministros/${id}`),
  crear: (data) => apiClient.post("/suministros", data),
  actualizar: (id, data) => apiClient.put(`/suministros/${id}`, data),
  eliminar: (id) => apiClient.delete(`/suministros/${id}`)
};
