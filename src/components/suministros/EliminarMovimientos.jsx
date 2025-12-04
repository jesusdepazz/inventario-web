import { useEffect, useState } from "react";
import EntradaSuministroService from "../../services/EntradasSuministrosServices";
import SalidaSuministroService from "../../services/SalidasSuministrosServices";
import SuministrosService from "../../services/SuministrosService";

export default function EliminarSuministros() {
    const [entradas, setEntradas] = useState([]);
    const [salidas, setSalidas] = useState([]);
    const [suministros, setSuministros] = useState([]);

    const cargarSuministros = async () => {
        try {
            const res = await SuministrosService.obtenerTodos();
            setSuministros(res.data);
        } catch (error) {
            console.error("Error cargando suministros:", error);
        }
    };

    const cargarDatos = async () => {
        try {
            const [resEntradas, resSalidas] = await Promise.all([
                EntradaSuministroService.obtenerTodas(),
                SalidaSuministroService.obtenerTodos(),
            ]);

            const entradasMap = resEntradas.data.map(e => {
                const s = suministros.find(x => x.id === e.suministroId);
                return {
                    ...e,
                    nombreProducto: s ? s.nombreProducto : "Desconocido",
                };
            });

            const salidasMap = resSalidas.data.map(sal => {
                const s = suministros.find(x => x.id === sal.suministroId);
                return {
                    ...sal,
                    nombreProducto: s ? s.nombreProducto : "Desconocido",
                };
            });

            setEntradas(entradasMap);
            setSalidas(salidasMap);
        } catch (error) {
            console.error("Error cargando movimientos:", error);
        }
    };

    useEffect(() => {
        cargarSuministros();
    }, []);

    useEffect(() => {
        if (suministros.length > 0) {
            cargarDatos();
        }
    }, [suministros]);

    const eliminarEntrada = async (id) => {
        if (!confirm("¿Eliminar esta entrada?")) return;
        try {
            await EntradaSuministroService.eliminar(id);
            cargarDatos();
        } catch (error) {
            console.error(error);
            alert("Error eliminando la entrada.");
        }
    };

    const eliminarSalida = async (id) => {
        if (!confirm("¿Eliminar esta salida?")) return;
        try {
            await SalidaSuministroService.eliminar(id);
            cargarDatos();
        } catch (error) {
            console.error(error);
            alert("Error eliminando la salida.");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto mb-8 bg-white shadow rounded-xl">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th
                                colSpan="5"
                                className="text-center font-bold text-black text-xl p-3 border-b"
                            >
                                Entradas de Suministros
                            </th>
                        </tr>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 border">ID</th>
                            <th className="p-3 border">Fecha</th>
                            <th className="p-3 border">Suministro</th>
                            <th className="p-3 border">Cantidad</th>
                            <th className="p-3 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entradas.map((e) => (
                            <tr key={e.id} className="hover:bg-gray-50">
                                <td className="p-3 border">{e.id}</td>
                                <td className="p-3 border">{new Date(e.fecha).toLocaleString()}</td>
                                <td className="p-3 border">{e.nombreProducto}</td>
                                <td className="p-3 border font-bold text-green-700">{e.cantidadProducto}</td>

                                <td className="p-3 border">
                                    <button
                                        onClick={() => eliminarEntrada(e.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            <div className="overflow-x-auto mb-8 bg-white shadow rounded-xl">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th
                                colSpan="5"
                                className="text-center font-bold text-black text-xl p-3 border-b"
                            >
                                Salidas de Suministros
                            </th>
                        </tr>

                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 border">ID</th>
                            <th className="p-3 border">Fecha</th>
                            <th className="p-3 border">Suministro</th>
                            <th className="p-3 border">Cantidad</th>
                            <th className="p-3 border">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {salidas.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="p-3 border">{s.id}</td>
                                <td className="p-3 border">{new Date(s.fecha).toLocaleString()}</td>
                                <td className="p-3 border">{s.nombreProducto}</td>
                                <td className="p-3 border font-bold text-blue-700">{s.cantidadProducto}</td>

                                <td className="p-3 border">
                                    <button
                                        onClick={() => eliminarSalida(s.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
