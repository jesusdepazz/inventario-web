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
    codigoProveedor: "",
    telefonoProveedor: "",
    personaRetira: "",
    nombreProveedor: "",
    nombreContacto: "",
    identificacion: "",
    empleado: null,
    equipos: []
  });

  const [empleadoCodigo, setEmpleadoCodigo] = useState("");
  const [equipoCodigo, setEquipoCodigo] = useState("");
  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    UbicacionesService.obtenerTodas()
      .then(res => setUbicaciones(Array.isArray(res.data) ? res.data : res.data?.$values ?? []))
      .catch(() => toast.error("Error al cargar ubicaciones"));
  }, []);

  const handleBuscarEmpleado = () => {
    if (!empleadoCodigo.trim()) return;

    EmpleadosService.obtenerPorCodigo(empleadoCodigo.trim())
      .then(res => {
        setFormData(prev => ({
          ...prev,
          empleado: {
            empleadoId: empleadoCodigo.trim(),
            nombre: res.data?.nombre ?? "",
            puesto: res.data?.puesto ?? "",
            departamento: res.data?.departamento ?? ""
          }
        }));
      })
      .catch(() => toast.error("Empleado no encontrado"));
  };

  const handleAgregarEquipo = () => {
    if (!equipoCodigo.trim()) return;

    EquiposService.obtenerPorCodificacion(equipoCodigo.trim())
      .then(res => {
        const cod = res.data?.codificacion ?? "";
        if (!cod) return toast.error("Equipo inválido");

        const existe = formData.equipos.some(e => e.equipo === cod);
        if (existe) return toast.warning("Equipo ya agregado");

        setFormData(prev => ({
          ...prev,
          equipos: [
            ...prev.equipos,
            {
              equipo: cod,
              descripcionEquipo: res.data?.tipoEquipo ?? "",
              marca: res.data?.marca ?? "",
              modelo: res.data?.modelo ?? "",
              serie: res.data?.serie ?? ""
            }
          ]
        }));

        setEquipoCodigo("");
      })
      .catch(() => toast.error("Equipo no encontrado"));
  };

  const handleQuitarEquipo = (index) => {
    setFormData(prev => ({
      ...prev,
      equipos: prev.equipos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.no.trim()) return toast.error("Debe ingresar el No.");
    if (!formData.fechaPase) return toast.error("Debe ingresar la fecha del pase");
    if (!formData.empleado) return toast.error("Debe seleccionar un empleado");
    if (formData.equipos.length === 0) return toast.error("Debe agregar al menos un equipo");
    if (!formData.motivoSalida.trim()) return toast.error("Debe ingresar el motivo de salida");
    if (!formData.ubicacionRetorno) return toast.error("Debe seleccionar ubicación de retorno");

    TrasladosRetornoService.crear(formData)
      .then(() => {
        toast.success("Traslado registrado correctamente");

        setFormData({
          no: "",
          fechaPase: "",
          motivoSalida: "",
          ubicacionRetorno: "",
          fechaRetorno: "",
          codigoProveedor: "",
          telefonoProveedor: "",
          personaRetira: "",
          nombreProveedor: "",
          nombreContacto: "",
          identificacion: "",
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
    <div className="min-h-screen flex justify-center items-start px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-blue-900">
            Crear Pase de Salida con Retorno
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Completa los datos del pase, empleado y equipos
          </p>
        </div>

        <div className="p-6 max-h-[78vh] overflow-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Datos Generales
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No.</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.no}
                    onChange={e => setFormData({ ...formData, no: e.target.value })}
                    placeholder="Ej: PR-00012"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Pase</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.fechaPase}
                    onChange={e => setFormData({ ...formData, fechaPase: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Retorno</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.fechaRetorno}
                    onChange={e => setFormData({ ...formData, fechaRetorno: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Datos del Proveedor / Contacto
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Proveedor</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.codigoProveedor}
                    onChange={e => setFormData({ ...formData, codigoProveedor: e.target.value })}
                    placeholder="Ej: PROV-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Proveedor</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.telefonoProveedor}
                    onChange={e => setFormData({ ...formData, telefonoProveedor: e.target.value })}
                    placeholder="Ej: 5555-5555"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Proveedor</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.nombreProveedor}
                    onChange={e => setFormData({ ...formData, nombreProveedor: e.target.value })}
                    placeholder="Nombre del proveedor"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Contacto</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.nombreContacto}
                    onChange={e => setFormData({ ...formData, nombreContacto: e.target.value })}
                    placeholder="Nombre del contacto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Persona que Retira</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.personaRetira}
                    onChange={e => setFormData({ ...formData, personaRetira: e.target.value })}
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Identificación</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.identificacion}
                    onChange={e => setFormData({ ...formData, identificacion: e.target.value })}
                    placeholder="DPI / Pasaporte"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Empleado</h3>

              <div className="flex flex-col md:flex-row gap-3">
                <input
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={empleadoCodigo}
                  onChange={e => setEmpleadoCodigo(e.target.value)}
                  placeholder="Código de empleado"
                />
                <button
                  type="button"
                  onClick={handleBuscarEmpleado}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
                >
                  Buscar
                </button>
              </div>

              {formData.empleado && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <p className="text-gray-500">Código</p>
                    <p className="font-semibold text-gray-800">{formData.empleado.empleadoId}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 md:col-span-2">
                    <p className="text-gray-500">Nombre</p>
                    <p className="font-semibold text-gray-800">{formData.empleado.nombre}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <p className="text-gray-500">Departamento</p>
                    <p className="font-semibold text-gray-800">{formData.empleado.departamento}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 md:col-span-4">
                    <p className="text-gray-500">Puesto</p>
                    <p className="font-semibold text-gray-800">{formData.empleado.puesto}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Equipos</h3>

              <div className="flex flex-col md:flex-row gap-3">
                <input
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={equipoCodigo}
                  onChange={e => setEquipoCodigo(e.target.value)}
                  placeholder="Codificación del equipo"
                />
                <button
                  type="button"
                  onClick={handleAgregarEquipo}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
                >
                  Agregar
                </button>
              </div>

              {formData.equipos.length > 0 && (
                <div className="mt-4 overflow-x-auto bg-white border border-gray-200 rounded-xl">
                  <table className="min-w-[900px] w-full text-sm">
                    <thead className="bg-blue-800 text-white">
                      <tr>
                        <th className="p-3 text-left">Equipo</th>
                        <th className="p-3 text-left">Descripción</th>
                        <th className="p-3 text-left">Marca</th>
                        <th className="p-3 text-left">Modelo</th>
                        <th className="p-3 text-left">Serie</th>
                        <th className="p-3 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.equipos.map((eq, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="border-t border-gray-200 p-3">{eq.equipo}</td>
                          <td className="border-t border-gray-200 p-3">{eq.descripcionEquipo}</td>
                          <td className="border-t border-gray-200 p-3">{eq.marca}</td>
                          <td className="border-t border-gray-200 p-3">{eq.modelo}</td>
                          <td className="border-t border-gray-200 p-3">{eq.serie}</td>
                          <td className="border-t border-gray-200 p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleQuitarEquipo(i)}
                              className="text-red-600 font-semibold hover:text-red-800"
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Salida y Retorno</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Salida</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.motivoSalida}
                    onChange={e => setFormData({ ...formData, motivoSalida: e.target.value })}
                    placeholder="Ej: Reparación, garantía, proveedor..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación Retorno</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.ubicacionRetorno}
                    onChange={e => setFormData({ ...formData, ubicacionRetorno: e.target.value })}
                  >
                    <option value="">Seleccione una ubicación</option>
                    {ubicaciones.map((u) => (
                      <option key={u.id} value={u.nombre}>
                        {u.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-semibold transition"
              >
                Guardar Traslado
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearTrasladoRetorno;