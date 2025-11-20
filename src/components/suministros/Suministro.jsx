import { useState, useEffect } from "react";
import SuministrosService from "../../services/SuministrosService";
import UbicacionesService from "../../services/UbicacionesServices";

export default function Suministros() {
  const [formData, setFormData] = useState({
    nombreProducto: "",
    ubicacionProducto: "",
    cantidadActual: "",
  });

  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loadingUbicaciones, setLoadingUbicaciones] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const cargarUbicaciones = async () => {
      try {
        const response = await UbicacionesService.obtenerTodas();
        setUbicaciones(response.data);
      } catch (error) {
        console.error("Error cargando ubicaciones", error);
      } finally {
        setLoadingUbicaciones(false);
      }
    };

    cargarUbicaciones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      await SuministrosService.crear(formData);
      setMensaje("Suministro creado exitosamente ✔️");

      setFormData({
        nombreProducto: "",
        ubicacionProducto: "",
        cantidadActual: ""
      });
    } catch (error) {
      setMensaje("Error al crear el suministro ❌");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Crear Suministro</h2>

      {mensaje && (
        <div
          className={`p-3 mb-4 rounded-lg ${mensaje.includes("✔️")
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Nombre del Producto</label>
          <input
            type="text"
            name="nombreProducto"
            value={formData.nombreProducto}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Ejemplo: Tornillos de 1”"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Ubicación</label>

          {loadingUbicaciones ? (
            <p className="text-sm text-gray-500">Cargando ubicaciones...</p>
          ) : (
            <select
              name="ubicacionProducto"
              value={formData.ubicacionProducto}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg bg-white focus:ring focus:ring-blue-300"
            >
              <option value="">Seleccione una ubicación</option>

              {ubicaciones.map((u) => (
                <option key={u.id} value={u.nombre}>
                  {u.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Cantidad Inicial</label>
          <input
            type="number"
            min="0"
            name="cantidadActual"
            value={formData.cantidadActual}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Ejemplo: 10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Guardando..." : "Crear Suministro"}
        </button>
      </form>
    </div>
  );
}
