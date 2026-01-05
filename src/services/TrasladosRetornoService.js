import apiClient from "./ApiClient";

const TrasladosRetornoService = {
  crear: (traslado) => apiClient.post("/trasladoRetornos", traslado),

  obtenerTodos: () => apiClient.get("/trasladoRetornos"),

  obtenerPorId: (id) => apiClient.get(`/trasladoRetornos/${id}`),

  actualizar: (id, traslado) => apiClient.put(`/trasladoRetornos/${id}`, traslado),

  eliminar: (id) => apiClient.delete(`/trasladoRetornos/${id}`),

  obtenerDetalle: (id) => apiClient.get(`/trasladoRetornos/detalle/${id}`),
};

export default TrasladosRetornoService;
