import React, { useEffect, useState } from "react";
import EquiposService from "../../services/EquiposServices";

const ListaEquipos = () => {
    const [equipos, setEquipos] = useState([]);

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

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-6">
                <table className="min-w-[4000px] w-full text-sm text-left border border-gray-200">
                    <thead className="bg-blue-900">
                        <tr className="text-center font-bold bg-blue-900 text-white">
                            <th className="px-4 py-2 border" colSpan="6">DATOS GENERALES</th>
                            <th className="px-4 py-2 border" colSpan="3">DATOS DE USUARIO</th>
                            <th className="px-4 py-2 border" colSpan="10">DATOS DE USUARIO</th>
                            <th className="px-4 py-2 border" colSpan="1">UBICACION DEL EQUIPO</th>
                            <th className="px-4 py-2 border" colSpan="6">INFORMACION DE TOMA DE INVENTARIO</th>
                        </tr>
                        <tr className="text-center bg-blue-900 text-white">
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">No. de Registro Deprect</th>
                            <th className="px-4 py-2 border">Orden de Compra</th>
                            <th className="px-4 py-2 border">Factura</th>
                            <th className="px-4 py-2 border">Proveedor</th>
                            <th className="px-4 py-2 border">Fecha Ingreso</th>
                            <th className="px-4 py-2 border">Hoja No.</th>
                            <th className="px-4 py-2 border">Fecha Actualizacion</th>
                            <th className="px-4 py-2 border">Asignado a</th>
                            <th className="px-4 py-2 border">Codificación</th>
                            <th className="px-4 py-2 border">Marca</th>
                            <th className="px-4 py-2 border">Modelo</th>
                            <th className="px-4 py-2 border">Serie</th>
                            <th className="px-4 py-2 border">IMEI</th>
                            <th className="px-4 py-2 border">Estado</th>
                            <th className="px-4 py-2 border">Tipo</th>
                            <th className="px-4 py-2 border">Imagen</th>
                            <th className="px-4 py-2 border">Número asignado</th>
                            <th className="px-4 py-2 border">Extensión</th>
                            <th className="px-4 py-2 border">Ubicacion</th>
                            <th className="px-4 py-2 border">Revisado de toma fisica</th>
                            <th className="px-4 py-2 border">Fecha de toma</th>
                            <th className="px-4 py-2 border">Estado de Sticker</th>
                            <th className="px-4 py-2 border">Asignado a Hoja de responsabilidad</th>
                            <th className="px-4 py-2 border">Comentarios</th>
                            <th className="px-4 py-2 border">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipos.length > 0 ? (
                            equipos.map((equipo, index) => (
                                <tr key={equipo.id} className="text-center">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">{equipo.registroDeprec || "Sin registro"}</td>
                                    <td className="px-4 py-2 border">{equipo.orderCompra}</td>
                                    <td className="px-4 py-2 border">{equipo.factura}</td>
                                    <td className="px-4 py-2 border">{equipo.proveedor}</td>
                                    <td className="px-4 py-2 border">{equipo.fechaIngreso ? new Date(equipo.fechaIngreso).toLocaleDateString("es-ES") : "Sin fecha"}</td>
                                    <td className="px-4 py-2 border">{equipo.hojaNo}</td>
                                    <td className="px-4 py-2 border">{equipo.fechaActualizacion ? new Date(equipo.fechaActualizacion).toLocaleDateString("es-ES") : "Sin fecha"}</td>
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
                                    <td className="px-4 py-2 border">{equipo.codificacion}</td>
                                    <td className="px-4 py-2 border">{equipo.marca}</td>
                                    <td className="px-4 py-2 border">{equipo.modelo}</td>
                                    <td className="px-4 py-2 border">{equipo.serie}</td>
                                    <td className="px-4 py-2 border">{equipo.imei}</td>
                                    <td className={`px-4 py-2 border ${colorEstado[equipo.estado] || ""}`}>{equipo.estado}</td>
                                    <td className="px-4 py-2 border">{equipo.tipo}</td>
                                    <td className="px-4 py-2 border">
                                        {equipo.imagenRuta ? (
                                            <img
                                                src={`https://localhost:7291/${equipo.imagenRuta}`}
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
                                    <td className="px-4 py-2 border">{equipo.ubicacion}</td>
                                    <td className="px-4 py-2 border">{equipo.revisadoTomaFisica}</td>
                                    <td className="px-4 py-2 border">{equipo.fechaToma ? new Date(equipo.fechaToma).toLocaleDateString("es-ES") : "Sin fecha"}</td>
                                    <td className="px-4 py-2 border">{equipo.estadoSticker}</td>
                                    <td className="px-4 py-2 border">{equipo.asignadoHojaResponsabilidad}</td>
                                    <td className="px-4 py-2 border">{equipo.comentarios}</td>
                                    <td className="px-4 py-2 border">{equipo.observaciones}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="26" className="text-center p-4 text-gray-600">
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
