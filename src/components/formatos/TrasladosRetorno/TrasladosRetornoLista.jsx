import { useEffect, useState } from "react";
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
      .then((res) => setTraslados(res.data))
      .catch(() => toast.error("Error al obtener traslados"))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarTraslados();
  }, []);

  const filtrar = traslados.filter(
    (t) =>
      t.no?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.solicitante?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const descargarPDF = async (id) => {
    try {
      const res = await TrasladosRetornoService.obtenerDetalle(id);

      const blob = await pdf(
        <PdfTrasladosRetorno data={res.data} />
      ).toBlob();

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
    if (!fecha) return "";
    try {
      return new Date(fecha).toLocaleDateString("es-GT", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow max-w-7xl mx-auto">
      <div className="text-center mb-4">
        <p className="font-bold text-lg">Guatemalan Candies, S.A.</p>
        <p className="font-bold text-lg text-blue-500">Listado de Traslados con retorno - Equipo de cómputo</p>
        <p className="font-bold text-lg">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por No. o Solicitante..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="p-2 border">No.</th>
              <th className="p-2 border">Fecha Pase</th>
              <th className="p-2 border">Solicitante</th>
              <th className="p-2 border">Equipo</th>
              <th className="p-2 border">Motivo</th>
              <th className="p-2 border">Ubicación Retorno</th>
              <th className="p-2 border">Fecha Retorno</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  Cargando traslados...
                </td>
              </tr>
            ) : filtrar.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              filtrar.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <td className="p-2 border text-center">{t.no}</td>
                  <td className="p-2 border text-center">
                    {formatearFecha(t.fechaPase)}
                  </td>
                  <td className="p-2 border">{t.solicitante}</td>
                  <td className="p-2 border">{t.equipo}</td>
                  <td className="p-2 border">{t.motivoSalida}</td>
                  <td className="p-2 border">{t.ubicacionRetorno}</td>
                  <td className="p-2 border text-center">
                    {formatearFecha(t.fechaRetorno)}
                  </td>
                  <td
                    className={`p-2 border text-center font-semibold ${t.status?.toLowerCase() === "pendiente"
                      ? "text-yellow-600"
                      : t.status?.toLowerCase() === "completado"
                        ? "text-green-600"
                        : "text-gray-700"
                      }`}
                  >
                    {t.status}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => descargarPDF(t.id)}
                      className="text-blue-600 hover:underline"
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
  );
};

export default TrasladosRetornoLista;
