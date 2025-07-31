import apiClient from "./apiClient";

const AsignacionesService = {
  crear: (asignacion) => apiClient.post("/asignaciones", asignacion),

  obtenerTodas: () => apiClient.get("/asignaciones"),

  eliminar: (id) => apiClient.delete(`/asignaciones/${id}`),
};

export default AsignacionesService;
