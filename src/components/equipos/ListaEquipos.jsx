import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiFilter } from "react-icons/fi";

const ListaEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [filtros, setFiltros] = useState({
        codificacion: "",
        marca: "",
        modelo: "",
        tipo: "",
        fechaExacta: "",
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const colorEstado = {
        "Buen estado": "text-green-600 font-bold",
        Inactivo: "text-orange-500 font-bold",
        Obsoleto: "text-red-600 font-bold",
    };

    useEffect(() => {
        axios
            .get("https://inveq.guandy.com/api/Equipos", {
                withCredentials: true,
            })
            .then((res) => setEquipos(res.data))
            .catch((err) => console.error("Error al obtener equipos:", err));
    }, []);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    const equiposFiltrados = equipos.filter((equipo) => {
        return (
            (equipo.codificacion?.toLowerCase() || "").includes(filtros.codificacion.toLowerCase()) &&
            (equipo.marca?.toLowerCase() || "").includes(filtros.marca.toLowerCase()) &&
            (equipo.modelo?.toLowerCase() || "").includes(filtros.modelo.toLowerCase()) &&
            (equipo.tipo?.toLowerCase() || "").includes(filtros.tipo.toLowerCase()) &&
            (!filtros.fechaExacta ||
                (equipo.fechaIngreso &&
                    new Date(equipo.fechaIngreso).toISOString().split("T")[0] === filtros.fechaExacta))
        );
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        name="codificacion"
                        placeholder="Buscar por codificación"
                        value={filtros.codificacion}
                        onChange={handleFiltroChange}
                        className="border border-gray-300 rounded-md px-4 py-2 w-64"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Mostrar filtros"
                        >
                            <FiFilter size={24} />
                        </button>
                    </div>
                </div>

                {mostrarFiltros && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {["marca", "modelo", "tipo"].map((campo) => (
                            <input
                                key={campo}
                                type="text"
                                name={campo}
                                placeholder={`Filtrar por ${campo}`}
                                value={filtros[campo]}
                                onChange={handleFiltroChange}
                                className="border border-gray-300 rounded-md px-4 py-2"
                            />
                        ))}
                        <input
                            type="date"
                            name="fechaExacta"
                            value={filtros.fechaExacta}
                            onChange={handleFiltroChange}
                            className="border border-gray-300 rounded-md px-4 py-2"
                        />
                    </div>
                )}
                <table className="min-w-[2000px] w-full text-sm text-left border border-gray-200">
                    <thead className="bg-indigo-100">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Codificación</th>
                            <th className="px-4 py-2 border">Orden de compra</th>
                            <th className="px-4 py-2 border">Factura</th>
                            <th className="px-4 py-2 border">Proveedor</th>
                            <th className="px-4 py-2 border">Marca</th>
                            <th className="px-4 py-2 border">Modelo</th>
                            <th className="px-4 py-2 border">Serie</th>
                            <th className="px-4 py-2 border">IMEI</th>
                            <th className="px-4 py-2 border">Estado</th>
                            <th className="px-4 py-2 border">Tipo</th>
                            <th className="px-4 py-2 border">Ubicación</th>
                            <th className="px-4 py-2 border">Asignado a</th>
                            <th className="px-4 py-2 border">Fecha Ingreso</th>
                            <th className="px-4 py-2 border">Imagen</th>
                            <th className="px-4 py-2 border">Número asignado</th>
                            <th className="px-4 py-2 border">Extensión</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equiposFiltrados.length > 0 ? (
                            equiposFiltrados.map((equipo, index) => (
                                <tr key={equipo.id} className="text-center">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">{equipo.id}</td>
                                    <td className="px-4 py-2 border">{equipo.codificacion}</td>
                                    <td className="px-4 py-2 border">{equipo.orderCompra}</td>
                                    <td className="px-4 py-2 border">{equipo.factura}</td>
                                    <td className="px-4 py-2 border">{equipo.proveedor}</td>
                                    <td className="px-4 py-2 border">{equipo.marca}</td>
                                    <td className="px-4 py-2 border">{equipo.modelo}</td>
                                    <td className="px-4 py-2 border">{equipo.serie}</td>
                                    <td className="px-4 py-2 border">{equipo.imei}</td>
                                    <td className={`px-4 py-2 border ${colorEstado[equipo.estado] || ""}`}>
                                        {equipo.estado}
                                    </td>
                                    <td className="px-4 py-2 border">{equipo.tipo}</td>
                                    <td className="px-4 py-2 border">{equipo.ubicacion}</td>
                                    <td className="px-4 py-2 border">
                                        {equipo.asignaciones && equipo.asignaciones.length > 0 ? (
                                            equipo.asignaciones.map((asignacion, idx) => (
                                                <div key={idx} className="font-semibold mb-1">
                                                    {idx + 1}. <span className="text-blue-700">{asignacion.codigoEmpleado}</span> - {asignacion.nombreEmpleado} <span className="text-gray-600 italic">({asignacion.puesto})</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 italic">Sin asignaciones</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {new Date(equipo.fechaIngreso).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {equipo.imagenRuta ? (
                                            <img
                                                src={`https://inveq.guandy.com/${equipo.imagenRuta}`}
                                                alt="Equipo"
                                                className="w-20 h-auto rounded"
                                            />
                                        ) : (
                                            "Sin imagen"
                                        )}
                                    </td>
                                    {equipo.tipo === "Teléfono móvil" ? (
                                        <>
                                            <td className="px-4 py-2 border">{equipo.numeroAsignado}</td>
                                            <td className="px-4 py-2 border">{equipo.extension}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-2 border">-</td>
                                            <td className="px-4 py-2 border">-</td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" className="text-center p-4 text-gray-600">
                                    No se encontraron equipos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaEquipos;
