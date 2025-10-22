import { useEffect, useState } from "react";
import SuministrosService from "../../services/SuministrosService";
import InventarioService from "../../services/InventarioService";
import UbicacionesService from "../../services/UbicacionesServices";

export default function MovimientosForm() {
  const [suministros, setSuministros] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [form, setForm] = useState({
    SuministroId: 0,
    TipoMovimiento: "Entrada",
    UbicacionOrigenId: null,
    UbicacionDestinoId: null,
    Cantidad: 1,
    RealizadoPor: "",
    Observacion: ""
  });

  useEffect(() => {
    SuministrosService.obtenerTodos().then(r => setSuministros(r.data));
    UbicacionesService.obtenerTodas().then(r => setUbicaciones(r.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      suministroId: Number(form.SuministroId),
      tipoMovimiento: form.TipoMovimiento,
      ubicacionOrigenId: form.UbicacionOrigenId ? Number(form.UbicacionOrigenId) : null,
      ubicacionDestinoId: form.UbicacionDestinoId ? Number(form.UbicacionDestinoId) : null,
      cantidad: Number(form.Cantidad),
      realizadoPor: form.RealizadoPor,
      observacion: form.Observacion
    };

    try {
      await InventarioService.registrarMovimiento(payload);
      alert("Movimiento registrado");
    } catch (err) {
      console.error(err);
      alert("Error al registrar movimiento");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center p-4">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Registrar Movimiento de Suministro
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Suministro
          </label>
          <select
            name="SuministroId"
            value={form.SuministroId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value={0}>Seleccione suministro</option>
            {suministros.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Tipo de Movimiento
          </label>
          <select
            name="TipoMovimiento"
            value={form.TipoMovimiento}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option>Entrada</option>
            <option>Salida</option>
            <option>Traslado</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Ubicación Origen
          </label>
          <select
            name="UbicacionOrigenId"
            value={form.UbicacionOrigenId ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Origen (opcional) --</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Ubicación Destino
          </label>
          <select
            name="UbicacionDestinoId"
            value={form.UbicacionDestinoId ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Destino (opcional) --</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Cantidad
          </label>
          <input
            type="number"
            name="Cantidad"
            value={form.Cantidad}
            min={1}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Realizado por
          </label>
          <input
            type="text"
            name="RealizadoPor"
            value={form.RealizadoPor}
            onChange={handleChange}
            placeholder="Usuario"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Observación
        </label>
        <textarea
          name="Observacion"
          value={form.Observacion}
          onChange={handleChange}
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Registrar
        </button>
      </div>
    </form>
  </div>
);
}
