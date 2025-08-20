import apiClient from "./ApiClient";

const HojasServices = {
  // Obtener todas las hojas
  obtenerTodas: () => apiClient.get("/HojaResponsabilidad"),

  // Obtener hoja por ID
  obtenerPorId: (id) => apiClient.get(`/HojaResponsabilidad/${id}`),

  // Crear nueva hoja
  crear: (hoja) => apiClient.post("/HojaResponsabilidad", hoja),

  // Eliminar hoja
  eliminar: (id) => apiClient.delete(`/HojaResponsabilidad/${id}`)
};

export default HojasServices;
