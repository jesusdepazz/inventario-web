import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EliminarAsignacion() {
    const [asignaciones, setAsignaciones] = useState([]);

    const obtenerAsignaciones = async () => {
        try {
            const res = await axios.get("https://inveq.guandy.com/api/asignaciones", {
                withCredentials: true,
            });
            setAsignaciones(res.data);
        } catch (error) {
            console.error("Error al obtener asignaciones:", error);
            toast.error("❌ No se pudieron obtener las asignaciones.");
        }
    };

    useEffect(() => {
        obtenerAsignaciones();
    }, []);


    const EliminarAsignacion = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta asignacion?")) return;

        try {
            await axios.delete(`https://inveq.guandy.com/api/Asignaciones/${id}`);
            toast.success("Asignacion eliminado correctamente");
            obtenerAsignaciones();
        } catch (err) {
            console.error("Error al eliminar asignacion", err);
            toast.error("No se pudo eliminar la asignacion");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
                <table className="w-full text-sm text-left border border-gray-200">
                    <thead className="bg-indigo-100">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Código Empleado</th>
                            <th className="px-4 py-2 border">Nombre</th>
                            <th className="px-4 py-2 border">Departamento</th>
                            <th className="px-4 py-2 border">Puesto</th>
                            <th className="px-4 py-2 border">Codificación Equipo</th>
                            <th className="px-4 py-2 border">Fecha Asignación</th>
                            <th className="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asignaciones.length > 0 ? (
                            asignaciones.map((asignacion, index) => (
                                <tr key={asignacion.id} className="text-center">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">{asignacion.codigoEmpleado}</td>
                                    <td className="px-4 py-2 border">{asignacion.nombreEmpleado}</td>
                                    <td className="px-4 py-2 border">{asignacion.departamento}</td>
                                    <td className="px-4 py-2 border">{asignacion.puesto}</td>
                                    <td className="px-4 py-2 border">{asignacion.codificacionEquipo}</td>
                                    <td className="px-4 py-2 border">
                                        {new Date(asignacion.fechaAsignacion).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 border flex justify-center">
                                        <button
                                            onClick={() => EliminarAsignacion(asignacion.id)}
                                            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 font-semibold text-sm transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="p-4 text-center text-gray-500">
                                    No hay asignaciones registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
