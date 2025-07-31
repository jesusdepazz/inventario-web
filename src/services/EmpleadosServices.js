import apiClient from "./ApiClient";

const EmpleadosService = {
  obtenerPorCodigo: (codigo) => apiClient.get(`/empleados/${codigo}`),
};

export default EmpleadosService;
