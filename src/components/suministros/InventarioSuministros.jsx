import { useEffect, useState } from "react";
import SuministrosService from "../../services/SuministrosService";
import EntradaSuministroService from "../../services/EntradasSuministrosServices";
import SalidaSuministroService from "../../services/SalidasSuministrosServices";

export default function SuministrosInventario() {
    const [suministros, setSuministros] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [tipoMovimientos, setTipoMovimientos] = useState("entrada");
    const [loadingSuministros, setLoadingSuministros] = useState(true);
    const [loadingMovimientos, setLoadingMovimientos] = useState(true);
    const [errorSuministros, setErrorSuministros] = useState("");
    const [errorMovimientos, setErrorMovimientos] = useState("");

    useEffect(() => {
        const cargarSuministros = async () => {
            try {
                const response = await SuministrosService.obtenerTodos();
                setSuministros(response.data);
            } catch (err) {
                console.error(err);
                setErrorSuministros("Error al cargar los suministros ❌");
            } finally {
                setLoadingSuministros(false);
            }
        };
        cargarSuministros();
    }, []);

    useEffect(() => {
        const cargarMovimientos = async () => {
            setLoadingMovimientos(true);
            setErrorMovimientos("");
            try {
                let response;
                if (tipoMovimientos === "entrada") {
                    response = await EntradaSuministroService.obtenerTodas();
                } else {
                    response = await SalidaSuministroService.obtenerTodos();
                }

                const data = response.data.map((m) => ({
                    ...m,
                    nombreProducto: m.suministro?.nombreProducto || "Desconocido",
                    fecha: m.fecha || m.Fecha,
                    destino: m.destino || "",
                    personaResponsable: m.personaResponsable || "",
                    departamentoResponsable: m.departamentoResponsable || "",
                }));

                setMovimientos(data);
            } catch (err) {
                console.error(err);
                setErrorMovimientos("Error al cargar los movimientos ❌");
            } finally {
                setLoadingMovimientos(false);
            }
        };

        cargarMovimientos();
    }, [tipoMovimientos]);

    return (
        <div className="max-w-6xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Inventario de Suministros</h2>

            {loadingSuministros && <p className="text-gray-600">Cargando suministros...</p>}
            {errorSuministros && <p className="text-red-600">{errorSuministros}</p>}

            {!loadingSuministros && suministros.length === 0 && (
                <p className="text-gray-500 text-center">No hay suministros registrados.</p>
            )}

            {!loadingSuministros && suministros.length > 0 && (
                <div className="overflow-x-auto mb-8">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3 border">ID</th>
                                <th className="p-3 border">Producto</th>
                                <th className="p-3 border">Ubicación</th>
                                <th className="p-3 border">Cantidad Actual</th>
                                <th className="p-3 border">Fecha Creación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suministros.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="p-3 border">{s.id}</td>
                                    <td className="p-3 border">{s.nombreProducto}</td>
                                    <td className="p-3 border">{s.ubicacionProducto}</td>
                                    <td className="p-3 border font-bold text-blue-700">{s.cantidadActual}</td>
                                    <td className="p-3 border">{new Date(s.dateTime).toLocaleDateString("es-GT")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mb-4 flex gap-4 justify-center">
                <button
                    className={`px-4 py-2 rounded-lg ${tipoMovimientos === "entrada" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setTipoMovimientos("entrada")}
                >
                    Entradas
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${tipoMovimientos === "salida" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setTipoMovimientos("salida")}
                >
                    Salidas
                </button>
            </div>

            {loadingMovimientos && <p className="text-gray-600">Cargando movimientos...</p>}
            {errorMovimientos && <p className="text-red-600">{errorMovimientos}</p>}

            {!loadingMovimientos && movimientos.length === 0 && (
                <p className="text-gray-500 text-center">No hay movimientos registrados.</p>
            )}

            {!loadingMovimientos && movimientos.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3 border">ID</th>
                                <th className="p-3 border">Producto</th>
                                <th className="p-3 border">Cantidad</th>
                                {tipoMovimientos === "salida" && (
                                    <>
                                        <th className="p-3 border">Destino</th>
                                        <th className="p-3 border">Persona Responsable</th>
                                        <th className="p-3 border">Departamento</th>
                                    </>
                                )}
                                <th className="p-3 border">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="p-3 border">{m.id}</td>
                                    <td className="p-3 border">
                                        {m.suministro?.nombreProducto ||
                                            suministros.find(s => s.id === m.suministroId)?.nombreProducto ||
                                            "Desconocido"}
                                    </td>
                                    <td className="p-3 border font-bold text-blue-700">{m.cantidadProducto}</td>
                                    {tipoMovimientos === "salida" && (
                                        <>
                                            <td className="p-3 border">{m.destino}</td>
                                            <td className="p-3 border">{m.personaResponsable}</td>
                                            <td className="p-3 border">{m.departamentoResponsable}</td>
                                        </>
                                    )}
                                    <td className="p-3 border">{new Date(m.fecha).toLocaleDateString("es-GT")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
