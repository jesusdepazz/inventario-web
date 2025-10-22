import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrasladosServices from "../../../services/TrasladosServices";
import UbicacionesServices from "../../../services/UbicacionesServices";
import EmpleadosService from "../../../services/EmpleadosServices";
import EquiposService from "../../../services/EquiposServices";

export default function CrearTraslado() {
  const navigate = useNavigate();

  const [ubicaciones, setUbicaciones] = useState([]);

  // Form principal (solo guarda códigos, no nombres ni descripciones)
  const [form, setForm] = useState({
    No: "",
    FechaEmision: "",
    SolicitanteCodigo: "",
    ReceptorCodigo: "",
    CodificacionEquipo: "",
    Motivo: "",
    UbicacionDesde: "",
    UbicacionHasta: "",
    Status: "Pendiente",
    FechaLiquidacion: "",
    Razon: ""
  });

  // Datos informativos (solo se muestran, no se guardan)
  const [infoSolicitante, setInfoSolicitante] = useState(null);
  const [infoReceptor, setInfoReceptor] = useState(null);
  const [infoEquipo, setInfoEquipo] = useState(null);

  // Cargar ubicaciones
  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const res = await UbicacionesServices.obtenerTodas();
        setUbicaciones(res.data);
      } catch (err) {
        console.error("Error cargando ubicaciones:", err);
      }
    };
    fetchUbicaciones();
  }, []);

  // Actualizar formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Buscar empleado por código
  const buscarEmpleado = async (codigo, tipo) => {
    if (!codigo) return;
    try {
      const res = await EmpleadosService.obtenerPorCodigo(codigo);
      if (tipo === "solicitante") setInfoSolicitante(res.data);
      else setInfoReceptor(res.data);
    } catch {
      if (tipo === "solicitante") setInfoSolicitante(null);
      else setInfoReceptor(null);
      alert("Empleado no encontrado ❌");
    }
  };

  // Buscar equipo por codificación
  const buscarEquipo = async (codificacion) => {
    if (!codificacion) return;
    try {
      const res = await EquiposService.obtenerPorCodificacion(codificacion);
      setInfoEquipo(res.data);
    } catch {
      setInfoEquipo(null);
      alert("Equipo no encontrado ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        FechaEmision: form.FechaEmision
          ? new Date(form.FechaEmision).toISOString()
          : null,
        FechaLiquidacion: form.FechaLiquidacion
          ? new Date(form.FechaLiquidacion).toISOString()
          : null
      };

      await TrasladosServices.crear(payload);
      alert("Traslado creado correctamente ✅");

      setForm({
        No: "",
        FechaEmision: "",
        SolicitanteCodigo: "",
        ReceptorCodigo: "",
        CodificacionEquipo: "",
        Motivo: "",
        UbicacionDesde: "",
        UbicacionHasta: "",
        Status: "Pendiente",
        FechaLiquidacion: "",
        Razon: ""
      });
      setInfoSolicitante(null);
      setInfoReceptor(null);
      setInfoEquipo(null);
    } catch (err) {
      console.error("Error creando traslado:", err);
      alert("Error creando traslado ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-6xl p-6 rounded-xl shadow-lg overflow-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DATOS GENERALES */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">
              Datos Generales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="mb-1 font-medium text-gray-700">Número</label>
                <input
                  type="text"
                  name="No"
                  value={form.No}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="mb-1 font-medium text-gray-700">
                  Fecha Emisión
                </label>
                <input
                  type="date"
                  name="FechaEmision"
                  value={form.FechaEmision}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
            </div>
          </section>

          {/* EMPLEADOS */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">
              Empleados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quien entrega */}
              <div>
                <label className="font-medium text-gray-700">
                  Código Empleado (Entrega)
                </label>
                <input
                  type="text"
                  name="SolicitanteCodigo"
                  value={form.SolicitanteCodigo}
                  onChange={handleChange}
                  onBlur={() =>
                    buscarEmpleado(form.SolicitanteCodigo, "solicitante")
                  }
                  className="w-full border rounded-lg p-2"
                  placeholder="Ingrese código de empleado"
                />
                {infoSolicitante && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p>
                      <b>Nombre:</b> {infoSolicitante.nombre}
                    </p>
                    <p>
                      <b>Departamento:</b> {infoSolicitante.departamento}
                    </p>
                    <p>
                      <b>Cargo:</b> {infoSolicitante.cargo}
                    </p>
                  </div>
                )}
              </div>

              {/* Quien recibe */}
              <div>
                <label className="font-medium text-gray-700">
                  Código Empleado (Recibe)
                </label>
                <input
                  type="text"
                  name="ReceptorCodigo"
                  value={form.ReceptorCodigo}
                  onChange={handleChange}
                  onBlur={() => buscarEmpleado(form.ReceptorCodigo, "receptor")}
                  className="w-full border rounded-lg p-2"
                  placeholder="Ingrese código de empleado"
                />
                {infoReceptor && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p>
                      <b>Nombre:</b> {infoReceptor.nombre}
                    </p>
                    <p>
                      <b>Departamento:</b> {infoReceptor.departamento}
                    </p>
                    <p>
                      <b>Cargo:</b> {infoReceptor.cargo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* EQUIPO */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">
              Equipo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="font-medium text-gray-700">
                  Codificación
                </label>
                <input
                  type="text"
                  name="CodificacionEquipo"
                  value={form.CodificacionEquipo}
                  onChange={handleChange}
                  onBlur={() => buscarEquipo(form.CodificacionEquipo)}
                  className="w-full border rounded-lg p-2"
                  placeholder="Ingrese codificación del equipo"
                />
              </div>
              {infoEquipo && (
                <>
                  <div>
                    <label className="font-medium text-gray-700">Tipo</label>
                    <input
                      type="text"
                      value={infoEquipo.tipoEquipo}
                      readOnly
                      className="w-full border rounded-lg p-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Modelo</label>
                    <input
                      type="text"
                      value={infoEquipo.modelo}
                      readOnly
                      className="w-full border rounded-lg p-2 bg-gray-100"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* MOTIVO / UBICACIONES */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">
              Motivo y Ubicaciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium text-gray-700">Motivo</label>
                <textarea
                  name="Motivo"
                  value={form.Motivo}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 resize-none"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="font-medium text-gray-700">Observaciones</label>
                <textarea
                  name="Razon"
                  value={form.Razon}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 resize-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="font-medium text-gray-700">Ubicación Desde</label>
                <select
                  name="UbicacionDesde"
                  value={form.UbicacionDesde}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                >
                  <option value="">Seleccione...</option>
                  {ubicaciones.map((u) => (
                    <option key={u.id} value={u.nombre}>
                      {u.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-medium text-gray-700">Ubicación Hasta</label>
                <select
                  name="UbicacionHasta"
                  value={form.UbicacionHasta}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                >
                  <option value="">Seleccione...</option>
                  {ubicaciones.map((u) => (
                    <option key={u.id} value={u.nombre}>
                      {u.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* BOTONES */}
          <div className="flex justify-center gap-4 pt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold"
            >
              Crear Traslado
            </button>
            <button
              type="button"
              onClick={() => navigate("/trasladosDashboard")}
              className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 text-sm font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
