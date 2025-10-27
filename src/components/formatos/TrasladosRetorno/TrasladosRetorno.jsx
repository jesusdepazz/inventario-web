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
    ubivacionRetorno: "",
    fechaRetorno: "",
    status: "",
    razonNoLiquidada: "",
  });

  const [empleadoInfo, setEmpleadoInfo] = useState(null);
  const [ubicaciones, setUbicaciones] = useState([]);

  // Cargar ubicaciones al inicio
  useEffect(() => {
    UbicacionesService.obtenerTodas()
      .then((res) => setUbicaciones(res.data))
      .catch(() => toast.error("Error al cargar ubicaciones"));
  }, []);

  // Buscar empleado al ingresar código
  const handleBuscarEmpleado = () => {
    if (!formData.solicitante.trim()) return;
    EmpleadosService.obtenerPorCodigo(formData.solicitante)
      .then((res) => setEmpleadoInfo(res.data))
      .catch(() => {
        setEmpleadoInfo(null);
        toast.error("Empleado no encontrado");
      });
  };

  // Buscar equipo por codificación
  const handleBuscarEquipo = () => {
    if (!formData.equipo.trim()) return;
    EquiposService.obtenerPorCodificacion(formData.equipo)
      .then((res) =>
        setFormData({
          ...formData,
          descripcionEquipo: res.data.tipoEquipo || "",
        })
      )
      .catch(() => {
        setFormData({ ...formData, descripcionEquipo: "" });
        toast.error("Equipo no encontrado");
      });
  };

  // Cambios de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Guardar traslado
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
          ubivacionRetorno: "",
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
        {/* No y Fecha */}
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

        {/* Solicitante */}
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

        {/* Equipo */}
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

        {/* Descripción */}
        <div>
          <label className="block font-medium">Descripción Equipo</label>
          <input
            name="descripcionEquipo"
            value={formData.descripcionEquipo}
            readOnly
            className="border p-2 w-full rounded bg-gray-100"
          />
        </div>

        {/* Motivo salida */}
        <div>
          <label className="block font-medium">Motivo de Salida</label>
          <input
            name="motivoSalida"
            value={formData.motivoSalida}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Ubicación retorno */}
        <div>
          <label className="block font-medium">Ubicación de Retorno</label>
          <select
            name="ubivacionRetorno"
            value={formData.ubivacionRetorno}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Seleccionar...</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.nombre}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha retorno */}
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

        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <input
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Razón no liquidada */}
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
