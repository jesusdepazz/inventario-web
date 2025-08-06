import apiClient from "./ApiClient";

const EquiposService = {
  obtenerEquipos: () => apiClient.get("/equipos"),

  obtenerPorId: (id) => apiClient.get(`/equipos/${id}`),

  obtenerPorCodificacion: (codificacion) =>
    apiClient.get(`/equipos/por-codificacion/${codificacion}`),

  crear: (formData) =>
    apiClient.post("/equipos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  editar: (id, formData) =>
    apiClient.put(`/equipos/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  eliminar: (id) => apiClient.delete(`/equipos/${id}`),
};

export default EquiposService;
