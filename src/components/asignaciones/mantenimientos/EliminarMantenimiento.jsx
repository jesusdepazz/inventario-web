import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EliminarMantenimientos = () => {
    const [mantenimientos, setMantenimientos] = useState([]);

    const CargarMantenimiento = async () => {
        try {
            const res = await axios.get("https://localhost:7291/api/Mantenimientos", {
                withCredentials: true,
            });
            setMantenimientos(res.data);
        } catch (error) {
            console.error("Error al obtener mantenimientos:", error);
            toast.error("❌ Error al cargar mantenimientos");
        }
    };

    const EliminarMantenimiento = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta solicitud?")) return;

    try {
      await axios.delete(`https://localhost:7291/api/Mantenimientos/${id}`);
      toast.success("Mantenimiento eliminado correctamente");
      CargarMantenimiento();
    } catch (err) {
      console.error("Error al eliminar mantenimiento", err);
      toast.error("No se pudo eliminar el mantenimiento");
    }
  };

    useEffect(() => {
        CargarMantenimiento();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
                <table className="w-full text-sm text-left border border-gray-200">
                    <thead className="bg-indigo-100">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Codificación</th>
                            <th className="px-4 py-2 border">Modelo</th>
                            <th className="px-4 py-2 border">Tipo</th>
                            <th className="px-4 py-2 border">Realizado por</th>
                            <th className="px-4 py-2 border">Motivo</th>
                            <th className="px-4 py-2 border">Fecha</th>
                            <th className="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mantenimientos.length > 0 ? (
                            mantenimientos.map((m) => (
                                <tr key={m.id} className="text-center hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{m.id}</td>
                                    <td className="px-4 py-2 border">{m.codificacion}</td>
                                    <td className="px-4 py-2 border">{m.modelo}</td>
                                    <td className="px-4 py-2 border">{m.tipoMantenimiento}</td>
                                    <td className="px-4 py-2 border">{m.realizadoPor}</td>
                                    <td className="px-4 py-2 border">{m.motivo || "—"}</td>
                                    <td className="px-4 py-2 border">
                                        {new Date(m.fecha).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 border flex justify-center">
                                        <button
                                            onClick={() => EliminarMantenimiento(m.id)}
                                            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 font-semibold text-sm transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-4 text-gray-500">
                                    No hay mantenimientos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EliminarMantenimientos;
