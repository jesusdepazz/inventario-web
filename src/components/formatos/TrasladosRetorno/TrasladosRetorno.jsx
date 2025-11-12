import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TrasladosRetornoService from "../../../services/TrasladosRetornoService";
import EmpleadosService from "../../../services/EmpleadosServices";
import EquiposService from "../../../services/EquiposServices";
import UbicacionesService from "../../../services/UbicacionesServices";

const CrearTrasladoRetorno = () => {
  const [formData, setFormData] = useState({
    no: "",
    fechaPase: "",
    solicitante: "",
    equipo: "",
    descripcionEquipo: "",
    motivoSalida: "",
    ubicacionRetorno: "",
    fechaRetorno: "",
    status: "",
    razonNoLiquidada: "",
  });

  const [empleadoInfo, setEmpleadoInfo] = useState(null);
  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    UbicacionesService.obtenerTodas()
      .then((res) => setUbicaciones(res.data))
      .catch(() => toast.error("Error al cargar ubicaciones"));
  }, []);

  const handleBuscarEmpleado = () => {
    if (!formData.solicitante.trim()) return;
    EmpleadosService.obtenerPorCodigo(formData.solicitante)
      .then((res) => setEmpleadoInfo(res.data))
      .catch(() => {
        setEmpleadoInfo(null);
        toast.error("Empleado no encontrado");
      });
  };

  const handleBuscarEquipo = () => {
    if (!formData.equipo.trim()) return;

    EquiposService.obtenerPorCodificacion(formData.equipo)
      .then((res) => {
        setFormData({
          ...formData,
          descripcionEquipo: res.data.tipoEquipo || "",
          ubicacionRetorno: res.data.ubicacion || ""
        });
      })
      .catch(() => {
        setFormData({ ...formData, descripcionEquipo: "", ubicacionRetorno: "" });
        toast.error("Equipo no encontrado");
      });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    TrasladosRetornoService.crear(formData)
      .then(() => {
        toast.success("Traslado registrado correctamente");
        setFormData({
          no: "",
          fechaPase: "",
          solicitante: "",
          equipo: "",
          descripcionEquipo: "",
          motivoSalida: "",
          ubicacionRetorno: "",
          fechaRetorno: "",
          status: "",
          razonNoLiquidada: "",
        });
        setEmpleadoInfo(null);
      })
      .catch(() => toast.error("Error al registrar traslado"));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Crear Traslado Retorno
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">No.</label>
            <input
              name="no"
              value={formData.no}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Fecha Pase</label>
            <input
              type="date"
              name="fechaPase"
              value={formData.fechaPase}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Solicitante (Código)</label>
          <div className="flex gap-2">
            <input
              name="solicitante"
              value={formData.solicitante}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <button
              type="button"
              onClick={handleBuscarEmpleado}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
          {empleadoInfo && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Nombre: {empleadoInfo.nombre}</p>
              <p>Puesto: {empleadoInfo.puesto}</p>
              <p>Departamento: {empleadoInfo.departamento}</p>
            </div>
          )}
        </div>
        <div>
          <label className="block font-medium">Equipo (Codificación)</label>
          <div className="flex gap-2">
            <input
              name="equipo"
              value={formData.equipo}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <button
              type="button"
              onClick={handleBuscarEquipo}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </div>
        <div>
          <label className="block font-medium">Descripción Equipo</label>
          <input
            name="descripcionEquipo"
            value={formData.descripcionEquipo}
            readOnly
            className="border p-2 w-full rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block font-medium">Motivo de Salida</label>
          <input
            name="motivoSalida"
            value={formData.motivoSalida}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Ubicación de Retorno</label>
          <select
            name="ubicacionRetorno"
            value={formData.ubicacionRetorno}
            onChange={handleChange}
            className="border p-2 w-full rounded bg-gray-100"
            disabled
          >
            {formData.ubicacionRetorno ? (
              <option value={formData.ubicacionRetorno}>
                {formData.ubicacionRetorno}
              </option>
            ) : (
              <option value="">Buscar equipo primero...</option>
            )}
          </select>
        </div>
        <div>
          <label className="block font-medium">Fecha Retorno</label>
          <input
            type="date"
            name="fechaRetorno"
            value={formData.fechaRetorno}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Status</label>
          <input
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Razón No Liquidada</label>
          <input
            name="razonNoLiquidada"
            value={formData.razonNoLiquidada}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Guardar Traslado
        </button>
      </form>
    </div>
  );
};

export default CrearTrasladoRetorno;
