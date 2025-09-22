import React, { useState, useEffect } from "react";
import { FaClipboardList, FaSave } from "react-icons/fa";
import HojasService from "../../../services/HojasServices";
import SolvenciasService from "../../../services/HojasSolvencias";

export default function HojaSolvencia() {
  const [hojas, setHojas] = useState([]);
  const [selectedHoja, setSelectedHoja] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [detalleHoja, setDetalleHoja] = useState(null);

  useEffect(() => {
    const fetchHojas = async () => {
      try {
        const data = await HojasService.listarHojas();
        setHojas(data);
      } catch (err) {
        console.error("Error cargando hojas:", err);
      }
    };
    fetchHojas();
  }, []);

  const handleHojaChange = (id) => {
    setSelectedHoja(id);
    const hoja = hojas.find((h) => h.id.toString() === id);
    setDetalleHoja(hoja || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHoja) {
      setMensaje("⚠️ Debes seleccionar una hoja de responsabilidad.");
      return;
    }

    try {
      const res = await SolvenciasService.crearSolvencia(
        selectedHoja,
        observaciones
      );
      setMensaje(`✅ Solvencia creada con No: ${res.solvenciaNo}`);
      setObservaciones("");
      setSelectedHoja("");
      setDetalleHoja(null);
    } catch (err) {
      console.error("Error creando solvencia:", err);
      setMensaje("❌ Error al crear la solvencia.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaClipboardList className="text-blue-600" /> Crear Solvencia
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Selecciona una Hoja de Responsabilidad
            </label>
            <select
              value={selectedHoja}
              onChange={(e) => handleHojaChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Selecciona una hoja --</option>
              {hojas.map((h) => (
                <option key={h.id} value={h.id}>
                  📑 Hoja {h.hojaNo} |{" "}
                  {new Date(h.fechaCreacion).toLocaleDateString()} | {h.estado}
                </option>
              ))}
            </select>
          </div>
          {detalleHoja && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                📄 Detalle de la Hoja
              </h3>
              <p>
                <span className="font-medium">Hoja No:</span>{" "}
                {detalleHoja.hojaNo}
              </p>
              <p>
                <span className="font-medium">Fecha Creación:</span>{" "}
                {new Date(detalleHoja.fechaCreacion).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Estado:</span>{" "}
                {detalleHoja.estado}
              </p>
            </div>
          )}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={4}
              placeholder="Escribe alguna observación..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 shadow-lg transition-all"
          >
            <FaSave /> Crear Solvencia
          </button>
        </form>
        {mensaje && (
          <p className="mt-6 text-center font-medium text-lg text-gray-700">
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
