import React, { useState, useEffect } from "react";
import HojasService from "../../../services/HojasServices";
import generarPDFHoja from "./HojaResponsabilidadPDF";
import generarPDFHojaMovil from "./HojaResponsabilidadMovilPdf";
import { useNavigate } from "react-router-dom";
import { getRol } from "../../../services/auth"


const ListaHojasResponsabilidad = () => {
    const [hojas, setHojas] = useState([]);
    const navigate = useNavigate();
    const rol = getRol();

    useEffect(() => {
        const fetchHojas = async () => {
            try {
                const data = await HojasService.listarHojas();
                const hojasNormalizadas = data?.$values ?? data;
                setHojas(hojasNormalizadas);
                console.log("Hojas:", hojasNormalizadas);
            } catch (error) {
                console.error("Error al obtener hojas:", error);
                window.alert("Error al cargar las hojas de responsabilidad");
            }
        };

        fetchHojas();
    }, []);

    const handleGenerarPDF = (hoja) => {
        if (hoja.tipoHoja === "Movil") {
            generarPDFHojaMovil(hoja);
        } else {
            generarPDFHoja(hoja);
        }
    };

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
                                <th className="px-6 py-3 border">Hoja No</th>
                                <th className="px-6 py-3 border">Fecha de Actualizacion</th>
                                <th className="px-6 py-3 border">Codigo</th>
                                <th className="px-6 py-3 border">Responsable</th>
                                <th className="px-6 py-3 border">Puesto</th>
                                <th className="px-6 py-3 border">Departamento</th>
                                <th className="px-6 py-3 border">Jefe Inmediato</th>
                                <th className="px-6 py-3 border">Ubicacion del equipo</th>
                                <th className="px-6 py-3 border">Estado</th>
                                <th className="px-6 py-3 border">Fecha Solvencia</th>
                                <th className="px-6 py-3 border">Observaciones</th>
                                <th className="px-6 py-3 border">Tipo Hoja</th>
                                <th className="px-6 py-3 border">Acciones</th>
                                {rol === "Administrador" && (
                                    <th className="px-6 py-3 border">Editar</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {hojas.map((hoja) => (
                                <tr key={hoja.hojaNo} className="text-center border-b">
                                    <td className="px-4 py-2">{hoja.hojaNo}</td>
                                    <td className="px-4 py-2">
                                        {new Date(hoja.fechaCreacion).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })}
                                    </td>
                                    <td className="px-4 py-2">
                                        {hoja.empleados?.[0]?.empleadoId ?? "—"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {hoja.empleados?.[0]?.nombre ?? "—"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {hoja.empleados?.[0]?.puesto ?? "—"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {hoja.empleados?.[0]?.departamento ?? "—"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {hoja.jefeInmediato ?? "—"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {hoja.equipos?.[0]?.ubicacion ?? "—"}
                                    </td>
                                    <td className="px-4 py-2">{hoja.estado}</td>
                                    <td className="px-4 py-2">
                                        {new Date(hoja.fechaSolvencia).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })}
                                    </td>
                                    <td className="px-4 py-2">{hoja.observaciones}</td>
                                    <td className="px-4 py-2">{hoja.tipoHoja}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleGenerarPDF(hoja)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            PDF
                                        </button>
                                    </td>
                                    {rol === "Administrador" && (
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => navigate(`/hojas-responsabilidad/editar/${hoja.id}`)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListaHojasResponsabilidad;
