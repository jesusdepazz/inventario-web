import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrasladosServices from "../../../services/TrasladosServices";
import UbicacionesServices from "../../../services/UbicacionesServices";
import EmpleadosService from "../../../services/EmpleadosServices";
import EquiposService from "../../../services/EquiposServices";

export default function CrearTraslado() {
  const navigate = useNavigate();

  // Form alineado exactamente con la entidad C# Traslado
  const [form, setForm] = useState({
    No: "",
    FechaEmision: "",
    PersonaEntrega: "", // aquí se ingresa el código del empleado (se guarda ese código)
    PersonaRecibe: "",  // código del receptor
    Equipo: "",         // codificación del equipo
    Motivo: "",
    UbicacionDesde: "",
    UbicacionHasta: "",
    Status: "Pendiente",
    Observaciones: ""
  });

  const [ubicaciones, setUbicaciones] = useState([]);
  const [infoEntrega, setInfoEntrega] = useState(null); // datos informativos de empleado entrega
  const [infoRecibe, setInfoRecibe] = useState(null);   // datos informativos de empleado recibe
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

  // Manejador genérico de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Buscar empleado por código — tipo: "entrega" o "recibe"
  const buscarEmpleado = async (codigo, tipo) => {
    if (!codigo) {
      if (tipo === "entrega") setInfoEntrega(null);
      else setInfoRecibe(null);
      return;
    }
    try {
      const res = await EmpleadosService.obtenerPorCodigo(codigo);
      if (tipo === "entrega") setInfoEntrega(res.data);
      else setInfoRecibe(res.data);
    } catch (err) {
      if (tipo === "entrega") setInfoEntrega(null);
      else setInfoRecibe(null);
      alert("Empleado no encontrado ❌");
    }
  };

  // Buscar equipo por codificación
  const buscarEquipo = async (codificacion) => {
    if (!codificacion) {
      setInfoEquipo(null);
      return;
    }
    try {
      const res = await EquiposService.obtenerPorCodificacion(codificacion);
      setInfoEquipo(res.data);
    } catch (err) {
      setInfoEquipo(null);
      alert("Equipo no encontrado ❌");
    }
  };

  // Envío del formulario: payload usa exactamente las llaves de la entidad Traslado
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        No: form.No,
        FechaEmision: form.FechaEmision ? new Date(form.FechaEmision).toISOString() : null,
        PersonaEntrega: form.PersonaEntrega,
        PersonaRecibe: form.PersonaRecibe,
        Equipo: form.Equipo,
        Motivo: form.Motivo,
        UbicacionDesde: form.UbicacionDesde,
        UbicacionHasta: form.UbicacionHasta,
        Status: form.Status,
        Observaciones: form.Observaciones
      };

      await TrasladosServices.crear(payload);
      alert("Traslado creado correctamente ✅");

      // reset
      setForm({
        No: "",
        FechaEmision: "",
        PersonaEntrega: "",
        PersonaRecibe: "",
        Equipo: "",
        Motivo: "",
        UbicacionDesde: "",
        UbicacionHasta: "",
        Status: "Pendiente",
        Observaciones: ""
      });
      setInfoEntrega(null);
      setInfoRecibe(null);
      setInfoEquipo(null);

      // opcional: navegar a dashboard o lista
      // navigate("/trasladosDashboard");
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
                <label className="mb-1 font-medium text-gray-700">Fecha Emisión</label>
                <input
                  type="date"
                  name="FechaEmision"
                  value={form.FechaEmision}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 font-medium text-gray-700">Status</label>
                <select
                  name="Status"
                  value={form.Status}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
            </div>
          </section>

          {/* EMPLEADOS */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">
              Empleados
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium text-gray-700">Persona Entrega (código)</label>
                <input
                  type="text"
                  name="PersonaEntrega"
                  value={form.PersonaEntrega}
                  onChange={handleChange}
                  onBlur={() => buscarEmpleado(form.PersonaEntrega, "entrega")}
                  className="w-full border rounded-lg p-2"
                  placeholder="Código empleado que entrega"
                />
                {infoEntrega && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p><b>Nombre:</b> {infoEntrega.nombre}</p>
                    <p><b>Departamento:</b> {infoEntrega.departamento}</p>
                    <p><b>Puesto:</b> {infoEntrega.puesto}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="font-medium text-gray-700">Persona Recibe (código)</label>
                <input
                  type="text"
                  name="PersonaRecibe"
                  value={form.PersonaRecibe}
                  onChange={handleChange}
                  onBlur={() => buscarEmpleado(form.PersonaRecibe, "recibe")}
                  className="w-full border rounded-lg p-2"
                  placeholder="Código empleado que recibe"
                />
                {infoRecibe && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p><b>Nombre:</b> {infoRecibe.nombre}</p>
                    <p><b>Departamento:</b> {infoRecibe.departamento}</p>
                    <p><b>Puesto:</b> {infoRecibe.puesto}</p>
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
                <label className="font-medium text-gray-700">Equipo (codificación)</label>
                <input
                  type="text"
                  name="Equipo"
                  value={form.Equipo}
                  onChange={handleChange}
                  onBlur={() => buscarEquipo(form.Equipo)}
                  className="w-full border rounded-lg p-2"
                  placeholder="Codificación del equipo"
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
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Observaciones</label>
                <textarea
                  name="Observaciones"
                  value={form.Observaciones}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 resize-none"
                  rows={3}
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
