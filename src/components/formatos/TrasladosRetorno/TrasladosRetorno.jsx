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
    motivoSalida: "",
    ubicacionRetorno: "",
    fechaRetorno: "",
    empleado: null,
    equipos: []
  });

  const [empleadoCodigo, setEmpleadoCodigo] = useState("");
  const [equipoCodigo, setEquipoCodigo] = useState("");
  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    UbicacionesService.obtenerTodas()
      .then(res => setUbicaciones(res.data))
      .catch(() => toast.error("Error al cargar ubicaciones"));
  }, []);

  /* =========================
     BUSCAR EMPLEADO
  ========================== */
  const handleBuscarEmpleado = () => {
    if (!empleadoCodigo.trim()) return;

    EmpleadosService.obtenerPorCodigo(empleadoCodigo)
      .then(res => {
        setFormData(prev => ({
          ...prev,
          empleado: {
            empleadoId: empleadoCodigo,
            nombre: res.data.nombre,
            puesto: res.data.puesto,
            departamento: res.data.departamento
          }
        }));
      })
      .catch(() => toast.error("Empleado no encontrado"));
  };

  /* =========================
     AGREGAR EQUIPO
  ========================== */
  const handleAgregarEquipo = () => {
    if (!equipoCodigo.trim()) return;

    EquiposService.obtenerPorCodificacion(equipoCodigo)
      .then(res => {
        const existe = formData.equipos.some(e => e.equipo === res.data.codificacion);
        if (existe) {
          toast.warning("Equipo ya agregado");
          return;
        }

        setFormData(prev => ({
          ...prev,
          equipos: [
            ...prev.equipos,
            {
              equipo: res.data.codificacion,
              descripcionEquipo: res.data.tipoEquipo,
              marca: res.data.marca,
              modelo: res.data.modelo,
              serie: res.data.serie
            }
          ]
        }));

        setEquipoCodigo("");
      })
      .catch(() => toast.error("Equipo no encontrado"));
  };

  /* =========================
     QUITAR EQUIPO
  ========================== */
  const handleQuitarEquipo = (index) => {
    setFormData(prev => ({
      ...prev,
      equipos: prev.equipos.filter((_, i) => i !== index)
    }));
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.empleado)
      return toast.error("Debe seleccionar un empleado");

    if (formData.equipos.length === 0)
      return toast.error("Debe agregar al menos un equipo");

    console.log("PAYLOAD:", JSON.stringify(formData, null, 2));

    TrasladosRetornoService.crear(formData)
      .then(() => {
        toast.success("Traslado registrado correctamente");

        setFormData({
          no: "",
          fechaPase: "",
          motivoSalida: "",
          ubicacionRetorno: "",
          fechaRetorno: "",
          empleado: null,
          equipos: []
        });

        setEmpleadoCodigo("");
        setEquipoCodigo("");
      })
      .catch(err => {
        console.error(err.response?.data);
        toast.error("Error al registrar traslado");
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        Crear Traslado Retorno
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* NO / FECHA PASE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>No.</label>
            <input
              className="border p-2 w-full rounded"
              value={formData.no}
              onChange={e => setFormData({ ...formData, no: e.target.value })}
            />
          </div>

          <div>
            <label>Fecha Pase</label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={formData.fechaPase}
              onChange={e => setFormData({ ...formData, fechaPase: e.target.value })}
            />
          </div>
        </div>

        {/* EMPLEADO */}
        <div>
          <label>Empleado (Código)</label>
          <div className="flex gap-2">
            <input
              className="border p-2 w-full rounded"
              value={empleadoCodigo}
              onChange={e => setEmpleadoCodigo(e.target.value)}
            />
            <button
              type="button"
              onClick={handleBuscarEmpleado}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Buscar
            </button>
          </div>

          {formData.empleado && (
            <div className="mt-2 text-sm text-gray-600">
              <p><b>Codigo:</b> {formData.empleado.empleadoId}</p>
              <p><b>Nombre:</b> {formData.empleado.nombre}</p>
              <p><b>Puesto:</b> {formData.empleado.puesto}</p>
              <p><b>Departamento:</b> {formData.empleado.departamento}</p>
            </div>
          )}
        </div>

        {/* EQUIPOS */}
        <div>
          <label>Equipo (Codificación)</label>
          <div className="flex gap-2">
            <input
              className="border p-2 w-full rounded"
              value={equipoCodigo}
              onChange={e => setEquipoCodigo(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAgregarEquipo}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* LISTA EQUIPOS */}
        {formData.equipos.length > 0 && (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Equipo</th>
                <th className="border p-2">Descripción</th>
                <th className="border p-2">Marca</th>
                <th className="border p-2">Modelo</th>
                <th className="border p-2">Serie</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formData.equipos.map((eq, i) => (
                <tr key={i}>
                  <td className="border p-2">{eq.equipo}</td>
                  <td className="border p-2">{eq.descripcionEquipo}</td>
                  <td className="border p-2">{eq.marca}</td>
                  <td className="border p-2">{eq.modelo}</td>
                  <td className="border p-2">{eq.serie}</td>
                  <td className="border p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleQuitarEquipo(i)}
                      className="text-red-600"
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* MOTIVO */}
        <div>
          <label>Motivo de Salida</label>
          <input
            className="border p-2 w-full rounded"
            value={formData.motivoSalida}
            onChange={e => setFormData({ ...formData, motivoSalida: e.target.value })}
          />
        </div>

        {/* UBICACIÓN RETORNO */}
        <div>
          <label>Ubicación Retorno</label>
          <select
            className="border p-2 w-full rounded"
            value={formData.ubicacionRetorno}
            onChange={e =>
              setFormData({ ...formData, ubicacionRetorno: e.target.value })
            }
          >
            <option value="">Seleccione una ubicación</option>

            {ubicaciones.map((u) => (
              <option key={u.id} value={u.nombre}>
                {u.nombre}
              </option>
            ))}
          </select>

        </div>

        {/* FECHA RETORNO */}
        <div>
          <label>Fecha Retorno</label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={formData.fechaRetorno}
            onChange={e => setFormData({ ...formData, fechaRetorno: e.target.value })}
          />
        </div>

        <button className="bg-green-600 text-white px-6 py-2 rounded">
          Guardar Traslado
        </button>
      </form>
    </div>
  );
};

export default CrearTrasladoRetorno;
