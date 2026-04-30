import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmpleadosExternosService from "../../services/EmpleadosExternosServices";

export default function ListaEmpleadosExternos() {
  const [externos, setExternos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRol(localStorage.getItem("rol"));
    cargar();
  }, []);

  const cargar = async () => {
    try {
      const res = await EmpleadosExternosService.listar();
      setExternos(res.data);
    } catch {
      toast.error("Error al cargar empleados externos");
    }
  };

  const desactivar = async (id, nombre) => {
    if (!confirm(`¿Desactivar a "${nombre}"?`)) return;
    try {
      await EmpleadosExternosService.desactivar(id);
      toast.success("Empleado externo desactivado");
      cargar();
    } catch {
      toast.error("Error al desactivar");
    }
  };

  const filtrados = externos.filter(
    (e) =>
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.codigoEmpleado.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.documento.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Empleados Externos</h1>
        {rol === "Administrador" && (
          <button
            onClick={() => navigate("/externos/crear")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-semibold"
          >
            + Registrar externo
          </button>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, código o documento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-field max-w-sm"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-4 py-2 border">Código</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Puesto</th>
              <th className="px-4 py-2 border">Documento</th>
              <th className="px-4 py-2 border">Teléfono</th>
              <th className="px-4 py-2 border">Fecha Registro</th>
              {rol === "Administrador" && (
                <th className="px-4 py-2 border text-center">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td
                  colSpan={rol === "Administrador" ? 7 : 6}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No se encontraron empleados externos.
                </td>
              </tr>
            ) : (
              filtrados.map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border font-mono">{e.codigoEmpleado}</td>
                  <td className="px-4 py-2 border">{e.nombre}</td>
                  <td className="px-4 py-2 border">{e.puesto}</td>
                  <td className="px-4 py-2 border">{e.documento}</td>
                  <td className="px-4 py-2 border">{e.telefono || "—"}</td>
                  <td className="px-4 py-2 border">
                    {new Date(e.fechaRegistro).toLocaleDateString("es-GT")}
                  </td>
                  {rol === "Administrador" && (
                    <td className="px-4 py-2 border">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => navigate(`/externos/editar/${e.id}`)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => desactivar(e.id, e.nombre)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Desactivar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
