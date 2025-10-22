import { useEffect, useState } from "react";
import TrasladosServices from "../../../services/TrasladosServices";

export default function HistoricoTraslados() {
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
            <div className="overflow-x-auto w-full bg-white shadow-lg rounded-xl">
                <table className="min-w-[2000px] w-full text-sm text-left border border-gray-200 rounded-xl">
                    <thead className="bg-blue-800 text-white">
                        <tr>
                            <th className="p-3 font-semibold">#</th>
                            <th className="p-3 font-semibold">Número</th>
                            <th className="p-3 font-semibold">Fecha Emisión</th>
                            <th className="p-3 font-semibold">Persona quien entrega</th>
                            <th className="p-3 font-semibold">Persona quien recibe</th>
                            <th className="p-3 font-semibold">Equipo</th>
                            <th className="p-3 font-semibold">Motivo</th>
                            <th className="p-3 font-semibold">Ubicación Desde</th>
                            <th className="p-3 font-semibold">Ubicación Hasta</th>
                            <th className="p-3 font-semibold">Estado</th>
                            <th className="p-3 font-semibold">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {traslados.map((t, i) => (
                            <tr
                                key={t.id}
                                className={`transition-colors duration-200 ${
                                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                                } hover:bg-blue-50`}
                            >
                                <td className="border p-2">{i + 1}</td>
                                <td className="border p-2">{t.no}</td>
                                <td className="border p-2">
                                    {new Date(t.fechaEmision).toLocaleDateString()}
                                </td>
                                <td className="border p-2">{t.solicitante}</td>
                                <td className="border p-2">{t.descripcionEquipo}</td>
                                <td className="border p-2">{t.motivo}</td>
                                <td className="border p-2">{t.razon}</td>
                                <td className="border p-2">{t.ubicacionDesde}</td>
                                <td className="border p-2">{t.ubicacionHasta}</td>
                                <td className="border p-2">
                                    <span
                                        className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                            t.status === "Pendiente"
                                                ? "bg-yellow-200 text-yellow-800"
                                                : "bg-green-200 text-green-800"
                                        }`}
                                    >
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
