import { useEffect, useState } from "react";
import TrasladosServices from "../../../services/TrasladosServices";
import PdfTraslados from "./TrasladosPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function TrasladosLista() {
    const [traslados, setTraslados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTraslados = async () => {
            try {
                const res = await TrasladosServices.obtenerTodos();
                setTraslados(res.data);
            } catch (err) {
                console.error("Error cargando traslados:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTraslados();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">Cargando traslados...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-6">
                <div className="text-center mb-4">
                    <p className="font-bold text-lg">Guatemalan Candies, S.A.</p>
                    <p className="font-bold text-lg text-blue-500">Listado de Traslados - Equipo de cómputo</p>
                    <p className="font-bold text-lg">
                        {new Date().toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-[1200px] w-full text-sm text-left border border-gray-200 rounded-xl">
                        <thead className="bg-blue-800 text-white">
                            <tr>
                                <th className="p-3 font-semibold">#</th>
                                <th className="p-3 font-semibold">Número</th>
                                <th className="p-3 font-semibold">Fecha Emisión</th>
                                <th className="p-3 font-semibold">Persona Entrega</th>
                                <th className="p-3 font-semibold">Persona Recibe</th>
                                <th className="p-3 font-semibold">Equipo</th>
                                <th className="p-3 font-semibold">Motivo</th>
                                <th className="p-3 font-semibold">Ubicación Desde</th>
                                <th className="p-3 font-semibold">Ubicación Hasta</th>
                                <th className="p-3 font-semibold">Estado</th>
                                <th className="p-3 font-semibold">Observaciones</th>
                                <th className="p-3 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {traslados.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="11"
                                        className="text-center text-gray-500 p-6"
                                    >
                                        No hay registros de traslados.
                                    </td>
                                </tr>
                            ) : (
                                traslados.map((t, i) => (
                                    <tr
                                        key={t.id}
                                        className={`transition-colors duration-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } hover:bg-blue-50`}
                                    >
                                        <td className="border p-2 text-center">{i + 1}</td>
                                        <td className="border p-2">{t.no}</td>
                                        <td className="border p-2">
                                            {new Date(t.fechaEmision).toLocaleDateString()}
                                        </td>
                                        <td className="border p-2">{t.codigoEntrega}</td>
                                        <td className="border p-2">{t.codigoRecibe}</td>
                                        <td className="border p-2">{t.equipo}</td>
                                        <td className="border p-2">{t.motivo}</td>
                                        <td className="border p-2">{t.ubicacionDesde}</td>
                                        <td className="border p-2">{t.ubicacionHasta}</td>
                                        <td className="border p-2 text-center">
                                            <span
                                                className={`px-2 py-1 rounded-lg text-xs font-semibold ${t.status === "Pendiente"
                                                    ? "bg-yellow-200 text-yellow-800"
                                                    : t.status === "Completado"
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-gray-200 text-gray-800"
                                                    }`}
                                            >
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="border p-2">{t.observaciones}</td>
                                        <td className="border p-2">
                                            <PDFDownloadLink
                                                document={<PdfTraslados data={t} />}
                                                fileName={`Traslado-${t.id}.pdf`}
                                            >
                                                {({ loading }) => loading ? "Generando..." : "Descargar PDF"}
                                            </PDFDownloadLink>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
