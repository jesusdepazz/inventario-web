import { useEffect, useState } from "react";
import BajaActivosService from "../../../services/BajaActivosServices";
import { generarBajaPDF } from "./BajaActivoPDF";

export default function ListabajaAtivos() {
    const [bajas, setBajas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarBajas = async () => {
            try {
                const res = await BajaActivosService.obtenerTodas();
                setBajas(res.data);
            } catch (err) {
                console.error(err);
                setError("Error al cargar el historial de bajas");
            } finally {
                setLoading(false);
            }
        };

        cargarBajas();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-600">Cargando historial...</div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-600 font-medium">{error}</div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-6">
           <div className="text-center mb-4">
                    <p className="font-bold text-lg">Guatemalan Candies, S.A.</p>
                    <p className="font-bold text-lg text-blue-500">Listado de Bajas - Equipo de cómputo</p>
                    <p className="font-bold text-lg">
                        {new Date().toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </p>
                </div>

            {bajas.length === 0 ? (
                <p className="text-gray-600 text-center py-10">
                    No hay bajas registradas.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 text-sm">
                        <thead className="bg-blue-800 text-white uppercase text-xs">
                            <tr>
                                <th className="border p-2">#</th>
                                <th className="border p-2">Fecha Baja</th>
                                <th className="border p-2">Codificación</th>
                                <th className="border p-2">Motivo</th>
                                <th className="border p-2">Detalles</th>
                                <th className="border p-2">Ubicación Actual</th>
                                <th className="border p-2">Ubicación Destino</th>
                                <th className="border p-2">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bajas.map((baja, index) => (
                                <tr
                                    key={baja.id}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="border p-2 text-center">{index + 1}</td>
                                    <td className="border p-2 text-center">
                                        {new Date(baja.fechaBaja).toLocaleDateString()}
                                    </td>
                                    <td className="border p-2 font-medium text-gray-800">
                                        {baja.codificacionEquipo}
                                    </td>
                                    <td className="border p-2">
                                        {(() => {
                                            try {
                                                const motivos = JSON.parse(baja.motivoBaja);
                                                return motivos.join(", ");
                                            } catch {
                                                return baja.motivoBaja;
                                            }
                                        })()}
                                    </td>
                                    <td className="border p-2">{baja.detallesBaja}</td>
                                    <td className="border p-2">{baja.ubicacionActual}</td>
                                    <td className="border p-2 font-semibold text-blue-600">
                                        {baja.ubicacionDestino}
                                    </td>
                                    <td className="border p-2 text-center">
                                        <button
                                            onClick={() => generarBajaPDF(baja.id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm"
                                        >
                                            PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
