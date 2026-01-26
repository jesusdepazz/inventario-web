import apiClient from "./ApiClient";

const TrasladosRetornoService = {
  crear: (traslado) => apiClient.post("/trasladoRetornos", traslado),

  obtenerTodos: () => apiClient.get("/trasladoRetornos"),

  obtenerDetalle: (id) =>
    apiClient.get(`/trasladoRetornos/detalle/${id}`),

  eliminar: (id) => apiClient.delete(`/trasladoRetornos/${id}`),
};

export default TrasladosRetornoService;
