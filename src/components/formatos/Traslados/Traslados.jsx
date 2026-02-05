import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TrasladosServices from "../../../services/TrasladosServices";
import UbicacionesServices from "../../../services/UbicacionesServices";
import EmpleadosService from "../../../services/EmpleadosServices";
import EquiposService from "../../../services/EquiposServices";

export default function CrearTraslado() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    No: "",
    FechaEmision: "",
    Status: "Pendiente",

    PersonaEntrega: "", // input
    PersonaRecibe: "",  // input

    CodigoEntrega: "",
    NombreEntrega: "",
    PuestoEntrega: "",
    DepartamentoEntrega: "",

    CodigoRecibe: "",
    NombreRecibe: "",
    PuestoRecibe: "",
    DepartamentoRecibe: "",

    Equipo: "",
    DescripcionEquipo: "",
    Marca: "",
    Modelo: "",
    Serie: "",

    Motivo: "",
    Observaciones: "",

    UbicacionDesde: "",
    UbicacionHasta: ""
  });

  const [ubicaciones, setUbicaciones] = useState([]);
  const [infoEntrega, setInfoEntrega] = useState(null);
  const [infoRecibe, setInfoRecibe] = useState(null);
  const [infoEquipo, setInfoEquipo] = useState(null);
  const [equipos, setEquipos] = useState([]);

  /* =========================
     CARGA DE UBICACIONES
  ========================== */
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

  /* =========================
     HANDLERS
  ========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* =========================
     BUSCAR EMPLEADO
  ========================== */
  const buscarEmpleado = async (codigo, tipo) => {
    if (!codigo) return;

    try {
      const res = await EmpleadosService.obtenerPorCodigo(codigo);
      const emp = res.data;

      if (tipo === "entrega") {
        setInfoEntrega(emp);
        setForm(prev => ({
          ...prev,
          CodigoEntrega: codigo,
          NombreEntrega: emp.nombre || "",
          PuestoEntrega: emp.puesto || "",
          DepartamentoEntrega: emp.departamento || ""
        }));
      }

      if (tipo === "recibe") {
        setInfoRecibe(emp);
        setForm(prev => ({
          ...prev,
          CodigoRecibe: codigo,
          NombreRecibe: emp.nombre || "",
          PuestoRecibe: emp.puesto || "",
          DepartamentoRecibe: emp.departamento || ""
        }));
      }

    } catch (err) {
      alert("Empleado no encontrado ❌");
    }
  };

  /* =========================
     BUSCAR EQUIPO
  ========================== */
  const buscarEquipo = async (codigo) => {
    if (!codigo) return;

    try {
      const res = await EquiposService.obtenerPorCodificacion(codigo);
      const eq = res.data;

      setInfoEquipo(eq);
      setForm(prev => ({
        ...prev,
        DescripcionEquipo: eq.tipoEquipo || "",
        Marca: eq.marca || "",
        Modelo: eq.modelo || "",
        Serie: eq.serie || "",
        UbicacionDesde: eq.ubicacion || ""
      }));
    } catch (err) {
      alert("Equipo no encontrado ❌");
    }
  };

  const agregarEquipo = () => {
    if (!infoEquipo) {
      alert("Primero busca un equipo ❌");
      return;
    }

    // evitar duplicados
    const existe = equipos.some(e => e.Equipo === form.Equipo);
    if (existe) {
      alert("Este equipo ya fue agregado ⚠️");
      return;
    }

    setEquipos(prev => [
      ...prev,
      {
        Equipo: form.Equipo,
        DescripcionEquipo: form.DescripcionEquipo,
        Marca: form.Marca,
        Modelo: form.Modelo,
        Serie: form.Serie
      }
    ]);

    // limpiar solo campos de equipo
    setForm(prev => ({
      ...prev,
      Equipo: "",
      DescripcionEquipo: "",
      Marca: "",
      Modelo: "",
      Serie: ""
    }));

    setInfoEquipo(null);
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (equipos.length === 0) {
      alert("Debe agregar al menos un equipo ❌");
      return;
    }

    try {
      const payload = {
        No: form.No,
        FechaEmision: form.FechaEmision
          ? new Date(form.FechaEmision).toISOString()
          : null,
        Status: form.Status,

        Motivo: form.Motivo,
        Observaciones: form.Observaciones,
        UbicacionDesde: form.UbicacionDesde,
        UbicacionHasta: form.UbicacionHasta,

        Equipos: equipos,

        EmpleadoEntrega: {
          Codigo: form.CodigoEntrega,
          Nombre: form.NombreEntrega,
          Puesto: form.PuestoEntrega,
          Departamento: form.DepartamentoEntrega
        },

        EmpleadoRecibe: {
          Codigo: form.CodigoRecibe,
          Nombre: form.NombreRecibe,
          Puesto: form.PuestoRecibe,
          Departamento: form.DepartamentoRecibe
        }
      };

      await TrasladosServices.crear(payload);
      alert("Traslado creado correctamente ✅");
      navigate("/trasladosDashboard");

    } catch (err) {
      console.error("Errores de validación:", err.response?.data?.errors);
      alert("Error creando traslado ❌ (ver consola)");
    }
  };

  /* =========================
     JSX (SIN CAMBIOS)
  ========================== */
  return (
    <div className="h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-6xl p-6 rounded-xl shadow-lg overflow-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ===== DATOS GENERALES ===== */}
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

          {/* ===== EMPLEADOS ===== */}
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
                />
              </div>

              {infoEquipo && (
                <>
                  <input type="hidden" />
                </>
              )}
            </div>
            <button
              type="button"
              onClick={agregarEquipo}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-2"
            >
              Agregar equipo
            </button>

            {equipos.length > 0 && (
              <div className="mt-4 border rounded-lg p-3">
                <h4 className="font-semibold mb-2">Equipos agregados</h4>
                <ul className="text-sm space-y-1">
                  {equipos.map((e, i) => (
                    <li key={i}>
                      • {e.Equipo} — {e.Marca} {e.Modelo} ({e.Serie})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* ===== MOTIVO Y UBICACIONES ===== */}
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
                <input
                  type="text"
                  name="UbicacionDesde"
                  value={form.UbicacionDesde}
                  readOnly
                  className="w-full border rounded-lg p-2 bg-gray-100"
                />
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
                  {ubicaciones.map(u => (
                    <option key={u.id} value={u.nombre}>
                      {u.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="flex justify-center gap-4 pt-6">
            <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg">
              Crear Traslado
            </button>
            <button type="button" onClick={() => navigate("/trasladosDashboard")}
              className="bg-gray-400 text-white px-5 py-2 rounded-lg">
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
