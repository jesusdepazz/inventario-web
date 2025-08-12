import React, { useEffect, useState } from "react";
import EquiposService from "../../services/EquiposServices";
import { exportarExcel } from "../../services/ExoirtExcel";

const camposFiltro = [
    { label: "Codificación", value: "codificacion", tipo: "texto" },
    { label: "Factura", value: "factura", tipo: "texto" },
    { label: "Marca", value: "marca", tipo: "texto" },
    { label: "Proveedor", value: "proveedor", tipo: "texto" },
    { label: "Modelo", value: "modelo", tipo: "texto" },
    { label: "Estado", value: "estado", tipo: "select", opciones: ["Buen estado", "Inactivo", "Obsoleto"] },
    { label: "Ubicación", value: "ubicacion", tipo: "texto" },
    { label: "Asignado a", value: "asignaciones", tipo: "texto" },
];

const ListaEquipos = () => {
    const [equipos, setEquipos] = useState([]);

    const [filtros, setFiltros] = useState([]);

    useEffect(() => {
        const cargarEquipos = async () => {
            try {
                const res = await EquiposService.obtenerEquipos();
                setEquipos(res.data);
            } catch (err) {
                console.error("Error al obtener equipos:", err);
            }
        };
        cargarEquipos();
    }, []);

    const agregarFiltro = () => {
        setFiltros((prev) => [...prev, { campo: camposFiltro[0].value, valor: "" }]);
    };

    const cambiarCampoFiltro = (index, campoNuevo) => {
        setFiltros((prev) =>
            prev.map((filtro, i) =>
                i === index ? { campo: campoNuevo, valor: "" } : filtro
            )
        );
    };

    const cambiarValorFiltro = (index, valorNuevo) => {
        setFiltros((prev) =>
            prev.map((filtro, i) =>
                i === index ? { ...filtro, valor: valorNuevo } : filtro
            )
        );
    };

    const eliminarFiltro = (index) => {
        setFiltros((prev) => prev.filter((_, i) => i !== index));
    };

    const filtrarEquipos = () => {
        if (filtros.length === 0) return equipos;

        return equipos.filter((equipo) =>
            filtros.every(({ campo, valor }) => {
                if (!valor.trim()) return true;

                let valorCampo = "";

                if (campo === "asignaciones") {
                    valorCampo =
                        equipo.asignaciones
                            ?.map(
                                (a) =>
                                    `${a.codigoEmpleado || ""} ${a.nombreEmpleado || ""} ${a.puesto || ""}`
                            )
                            .join(" ")
                            .toLowerCase() || "";
                } else {
                    valorCampo =
                        equipo[campo] !== null && equipo[campo] !== undefined
                            ? equipo[campo].toString().toLowerCase()
                            : "";
                }

                return valorCampo.includes(valor.toLowerCase());
            })
        );
    };

    const resultadosFiltrados = filtrarEquipos();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-4 flex flex-wrap gap-3 items-end">
                {filtros.map((filtro, i) => {
                    const campoInfo = camposFiltro.find((c) => c.value === filtro.campo);

                    return (
                        <div key={i} className="flex items-center space-x-2 border rounded p-2 shadow">
                            <select
                                value={filtro.campo}
                                onChange={(e) => cambiarCampoFiltro(i, e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                {camposFiltro.map(({ label, value }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>

                            {campoInfo.tipo === "select" ? (
                                <select
                                    value={filtro.valor}
                                    onChange={(e) => cambiarValorFiltro(i, e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="">-- Todos --</option>
                                    {campoInfo.opciones.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    placeholder={`Buscar ${campoInfo.label}`}
                                    value={filtro.valor}
                                    onChange={(e) => cambiarValorFiltro(i, e.target.value)}
                                    className="border rounded px-3 py-1"
                                />
                            )}

                            <button
                                onClick={() => eliminarFiltro(i)}
                                className="text-red-500 hover:text-red-700 font-bold px-2"
                                title="Eliminar filtro"
                            >
                                &times;
                            </button>
                        </div>
                    );
                })}

                <button
                    onClick={agregarFiltro}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    + Añadir filtro
                </button>

                <button
                    onClick={() => setFiltros([])}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                >
                    Limpiar filtros
                </button>
            </div>

            <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-6 max-w-full mx-auto">
                <div className="overflow-x-auto">
                    <table className="min-w-[1000px] text-xs text-left border border-gray-200">
                        <thead>
                            <tr className="text-center font-bold text-white">
                                <th
                                    colSpan="6"
                                    className="px-2 py-1 border whitespace-nowrap bg-blue-700 text-white"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-semibold">DATOS GENERALES</span>
                                    </div>
                                </th>

                                <th
                                    colSpan="3"
                                    className="px-2 py-1 border whitespace-nowrap bg-blue-800 text-white"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16 14c2.21 0 4 1.79 4 4v2H4v-2c0-2.21 1.79-4 4-4h8zm0-6a4 4 0 11-8 0 4 4 0 018 0z"
                                            />
                                        </svg>
                                        <span className="font-semibold">DATOS DE USUARIO</span>
                                    </div>
                                </th>

                                <th
                                    colSpan="11"
                                    className="px-2 py-1 border whitespace-nowrap bg-blue-900 text-white"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 5h16v10H4V5z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8 19h8M12 15v4"
                                            />
                                        </svg>
                                        <span className="font-semibold">DATOS DEL EQUIPO</span>
                                    </div>
                                </th>

                                <th
                                    colSpan="1"
                                    className="px-2 py-1 border whitespace-nowrap bg-blue-600 text-white"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 21s6-5.373 6-10A6 6 0 0 0 6 11c0 4.627 6 10 6 10z"
                                            />
                                            <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                        <span className="font-semibold">UBICACION DEL EQUIPO</span>
                                    </div>
                                </th>

                                <th
                                    colSpan="6"
                                    className="px-2 py-1 border whitespace-nowrap bg-blue-800 text-white"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                            <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2" />
                                            <line x1="12" y1="11" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                        <span className="font-semibold">INFORMACION DE TOMA DE INVENTARIO</span>
                                    </div>
                                </th>

                            </tr>
                            <tr className="text-center text-white">
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-700">#</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-700">No. de Registro Deprect</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-700">Orden de Compra</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-700">Factura</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-700">Proveedor</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-700">Fecha Ingreso</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-800">Hoja No.</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-800">Fecha Actualizacion</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-800">Asignado a</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">Codificación</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">Equipo</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">Marca</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">Modelo</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">Serie</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">IMEI</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">Estado</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">Tipo</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">Responsable Anterior</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">Número asignado</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-900">Extensión</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-600">Ubicacion</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-800">Revisado de toma fisica</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-800">Fecha de toma</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-800">Estado de Sticker</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-800">Asignado a Hoja de responsabilidad</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-800">Comentarios</th>
                                <th className="px-2 py-1 border whitespace-nowrap bg-blue-800">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultadosFiltrados.length > 0 ? (
                                resultadosFiltrados.map((equipo, index) => (
                                    <tr key={equipo.id} className="text-center">
                                        <td className="px-2 py-1 border whitespace-nowrap">{index + 1}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.registroDeprec || "Sin registro"}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.orderCompra}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.factura}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.proveedor}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.fechaIngreso ? new Date(equipo.fechaIngreso).toLocaleDateString("es-ES") : "Sin fecha"}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap text-red-600">{equipo.hojaNo}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.fechaActualizacion ? new Date(equipo.fechaActualizacion).toLocaleDateString("es-ES") : "Sin fecha"}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">
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
                                        <td className="px-2 py-1 border whitespace-nowrap font-bold text-blue-800">{equipo.codificacion}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.tipoEquipo}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.marca}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.modelo}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.serie}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.imei}</td>
                                        <td className={`px-2 py-1 border whitespace-nowrap text-white ${equipo.estado === "Buen estado" ? "bg-green-500" : equipo.estado === "Inactivo" ? "bg-red-500" : equipo.estado === "Obsoleto" ? "bg-orange-500" : "bg-gray-300"}`}> {equipo.estado || "Sin estado"} </td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.tipo}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.responsableAnterior}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.numeroAsignado}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.extension}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.ubicacion}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap text-center">
                                            {equipo.revisadoTomaFisica}
                                        </td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.fechaToma ? new Date(equipo.fechaToma).toLocaleDateString("es-ES") : "Sin fecha"}</td>
                                        <td className={`px-2 py-1 border whitespace-nowrap text-white ${equipo.estadoSticker === "buen" ? "bg-green-500" : equipo.estadoSticker === "cambio" ? "bg-orange-500" : "bg-gray-300"}`}> {equipo.estadoSticker === "buen" ? "Buen estado" : equipo.estadoSticker === "cambio" ? "Cambio" : "Sin estado"} </td>
                                        <td className="px-2 py-1 border whitespace-nowrap text-center">
                                            {equipo.asignadoHojaResponsabilidad}
                                        </td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.comentarios}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.observaciones}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="27" className="text-center p-4 text-gray-600">
                                        No se encontraron equipos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="m-4 flex justify-center">
                    <button
                        onClick={() => exportarExcel(resultadosFiltrados)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Exportar a Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListaEquipos;
