import React, { useState, useEffect } from "react";
import HojasServices from "../../../services/HojasServices";
import generarPDFHojaResponsabilidad from "./generarPDFHojaResponsabilidad";

const ListaHojasResponsabilidad = () => {
    const [hojas, setHojas] = useState([]);

    useEffect(() => {
        const cargarHojas = async () => {
            try {
                const res = await HojasServices.obtenerTodas();
                setHojas(res.data);
            } catch (err) {
                console.error("Error al obtener hojas:", err);
            }
        };

        cargarHojas();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-6">
                <div className="text-center mb-4">
                    <p className="font-bold text-lg">Guatemalan Candies, S.A.</p>
                    <p className="font-bold text-lg text-blue-500">Listado de hojas de responsabilidad - Equipo de cómputo</p>
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
                    <table className="min-w-[2000px] text-xs text-left border border-gray-200">
                        <thead>
                            <tr className="text-center bg-blue-800 text-white">
                                <th className="px-6 py-3 border">No. de Hoja</th>
                                <th className="px-6 py-3 border">Fecha de Actualizacion</th>
                                <th className="px-6 py-3 border">Codigo de Usuario</th>
                                <th className="px-6 py-3 border">Responsable</th>
                                <th className="px-6 py-3 border">Puesto</th>
                                <th className="px-6 py-3 border">Departamento</th>
                                <th className="px-6 py-3 border">Jefe Inmediato</th>
                                <th className="px-6 py-3 border">Ubicacion</th>
                                <th className="px-6 py-3 border">Estado</th>
                                <th className="px-6 py-3 border">Solvencia No.</th>
                                <th className="px-6 py-3 border">Fecha de Solvencia</th>
                                <th className="px-6 py-3 border">Observaciones</th>
                                <th className="px-6 py-3 border">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hojas.length === 0 ? (
                                <tr>
                                    <td colSpan={14} className="text-center py-4">
                                        No hay hojas de responsabilidad registradas
                                    </td>
                                </tr>
                            ) : (
                                hojas.map((hoja) => (
                                    <tr key={hoja.id} className="text-center border-b">
                                        <td className="px-4 py-2">{hoja.hojaNo}</td>
                                        <td className="px-4 py-2">
                                            {hoja.fechaActualizacion
                                                ? (() => {
                                                    const d = new Date(hoja.fechaActualizacion);
                                                    const dia = String(d.getDate()).padStart(2, "0");
                                                    const mes = String(d.getMonth() + 1).padStart(2, "0");
                                                    const anio = String(d.getFullYear()).padStart(4, "0");
                                                    return `${dia}/${mes}/${anio}`;
                                                })()
                                                : ""}
                                        </td>
                                        <td className="px-4 py-2">{hoja.codigoEmpleado}</td>
                                        <td className="px-4 py-2">{hoja.nombreEmpleado}</td>
                                        <td className="px-4 py-2">{hoja.puesto}</td>
                                        <td className="px-4 py-2">{hoja.departamento}</td>
                                        <td className="px-4 py-2">{hoja.jefeInmediato}</td>
                                        <td className="px-4 py-2">{hoja.ubicacion}</td>
                                        <td className="px-4 py-2">{hoja.estado}</td>
                                        <td className="px-4 py-2">{hoja.solvenciaNo}</td>
                                        <td className="px-4 py-2">
                                            {hoja.fechaSolvencia
                                                ? (() => {
                                                    const d = new Date(hoja.fechaSolvencia);
                                                    const dia = String(d.getDate()).padStart(2, "0");
                                                    const mes = String(d.getMonth() + 1).padStart(2, "0");
                                                    const anio = String(d.getFullYear()).padStart(4, "0");
                                                    return `${dia}/${mes}/${anio}`;
                                                })()
                                                : ""}
                                        </td>
                                        <td className="px-4 py-2">{hoja.observaciones}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => generarPDFHojaResponsabilidad(hoja)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            >
                                                Exportar PDF
                                            </button>
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
};

export default ListaHojasResponsabilidad;
