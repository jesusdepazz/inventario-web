import { useEffect, useMemo, useState } from "react";
import BajaActivosService from "../../../services/BajaActivosServices";
import { generarBajaPDF } from "./BajaActivoPDF";

export default function ListabajaAtivos() {
  const [bajas, setBajas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  useEffect(() => {
    const cargarBajas = async () => {
      try {
        const res = await BajaActivosService.obtenerTodas();
        const data = Array.isArray(res.data) ? res.data : res.data?.$values ?? [];
        setBajas(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el historial de bajas");
      } finally {
        setLoading(false);
      }
    };

    cargarBajas();
  }, []);

  const parseMotivo = (motivoBaja) => {
    if (!motivoBaja) return "";
    try {
      const arr = JSON.parse(motivoBaja);
      return Array.isArray(arr) ? arr.join(", ") : String(motivoBaja);
    } catch {
      return String(motivoBaja);
    }
  };

  const toYmd = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const enRango = (fecha, d, h) => {
    const ymd = toYmd(fecha);
    if (!ymd) return false;
    if (d && ymd < d) return false;
    if (h && ymd > h) return false;
    return true;
  };

  const bajasFiltradas = useMemo(() => {
    const term = q.trim().toLowerCase();

    return (bajas || []).filter((b) => {
      const motivo = parseMotivo(b.motivoBaja);
      const hayTerm =
        !term ||
        String(b.codificacionEquipo || "").toLowerCase().includes(term) ||
        String(motivo || "").toLowerCase().includes(term) ||
        String(b.detallesBaja || "").toLowerCase().includes(term) ||
        String(b.ubicacionActual || "").toLowerCase().includes(term) ||
        String(b.ubicacionDestino || "").toLowerCase().includes(term) ||
        String(b.id || "").toLowerCase().includes(term);

      const okFecha = !desde && !hasta ? true : enRango(b.fechaBaja, desde, hasta);

      return hayTerm && okFecha;
    });
  }, [bajas, q, desde, hasta]);

  const limpiar = () => {
    setQ("");
    setDesde("");
    setHasta("");
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Cargando historial...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 font-medium">{error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Bajas</h2>
            <p className="text-sm text-gray-500">Historial de bajas registradas.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-gray-50 text-gray-700">
              total: {bajasFiltradas.length}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-gray-50 text-gray-700">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
              })}
            </span>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Codificación, motivo, detalles, ubicación..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Desde</label>
              <input
                type="date"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hasta</label>
              <input
                type="date"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-12 flex justify-end">
              <button
                type="button"
                onClick={limpiar}
                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {bajasFiltradas.length === 0 ? (
            <div className="text-center py-10 text-gray-600">No hay bajas registradas.</div>
          ) : (
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="max-h-[60vh] overflow-auto">
                <table className="min-w-[1200px] w-full text-sm text-left">
                  <thead className="sticky top-0 bg-blue-800 text-white">
                    <tr>
                      <th className="p-3 font-semibold">#</th>
                      <th className="p-3 font-semibold">Fecha Baja</th>
                      <th className="p-3 font-semibold">Codificación</th>
                      <th className="p-3 font-semibold">Motivo</th>
                      <th className="p-3 font-semibold">Detalles</th>
                      <th className="p-3 font-semibold">Ubicación Actual</th>
                      <th className="p-3 font-semibold">Ubicación Destino</th>
                      <th className="p-3 font-semibold text-center">Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bajasFiltradas.map((baja, index) => {
                      const motivo = parseMotivo(baja.motivoBaja);
                      return (
                        <tr
                          key={baja.id}
                          className={`border-t border-gray-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 transition-colors`}
                        >
                          <td className="p-3 text-center font-semibold text-gray-700">{index + 1}</td>
                          <td className="p-3 text-center">
                            {baja.fechaBaja ? new Date(baja.fechaBaja).toLocaleDateString() : "-"}
                          </td>
                          <td className="p-3 font-semibold text-blue-800">{baja.codificacionEquipo}</td>
                          <td className="p-3">{motivo || "-"}</td>
                          <td className="p-3">{baja.detallesBaja || "-"}</td>
                          <td className="p-3">{baja.ubicacionActual || "-"}</td>
                          <td className="p-3 font-semibold text-gray-900">{baja.ubicacionDestino || "-"}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => generarBajaPDF(baja.id)}
                              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                            >
                              Descargar PDF
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                Tip: podés filtrar por rango de fechas y buscar por cualquier campo.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}