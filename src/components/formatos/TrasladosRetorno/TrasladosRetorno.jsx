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
    marca: "",
    modelo: "",
    serie: "",
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

  /* =========================
     BUSCAR EMPLEADO
  ========================== */
  const handleBuscarEmpleado = () => {
    if (!formData.solicitante.trim()) return;

    EmpleadosService.obtenerPorCodigo(formData.solicitante)
      .then((res) => setEmpleadoInfo(res.data))
      .catch(() => {
        setEmpleadoInfo(null);
        toast.error("Empleado no encontrado");
      });
  };

  /* =========================
     BUSCAR EQUIPO
  ========================== */
  const handleBuscarEquipo = () => {
    if (!formData.equipo.trim()) return;

    EquiposService.obtenerPorCodificacion(formData.equipo)
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          descripcionEquipo: res.data.tipoEquipo || "",
          marca: res.data.marca || "",
          modelo: res.data.modelo || "",
          serie: res.data.serie || "",
          ubicacionRetorno: res.data.ubicacion || "",
        }));
      })
      .catch(() => {
        setFormData((prev) => ({
          ...prev,
          descripcionEquipo: "",
          marca: "",
          modelo: "",
          serie: "",
          ubicacionRetorno: "",
        }));
        toast.error("Equipo no encontrado");
      });
  };

  /* =========================
     MANEJO INPUTS
  ========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* =========================
     GUARDAR
  ========================== */
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
          marca: "",
          modelo: "",
          serie: "",
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
            value={formData.descripcionEquipo}
            readOnly
            className="border p-2 w-full rounded bg-gray-100"
          />
        </div>

        {/* Marca / Modelo / Serie */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Marca</label>
            <input
              value={formData.marca}
              readOnly
              className="border p-2 w-full rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Modelo</label>
            <input
              value={formData.modelo}
              readOnly
              className="border p-2 w-full rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Serie</label>
            <input
              value={formData.serie}
              readOnly
              className="border p-2 w-full rounded bg-gray-100"
            />
          </div>
        </div>

        {/* Motivo */}
        <div>
          <label className="block font-medium">Motivo de Salida</label>
          <input
            name="motivoSalida"
            value={formData.motivoSalida}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Ubicación */}
        <div>
          <label className="block font-medium">Ubicación de Retorno</label>
          <input
            value={formData.ubicacionRetorno}
            readOnly
            className="border p-2 w-full rounded bg-gray-100"
          />
        </div>

        {/* Fecha Retorno */}
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

        {/* Razón */}
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
