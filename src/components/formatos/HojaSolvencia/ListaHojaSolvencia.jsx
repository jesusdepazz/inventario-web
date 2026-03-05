import { useEffect, useMemo, useState } from "react";
import SolvenciasService from "../../../services/HojasSolvencias";
import { PDFDownloadLink } from "@react-pdf/renderer";
import HojaSolvenciaPDF from "./HojaSolvenciaPDF";

export default function ListaHojaSolvencia() {
  const [historico, setHistorico] = useState([]);
  const [q, setQ] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await SolvenciasService.listarHistorico();
        const normalizado = Array.isArray(data?.$values) ? data.$values : data;
        setHistorico(Array.isArray(normalizado) ? normalizado : []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const parseRow = (h) => {
    const primerEmpleado = (h.empleados || "").split(",")[0] || "";
    const partes = primerEmpleado.split(" - ");
    const codigo = (partes[0] || "").trim();
    const nombre = (partes[1] || "").trim();
    const puesto = (partes[2] || "").trim();
    const depto = (partes[3] || "").trim();

    const fecha = h.fechaSolvencia ? new Date(h.fechaSolvencia) : null;
    const fechaISO = fecha ? fecha.toISOString().slice(0, 10) : "";

    return {
      solvenciaNo: h.solvenciaNo ?? "",
      hojaNo: h.hojaNo ?? "",
      observaciones: h.observaciones ?? "",
      fecha,
      fechaISO,
      codigo,
      nombre,
      puesto,
      depto,
      raw: h,
    };
  };

  const rows = useMemo(() => historico.map(parseRow), [historico]);

  const filtrados = useMemo(() => {
    const qq = q.trim().toLowerCase();

    return rows.filter((r) => {
      if (desde && r.fechaISO && r.fechaISO < desde) return false;
      if (hasta && r.fechaISO && r.fechaISO > hasta) return false;

      if (!qq) return true;

      const blob = [
        r.solvenciaNo,
        r.hojaNo,
        r.observaciones,
        r.fechaISO,
        r.codigo,
        r.nombre,
        r.puesto,
        r.depto,
      ]
        .join(" ")
        .toLowerCase();

      return blob.includes(qq);
    });
  }, [rows, q, desde, hasta]);

  const limpiar = () => {
    setQ("");
    setDesde("");
    setHasta("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Solvencias</h2>
              <p className="text-gray-600">Historial de solvencias generadas.</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">
                Total: {filtrados.length}
              </span>
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Buscar
                </label>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Solvencia, hoja, código, nombre, puesto, depto, observaciones..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Desde
                </label>
                <input
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hasta
                </label>
                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <div className="md:col-span-12 flex justify-end">
                <button
                  onClick={limpiar}
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="min-w-[1200px] w-full text-sm text-left">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Solvencia No.</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Puesto</th>
                <th className="px-4 py-3 font-semibold">Departamento</th>
                <th className="px-4 py-3 font-semibold">Hoja No.</th>
                <th className="px-4 py-3 font-semibold">Observaciones</th>
                <th className="px-4 py-3 font-semibold text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.length > 0 ? (
                filtrados.map((r, i) => (
                  <tr
                    key={r.raw?.id ?? `${r.solvenciaNo}-${i}`}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-3 border-t border-gray-200 font-bold text-blue-900">
                      {r.solvenciaNo}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-200">
                      {r.fecha ? r.fecha.toLocaleDateString("es-ES") : "—"}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-200">{r.codigo || "—"}</td>
                    <td className="px-4 py-3 border-t border-gray-200">{r.nombre || "—"}</td>
                    <td className="px-4 py-3 border-t border-gray-200">{r.puesto || "—"}</td>
                    <td className="px-4 py-3 border-t border-gray-200">{r.depto || "—"}</td>
                    <td className="px-4 py-3 border-t border-gray-200">{r.hojaNo || "—"}</td>
                    <td className="px-4 py-3 border-t border-gray-200">
                      {r.observaciones || "—"}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-200 text-center">
                      <PDFDownloadLink
                        document={<HojaSolvenciaPDF data={r.raw} />}
                        fileName={`HojaSolvencia-${r.raw?.id ?? r.solvenciaNo}.pdf`}
                      >
                        {({ loading }) => (
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                            disabled={loading}
                          >
                            {loading ? "Generando..." : "Descargar PDF"}
                          </button>
                        )}
                      </PDFDownloadLink>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-gray-600">
                    No hay solvencias para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Tip: podés filtrar por rango de fechas y buscar por cualquier campo.
        </p>
      </div>
    </div>
  );
}