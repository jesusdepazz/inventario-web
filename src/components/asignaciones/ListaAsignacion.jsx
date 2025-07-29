import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListaAsignaciones = () => {
    const [asignaciones, setAsignaciones] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://inveq.guandy.com/api/asignaciones", { credentials: "include" })
            .then(res => res.json())
            .then(data => setAsignaciones(data))
            .catch(err => console.error("Error al obtener asignaciones:", err));
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
                <table className="w-full text-sm text-left border border-gray-200">
                    <thead className="bg-indigo-100">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Código Empleado</th>
                            <th className="px-4 py-2 border">Nombre</th>
                            <th className="px-4 py-2 border">Puesto</th>
                            <th className="px-4 py-2 border">Departamento</th>
                            <th className="px-4 py-2 border">Codificación Equipo</th>
                            <th className="px-4 py-2 border">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asignaciones.length > 0 ? (
                            asignaciones.map((asig, index) => (
                                <tr key={asig.id || index} className="text-center">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">{asig.codigoEmpleado}</td>
                                    <td className="px-4 py-2 border">{asig.nombreEmpleado}</td>
                                    <td className="px-4 py-2 border">{asig.puesto}</td>
                                    <td className="px-4 py-2 border">{asig.departamento}</td>
                                    <td className="px-4 py-2 border">{asig.codificacionEquipo}</td>
                                    <td className="px-4 py-2 border">
                                        {asig.fecha
                                            ? new Date(asig.fecha).toLocaleDateString()
                                            : "—"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-4 text-gray-600">
                                    No hay asignaciones registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaAsignaciones;
