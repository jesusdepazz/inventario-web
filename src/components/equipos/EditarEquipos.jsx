import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import EquiposServices from "../../services/EquiposServices";
import UbicacionesService from "../../services/UbicacionesServices";

const EditarEquipo = () => {
  const [codificacion, setCodificacion] = useState("");
  const [equipo, setEquipo] = useState(null);
  const [ubicaciones, setUbicaciones] = useState([]);

  // 🔍 Buscar equipo
  const buscarEquipo = async () => {
    try {
      const { data } = await EquiposServices.obtenerPorCodificacion(codificacion);
      console.log("EQUIPO RECIBIDO:", data);
      setEquipo(data);
    } catch {
      toast.error("Equipo no encontrado");
    }
  };

  // 📍 Cargar ubicaciones cuando hay equipo
  useEffect(() => {
    if (!equipo) return;

    const cargarUbicaciones = async () => {
      try {
        const { data } = await UbicacionesService.obtenerTodas();
        setUbicaciones(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Error al cargar ubicaciones");
      }
    };

    cargarUbicaciones();
  }, [equipo]);

  // ✏️ Cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipo((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Guardar
  const guardarCambios = async () => {
    try {
      await EquiposServices.editar(equipo.id, equipo);
      toast.success("Equipo actualizado correctamente");
      setEquipo(null);
      setCodificacion("");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar equipo");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-5xl space-y-8">

        {/* BUSCADOR */}
        {!equipo && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Buscar equipo por codificación
            </h2>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Ej: EQ-00123"
                value={codificacion}
                onChange={(e) => setCodificacion(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={buscarEquipo}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg
                           hover:bg-indigo-700 transition font-semibold"
              >
                Buscar
              </button>
            </div>
          </div>
        )}

        {/* FORMULARIO */}
        {equipo && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Editar equipo
              </h2>
              <span className="text-sm text-gray-500">
                ID #{equipo.id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Codificación */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Codificación
                </label>
                <input
                  value={equipo.codificacion}
                  readOnly
                  className="w-full border bg-gray-100 text-gray-500
                             px-4 py-2 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Marca
                </label>
                <input
                  name="marca"
                  value={equipo.marca || ""}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg
                             focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Modelo
                </label>
                <input
                  name="modelo"
                  value={equipo.modelo || ""}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg
                             focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Serie */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Serie
                </label>
                <input
                  name="serie"
                  value={equipo.serie || ""}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg
                             focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Ubicación
                </label>
                <select
                  name="ubicacion"
                  value={equipo.ubicacion || ""}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg
                             focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Seleccione ubicación</option>
                  {ubicaciones.map((u) => (
                    <option key={u.id} value={u.nombre}>
                      {u.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Estado
                </label>
                <input
                  name="estado"
                  value={equipo.estado || ""}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg
                             focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-center gap-6 pt-6">
              <button
                onClick={guardarCambios}
                className="bg-green-600 text-white px-8 py-3 rounded-xl
                           hover:bg-green-700 transition font-semibold"
              >
                Guardar cambios
              </button>

              <button
                onClick={() => setEquipo(null)}
                className="bg-gray-300 text-gray-800 px-8 py-3 rounded-xl
                           hover:bg-gray-400 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarEquipo;
