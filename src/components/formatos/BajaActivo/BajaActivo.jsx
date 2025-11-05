import { useEffect, useState } from "react";
import BajaActivosService from "../../../services/BajaActivosServices";
import UbicacionesService from "../../../services/UbicacionesServices";
import EquiposService from "../../../services/EquiposServices";

export default function BajaActivosForm() {
  const [form, setForm] = useState({
    fechaBaja: new Date().toISOString().split("T")[0],
    codificacionEquipo: "",
    motivoBaja: [],
    detallesBaja: "",
    ubicacionActual: "",
    ubicacionDestino: "",
  });

  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");


  useEffect(() => {
    UbicacionesService.obtenerTodas()
      .then((res) => {
        const filtradas = res.data.filter(
          (u) =>
            u.nombre.toLowerCase() === "robado" ||
            u.nombre.toLowerCase() === "donación"
        );

        setUbicaciones(filtradas);
      })
      .catch(() => console.error("Error al cargar ubicaciones"));
  }, []);


  const buscarUbicacionActual = async (codificacion) => {
    if (!codificacion) return;

    try {
      const res = await EquiposService.obtenerPorCodificacion(codificacion);
      if (res.data) {
        setForm((prev) => ({
          ...prev,
          ubicacionActual: res.data.ubicacion || "No registrada",
        }));
      } else {
        setForm((prev) => ({ ...prev, ubicacionActual: "No encontrada" }));
      }
    } catch {
      setForm((prev) => ({ ...prev, ubicacionActual: "No encontrada" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "codificacionEquipo") {
      buscarUbicacionActual(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      await BajaActivosService.crear(form);
      setMensaje("✅ Baja registrada correctamente");
      setForm({
        fechaBaja: new Date().toISOString().split("T")[0],
        codificacionEquipo: "",
        motivoBaja: [],
        detallesBaja: "",
        ubicacionActual: "",
        ubicacionDestino: "",
      });
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al registrar la baja");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setForm((prev) => {
      if (checked) {
        return { ...prev, motivoBaja: [...prev.motivoBaja, value] };
      } else {
        return {
          ...prev,
          motivoBaja: prev.motivoBaja.filter((m) => m !== value),
        };
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Registrar Baja de Activo
      </h2>

      {mensaje && (
        <div
          className={`mb-4 p-3 rounded-lg text-center ${mensaje.includes("✅")
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {mensaje}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Fecha de Baja</label>
          <input
            type="date"
            name="fechaBaja"
            value={form.fechaBaja}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Codificación del Equipo
          </label>
          <input
            type="text"
            name="codificacionEquipo"
            value={form.codificacionEquipo}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="Ejemplo: EQ-00045"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Ubicación Actual
          </label>
          <input
            type="text"
            name="ubicacionActual"
            value={form.ubicacionActual}
            readOnly
            className="w-full border bg-gray-100 rounded-lg p-2 mt-1"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Ubicación Destino
          </label>
          <select
            name="ubicacionDestino"
            value={form.ubicacionDestino}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          >
            <option value="">Selecciona una ubicación</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.nombre}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Motivo de Baja</label>

          {["Obsolencia", "Venta", "Robo", "Donación", "Otro"].map((motivo) => (
            <label key={motivo} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                name="motivoBaja"
                value={motivo}
                checked={form.motivoBaja.includes(motivo)}
                onChange={handleCheckboxChange}
              />
              {motivo}
            </label>
          ))}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Detalles</label>
          <textarea
            name="detallesBaja"
            value={form.detallesBaja}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            rows="3"
            placeholder="Detalles adicionales de la baja..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 mt-2 text-white rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Guardando..." : "Registrar Baja"}
        </button>
      </form>
    </div>
  );
}
