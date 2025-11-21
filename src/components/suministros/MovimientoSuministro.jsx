import { useState, useEffect } from "react";
import SuministrosService from "../../services/SuministrosService";
import EntradaSuministroService from "../../services/EntradasSuministrosServices";
import SalidaSuministroService from "../../services/SalidasSuministrosServices";
import UbicacionesService from "../../services/UbicacionesServices";
import EmpleadosService from "../../services/EmpleadosServices";

export default function Movimientos() {
  const [suministros, setSuministros] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
  const [formData, setFormData] = useState({
    suministroId: "",
    cantidad: "",
    destino: "",
    personaResponsable: "",
    departamentoResponsable: "",
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [suministrosRes, ubicacionesRes] = await Promise.all([
          SuministrosService.obtenerTodos(),
          UbicacionesService.obtenerTodas(),
        ]);
        setSuministros(suministrosRes.data);
        setUbicaciones(ubicacionesRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setMensaje("Error cargando datos ❌");
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "personaResponsable") {
      buscarEmpleado(e.target.value);
    }
  };

  const buscarEmpleado = async (texto) => {
    if (texto.length < 2) {
      setSugerencias([]);
      return;
    }
    try {
      const { data } = await EmpleadosService.buscarPorNombre(texto);
      setSugerencias(data || []);
    } catch (error) {
      console.error(error);
      setSugerencias([]);
    }
  };

  const seleccionarEmpleado = (empleado) => {
    setFormData({
      ...formData,
      personaResponsable: empleado.nombre,
      departamentoResponsable: empleado.departamento,
    });
    setSugerencias([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    if (!formData.suministroId || !formData.cantidad || parseInt(formData.cantidad) <= 0) {
      setMensaje("Debe seleccionar un suministro y una cantidad válida ❌");
      setLoading(false);
      return;
    }

    if (tipoMovimiento === "salida" && (!formData.destino || !formData.personaResponsable)) {
      setMensaje("Debe indicar el destino y la persona responsable ❌");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        suministroId: parseInt(formData.suministroId),
        cantidadProducto: parseInt(formData.cantidad),
      };

      if (tipoMovimiento === "entrada") {
        await EntradaSuministroService.crear(payload);
        setMensaje("Entrada registrada correctamente ✔️");
      } else {
        payload.destino = formData.destino;
        payload.personaResponsable = formData.personaResponsable;
        payload.departamentoResponsable = formData.departamentoResponsable;
        await SalidaSuministroService.crear(payload);
        setMensaje("Salida registrada correctamente ✔️");
      }

      setFormData({
        suministroId: "",
        cantidad: "",
        destino: "",
        persona: "",
        departamentoResponsable: "",
      });
    } catch (error) {
      console.error(error);
      if (error.response?.data?.errors) {
        setMensaje("Error del backend: " + JSON.stringify(error.response.data.errors));
      } else if (error.response?.data?.title) {
        setMensaje("Error: " + error.response.data.title);
      } else {
        setMensaje("Error al registrar el movimiento ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Registrar Movimiento</h2>

      {mensaje && (
        <div
          className={`p-3 mb-4 rounded-lg ${
            mensaje.includes("✔️") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Tipo de Movimiento</label>
          <select
            name="tipoMovimiento"
            value={tipoMovimiento}
            onChange={(e) => setTipoMovimiento(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Suministro</label>
          <select
            name="suministroId"
            value={formData.suministroId}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg bg-white focus:ring focus:ring-blue-300"
          >
            <option value="">Seleccione un suministro</option>
            {suministros.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombreProducto} (Cantidad actual: {s.cantidadActual})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Cantidad</label>
          <input
            type="number"
            min="1"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Cantidad a registrar"
          />
        </div>

        {tipoMovimiento === "salida" && (
          <>
            <div>
              <label className="block font-medium text-gray-700">Destino</label>
              <select
                name="destino"
                value={formData.destino}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="">Seleccione destino</option>
                {ubicaciones.map((ubic) => (
                  <option key={ubic.id} value={ubic.nombre}>
                    {ubic.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block font-medium text-gray-700">Persona Responsable</label>
              <input
                type="text"
                name="personaResponsable"
                value={formData.personaResponsable}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Escribe el nombre"
                autoComplete="off"
              />
              {sugerencias.length > 0 && (
                <ul className="absolute border rounded-md mt-1 max-h-40 overflow-auto bg-white z-10 w-full">
                  {sugerencias.map((emp) => (
                    <li
                      key={emp.codigoEmpleado}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => seleccionarEmpleado(emp)}
                    >
                      {emp.nombre} ({emp.departamento})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700">Departamento Responsable</label>
              <input
                type="text"
                name="departamentoResponsable"
                value={formData.departamentoResponsable}
                readOnly
                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Guardando..." : "Registrar Movimiento"}
        </button>
      </form>
    </div>
  );
}
