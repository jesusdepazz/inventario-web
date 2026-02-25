import React, { useEffect, useState } from "react";
import EquiposService from "../../services/EquiposServices";
import { exportarExcel } from "../../services/ExportExcel";

const camposFiltro = [
    { label: "Codificación", value: "codificacion", tipo: "texto" },
    { label: "Factura", value: "factura", tipo: "texto" },
    { label: "Marca", value: "marca", tipo: "texto" },
    { label: "Proveedor", value: "proveedor", tipo: "texto" },
    { label: "Modelo", value: "modelo", tipo: "texto" },
    { label: "Estado", value: "estado", tipo: "select", opciones: ["Buen estado", "Inactivo", "Obsoleto"] },
    { label: "Ubicación", value: "ubicacion", tipo: "texto" },
    { label: "Asignado a", value: "asignadoA", tipo: "texto" },
    { label: "No. de Registro Deprect", value: "noRegistroDeprect", tipo: "texto" },
    { label: "Orden de Compra", value: "ordenCompra", tipo: "texto" },
    { label: "Fecha Ingreso", value: "fechaIngreso", tipo: "fecha" },
    { label: "Hoja No.", value: "hojaNo", tipo: "texto" },
    { label: "Fecha Actualizacion", value: "fechaActualizacion", tipo: "fecha" },
    { label: "Equipo", value: "equipo", tipo: "texto" },
    { label: "Serie", value: "serie", tipo: "texto" },
    { label: "IMEI", value: "imei", tipo: "texto" },
    { label: "Tipo", value: "tipo", tipo: "texto" },
    { label: "Responsable Anterior", value: "responsableAnterior", tipo: "texto" },
    { label: "Número asignado", value: "numeroAsignado", tipo: "texto" },
    { label: "Extensión", value: "extension", tipo: "texto" },
    { label: "Revisado de toma fisica", value: "revisadoTomaFisica", tipo: "texto" },
    { label: "Fecha de toma", value: "fechaToma", tipo: "fecha" },
    { label: "Estado de Sticker", value: "estadoSticker", tipo: "select", opciones: ["Buen estado", "Cambio"] },
    { label: "Asignado a Hoja de responsabilidad", value: "asignadoHojaResponsabilidad", tipo: "texto" },
    { label: "Comentarios", value: "comentarios", tipo: "texto" },
    { label: "Observaciones", value: "observaciones", tipo: "texto" },
];

const ListaEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [filtros, setFiltros] = useState([]);

    useEffect(() => {
        const cargarEquipos = async () => {
            try {
                const res = await EquiposService.obtenerEquipos();
                let lista = [];

                if (Array.isArray(res.data)) {
                    lista = res.data;
                } else if (Array.isArray(res.data?.$values)) {
                    lista = res.data.$values;
                }
                setEquipos(lista);
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

            <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-6">
                <table className="w-full text-xs border border-gray-300 border-collapse">
                    <thead>
                        <tr className="text-center font-bold text-white">
                            <th colSpan="5" className="px-3 py-2 border bg-blue-700">
                                DATOS GENERALES
                            </th>
                            <th colSpan="3" className="px-3 py-2 border bg-blue-800">
                                DATOS DE USUARIO
                            </th>
                            <th colSpan="8" className="px-3 py-2 border bg-blue-900">
                                DATOS DEL EQUIPO
                            </th>
                            <th colSpan="1" className="px-3 py-2 border bg-blue-600">
                                UBICACION DEL EQUIPO
                            </th>
                            <th colSpan="2" className="px-3 py-2 border bg-blue-800">
                                INFORMACION DE EQUIPO
                            </th>
                        </tr>
                        <tr className="text-center text-white font-semibold">
                            <th className="px-3 py-2 border bg-blue-700 min-w-[80px]">#</th>
                            <th className="px-3 py-2 border bg-blue-700 min-w-[160px]">Orden de Compra</th>
                            <th className="px-3 py-2 border bg-blue-700 min-w-[160px]">Factura</th>
                            <th className="px-3 py-2 border bg-blue-700 min-w-[180px]">Proveedor</th>
                            <th className="px-3 py-2 border bg-blue-700 min-w-[140px]">Fecha Ingreso</th>
                            <th className="px-3 py-2 border bg-blue-800 min-w-[100px]">Hoja No.</th>
                            <th className="px-3 py-2 border bg-blue-800 min-w-[160px]">Fecha Actualizacion</th>
                            <th className="px-3 py-2 border bg-blue-800 min-w-[220px]">Asignado a</th>
                            <th className="px-3 py-2 border bg-blue-900 min-w-[180px]">Codificación</th>
                            <th className="px-3 py-2 border bg-blue-900 min-w-[140px]">Estado</th>
                            <th className="px-3 py-2 border bg-blue-900 min-w-[140px]">Equipo</th>
                            <th className="px-3 py-2 border bg-blue-900 min-w-[140px]">Marca</th>
                            <th className="px-3 py-2 border bg-blue-900 min-w-[140px]">Modelo</th>
                            <th className="px-3 py-2 border bg-blue-900 min-w-[160px]">Serie</th>
                            <th className="px-3 py-2 border bg-blue-900 min-w-[180px]">Responsable Anterior</th>
                            <th className="px-3 py-2 border bg-blue-900 min-w-[120px]">Extensión</th>
                            <th className="px-3 py-2 border bg-blue-600 min-w-[180px]">Ubicación</th>
                            <th className="px-3 py-2 border bg-blue-800 min-w-[220px]">Comentarios</th>
                            <th className="px-3 py-2 border bg-blue-800 min-w-[220px]">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultadosFiltrados.length > 0 ? (
                            resultadosFiltrados.map((equipo, index) => (
                                <tr
                                    key={equipo.id}
                                    className="text-center even:bg-gray-50 hover:bg-blue-50"
                                >
                                    <td className="px-3 py-2 border min-w-[80px]">
                                        {index + 1}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[160px] break-words">
                                        {equipo.ordenCompra}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[160px] break-words">
                                        {equipo.factura}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[180px] break-words">
                                        {equipo.proveedor}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[140px]">
                                        {equipo.fechaIngreso
                                            ? new Date(equipo.fechaIngreso).toLocaleDateString("es-ES")
                                            : "Sin fecha"}
                                    </td>

                                    <td className="px-3 py-2 border text-red-600 font-semibold min-w-[100px]">
                                        {equipo.hojaNo}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[140px]">
                                        {equipo.fechaActualizacion
                                            ? new Date(equipo.fechaActualizacion).toLocaleDateString("es-ES")
                                            : "Sin fecha"}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[220px] text-left">
                                        {equipo.asignaciones?.length > 0 ? (
                                            equipo.asignaciones.map((a, i) => (
                                                <div key={i} className="mb-1">
                                                    <span className="text-blue-700 font-semibold">
                                                        {a.codigoEmpleado}
                                                    </span>{" "}
                                                    - {a.nombreEmpleado}
                                                    <div className="text-gray-500 italic text-[11px]">
                                                        {a.puesto}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic">
                                                Sin asignaciones
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-3 py-2 border font-bold text-blue-800 min-w-[180px]">
                                        {equipo.codificacion}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[140px]">
                                        {equipo.estado}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[140px]">
                                        {equipo.tipoEquipo}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[140px]">
                                        {equipo.marca}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[140px]">
                                        {equipo.modelo}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[180px]">
                                        {equipo.serie}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[180px]">
                                        {equipo.responsableAnterior}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[120px]">
                                        {equipo.extension}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[180px]">
                                        {equipo.ubicacion}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[220px] break-words text-left">
                                        {equipo.comentarios}
                                    </td>

                                    <td className="px-3 py-2 border min-w-[220px] break-words text-left">
                                        {equipo.observaciones}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="19" className="text-center p-6 text-gray-500">
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