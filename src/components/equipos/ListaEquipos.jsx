import React, { useEffect, useState } from "react";
import EquiposService from "../../services/EquiposServices";

const ListaEquipos = () => {
    const [equipos, setEquipos] = useState([]);

    const [filtros, setFiltros] = useState({
        codificacion: "",
        factura: "",
        marca: "",
        proveedor: "",
        modelo: "",
        estado: "",
        ubicacion: "",
        asignaciones: "",
    });

    const colorEstado = {
        "Buen estado": "text-green-600 font-bold",
        Inactivo: "text-orange-500 font-bold",
        Obsoleto: "text-red-600 font-bold",
    };

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

    const handleFiltroChange = (campo, valor) => {
        setFiltros((prev) => ({ ...prev, [campo]: valor }));
    };

    const resultadosFiltrados = equipos.filter((equipo) => {
        return Object.entries(filtros).every(([campo, valor]) => {
            if (!valor.trim()) return true;

            let valorEquipo = "";

            if (campo === "asignaciones") {
                valorEquipo = equipo.asignaciones
                    ?.map(
                        (a) =>
                            `${a.codigoEmpleado || ""} ${a.nombreEmpleado || ""} ${a.puesto || ""}`
                    )
                    .join(" ")
                    .toLowerCase() || "";
            } else {
                valorEquipo =
                    equipo[campo] !== null && equipo[campo] !== undefined
                        ? equipo[campo].toString().toLowerCase()
                        : "";
            }
            return valorEquipo.includes(valor.toLowerCase());
        });
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Codificación"
                        value={filtros.codificacion}
                        onChange={(e) => handleFiltroChange("codificacion", e.target.value)}
                        className="border px-4 py-2 rounded shadow"
                    />
                    <input
                        type="text"
                        placeholder="Factura"
                        value={filtros.factura}
                        onChange={(e) => handleFiltroChange("factura", e.target.value)}
                        className="border px-4 py-2 rounded shadow"
                    />
                    <input
                        type="text"
                        placeholder="Marca"
                        value={filtros.marca}
                        onChange={(e) => handleFiltroChange("marca", e.target.value)}
                        className="border px-4 py-2 rounded shadow"
                    />
                    <input
                        type="text"
                        placeholder="Proveedor"
                        value={filtros.proveedor}
                        onChange={(e) => handleFiltroChange("proveedor", e.target.value)}
                        className="border px-4 py-2 rounded shadow"
                    />
                    <input
                        type="text"
                        placeholder="Modelo"
                        value={filtros.modelo}
                        onChange={(e) => handleFiltroChange("modelo", e.target.value)}
                        className="border px-4 py-2 rounded shadow"
                    />
                    <input
                        type="text"
                        placeholder="Estado"
                        value={filtros.estado}
                        onChange={(e) => handleFiltroChange("estado", e.target.value)}
                        className="border px-4 py-2 rounded shadow"
                    />
                    <input
                        type="text"
                        placeholder="Ubicación"
                        value={filtros.ubicacion}
                        onChange={(e) => handleFiltroChange("ubicacion", e.target.value)}
                        className="border px-4 py-2 rounded shadow"
                    />
                    <input
                        type="text"
                        placeholder="Asignado a"
                        value={filtros.asignaciones}
                        onChange={(e) => handleFiltroChange("asignaciones", e.target.value)}
                        className="border px-4 py-2 rounded shadow"
                    />
                </div>
                <div className="overflow-x-auto"> 
                    <table className="min-w-[1400px] text-xs text-left border border-gray-200">
                        <thead className="bg-blue-900">
                            <tr className="text-center font-bold bg-blue-900 text-white">
                                <th className="px-2 py-1 border whitespace-nowrap" colSpan="6">DATOS GENERALES</th>
                                <th className="px-2 py-1 border whitespace-nowrap" colSpan="3">DATOS DE USUARIO</th>
                                <th className="px-2 py-1 border whitespace-nowrap" colSpan="9">DATOS DEL EQUIPO</th>
                                <th className="px-2 py-1 border whitespace-nowrap" colSpan="1">UBICACION DEL EQUIPO</th>
                                <th className="px-2 py-1 border whitespace-nowrap" colSpan="6">INFORMACION DE TOMA DE INVENTARIO</th>
                            </tr>
                            <tr className="text-center bg-blue-900 text-white">
                                <th className="px-2 py-1 border whitespace-nowrap">#</th>
                                <th className="px-2 py-1 border whitespace-nowrap">No. de Registro Deprect</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Orden de Compra</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Factura</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Proveedor</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Fecha Ingreso</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Hoja No.</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Fecha Actualizacion</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Asignado a</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Codificación</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Marca</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Modelo</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Serie</th>
                                <th className="px-2 py-1 border whitespace-nowrap">IMEI</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Estado</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Tipo</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Número asignado</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Extensión</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Ubicacion</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Revisado de toma fisica</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Fecha de toma</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Estado de Sticker</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Asignado a Hoja de responsabilidad</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Comentarios</th>
                                <th className="px-2 py-1 border whitespace-nowrap">Observaciones</th>
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
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.hojaNo}</td>
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
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.codificacion}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.marca}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.modelo}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.serie}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.imei}</td>
                                        <td className={`px-2 py-1 border whitespace-nowrap ${colorEstado[equipo.estado] || ""}`}>{equipo.estado}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.tipo}</td>
                                        {equipo.tipo === "Teléfono móvil" ? (
                                            <>
                                                <td className="px-2 py-1 border whitespace-nowrap">{equipo.numeroAsignado}</td>
                                                <td className="px-2 py-1 border whitespace-nowrap">{equipo.extension}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-2 py-1 border whitespace-nowrap">-</td>
                                                <td className="px-2 py-1 border whitespace-nowrap">-</td>
                                            </>
                                        )}
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.ubicacion}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.revisadoTomaFisica}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.fechaToma ? new Date(equipo.fechaToma).toLocaleDateString("es-ES") : "Sin fecha"}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.estadoSticker}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.asignadoHojaResponsabilidad}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.comentarios}</td>
                                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.observaciones}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center p-4 text-gray-600">
                                        No se encontraron equipos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListaEquipos;
