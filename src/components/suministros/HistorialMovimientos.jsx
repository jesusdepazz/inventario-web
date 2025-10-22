import React, { useEffect, useState } from "react";
import InventarioService from "../../services/InventarioService";
import { toast } from "react-toastify";

const HistorialMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarMovimientos = async () => {
    try {
      setLoading(true);
      const res = await InventarioService.obtenerMovimientos();
      setMovimientos(res.data);
    } catch (err) {
      console.error("Error al cargar movimientos:", err);
      toast.error("No se pudo obtener el historial de movimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Historial de Movimientos</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
        {loading ? (
          <p className="text-center text-gray-500">Cargando movimientos...</p>
        ) : movimientos.length === 0 ? (
          <p className="text-center text-gray-500">No hay movimientos registrados.</p>
        ) : (
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-indigo-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Suministro</th>
                <th className="px-4 py-2 border">Cantidad</th>
                <th className="px-4 py-2 border">Tipo</th>
                <th className="px-4 py-2 border">Origen</th>
                <th className="px-4 py-2 border">Destino</th>
                <th className="px-4 py-2 border">Fecha</th>
                <th className="px-4 py-2 border">Realizado por</th>
                <th className="px-4 py-2 border">Observación</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov, idx) => (
                <tr key={mov.id} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border">{idx + 1}</td>
                  <td className="px-4 py-2 border">{mov.suministro?.nombre || "N/A"}</td>
                  <td className="px-4 py-2 border">{mov.cantidad}</td>
                  <td className="px-4 py-2 border">{mov.tipoMovimiento}</td>
                  <td className="px-4 py-2 border">{mov.ubicacionOrigen?.nombre || "-"}</td>
                  <td className="px-4 py-2 border">{mov.ubicacionDestino?.nombre || "-"}</td>
                  <td className="px-4 py-2 border">
                    {new Date(mov.fechaMovimiento).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">{mov.realizadoPor}</td>
                  <td className="px-4 py-2 border">{mov.observacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistorialMovimientos;
