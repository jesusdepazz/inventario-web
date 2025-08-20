import apiClient from "./ApiClient";

const HojasServices = {
  obtenerTodas: () => apiClient.get("/HojaResponsabilidad"),

  obtenerPorId: (id) => apiClient.get(`/HojaResponsabilidad/${id}`),

  crear: (hoja) => apiClient.post("/HojaResponsabilidad", hoja),

  eliminar: (id) => apiClient.delete(`/HojaResponsabilidad/${id}`)
};

export default HojasServices;
