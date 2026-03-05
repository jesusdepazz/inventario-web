import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import TrasladosRetornoService from "../../../services/TrasladosRetornoService";
import PdfTrasladosRetorno from "./TrasladosRetornoPDF";
import { pdf } from "@react-pdf/renderer";

const TrasladosRetornoLista = () => {
  const [traslados, setTraslados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarTraslados = () => {
    setCargando(true);
    TrasladosRetornoService.obtenerTodos()
      .then((res) => {
        const data = res?.data?.$values ?? res?.data ?? [];
        setTraslados(Array.isArray(data) ? data : []);
      })
      .catch(() => toast.error("Error al obtener traslados"))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarTraslados();
  }, []);

  const filtrar = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return traslados;

    return traslados.filter((t) => {
      const no = (t.no ?? "").toLowerCase();
      const solicitante = (t.empleado?.empleadoId ?? "").toLowerCase();
      const ubicacion = (t.ubicacionRetorno ?? "").toLowerCase();
      const motivo = (t.motivoSalida ?? "").toLowerCase();

      return (
        no.includes(q) ||
        solicitante.includes(q) ||
        ubicacion.includes(q) ||
        motivo.includes(q)
      );
    });
  }, [traslados, busqueda]);

  const descargarPDF = async (id) => {
    try {
      const res = await TrasladosRetornoService.obtenerDetalle(id);
      const detalle = res?.data?.$values ?? res?.data ?? res?.data;

      const blob = await pdf(<PdfTrasladosRetorno data={detalle} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `TrasladoRetorno-${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Error al generar el PDF");
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleDateString("es-GT", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return String(fecha);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="text-center">
            <p className="font-bold text-lg">Guatemalan Candies, S.A.</p>
            <p className="font-bold text-lg text-blue-600">
              Listado de Traslados con retorno - Equipo de cómputo
            </p>
            <p className="font-bold text-lg">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Buscar por No., Solicitante, Ubicación o Motivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full md:w-[520px] border border-gray-300 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={cargarTraslados}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Actualizar
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <div className="max-h-[65vh] overflow-y-auto">
              <table className="min-w-[1400px] w-full text-sm text-left">
                <thead className="bg-blue-800 text-white sticky top-0 z-10">
                  <tr>
                    <th className="p-3 border-r border-blue-700">No.</th>
                    <th className="p-3 border-r border-blue-700 text-center">Fecha Pase</th>
                    <th className="p-3 border-r border-blue-700">Solicitante</th>
                    <th className="p-3 border-r border-blue-700">Equipos</th>
                    <th className="p-3 border-r border-blue-700">Motivo</th>
                    <th className="p-3 border-r border-blue-700">Ubicación Retorno</th>
                    <th className="p-3 border-r border-blue-700 text-center">Fecha Retorno</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {cargando ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-gray-500">
                        Cargando traslados...
                      </td>
                    </tr>
                  ) : filtrar.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-gray-500">
                        No se encontraron registros
                      </td>
                    </tr>
                  ) : (
                    filtrar.map((t, idx) => (
                      <tr
                        key={t.id}
                        className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}
                      >
                        <td className="p-3 border-t border-gray-200 font-semibold text-gray-800">
                          {t.no}
                        </td>

                        <td className="p-3 border-t border-gray-200 text-center text-gray-700">
                          {formatearFecha(t.fechaPase)}
                        </td>

                        <td className="p-3 border-t border-gray-200 text-gray-700">
                          <div className="font-semibold text-gray-800">
                            {t.empleado?.empleadoId || "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t.empleado?.nombre || ""}
                          </div>
                        </td>

                        <td className="p-3 border-t border-gray-200">
                          {t.equipos?.length ? (
                            <div className="flex flex-wrap gap-1">
                              {t.equipos.map((e, i) => (
                                <span
                                  key={i}
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {e.equipo}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        <td className="p-3 border-t border-gray-200 text-gray-700 max-w-[380px]">
                          <div className="line-clamp-2">{t.motivoSalida || "—"}</div>
                        </td>

                        <td className="p-3 border-t border-gray-200 text-gray-700">
                          {t.ubicacionRetorno || "—"}
                        </td>

                        <td className="p-3 border-t border-gray-200 text-center text-gray-700">
                          {formatearFecha(t.fechaRetorno)}
                        </td>

                        <td className="p-3 border-t border-gray-200 text-center">
                          <button
                            onClick={() => descargarPDF(t.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-xs transition"
                          >
                            Descargar PDF
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
            <span>
              Registros: <b>{filtrar.length}</b>
            </span>
            <span className="text-gray-400">
              Tip: puedes buscar por No., solicitante, ubicación o motivo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrasladosRetornoLista;