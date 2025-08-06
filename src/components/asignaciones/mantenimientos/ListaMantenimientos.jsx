import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MantenimientosService from "../../../services/MantenimientosServices";

const ListaMantenimientos = () => {
    const [mantenimientos, setMantenimientos] = useState([]);
    const navigate = useNavigate();

    const cargarMantenimientos = async () => {
        try {
            const res = await MantenimientosService.obtenerTodos();
            setMantenimientos(res.data);
        } catch (error) {
            console.error("Error al obtener mantenimientos:", error);
        }
    };

    useEffect(() => {
<<<<<<< HEAD
        axios
            .get("https://inveq.guandy.com/api/Mantenimientos", {
                withCredentials: true,
            })
            .then((res) => setMantenimientos(res.data))
            .catch((err) => console.error("Error al obtener mantenimientos:", err));
=======
        cargarMantenimientos();
>>>>>>> jesusdepazz
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
                <table className="w-full text-sm text-left border border-gray-200">
                    <thead className="bg-indigo-100">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Codificación</th>
                            <th className="px-4 py-2 border">Modelo</th>
                            <th className="px-4 py-2 border">Tipo Mantenimiento</th>
                            <th className="px-4 py-2 border">Realizado por</th>
                            <th className="px-4 py-2 border">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mantenimientos.length > 0 ? (
                            mantenimientos.map((m, index) => (
                                <tr key={m.id} className="border-t">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">{m.id}</td>
                                    <td className="px-4 py-2 border font-medium">{m.codificacion}</td>
                                    <td className="px-4 py-2 border">{m.modelo}</td>
                                    <td className="px-4 py-2 border">{m.tipoMantenimiento}</td>
                                    <td className="px-4 py-2 border">{m.realizadoPor}</td>
                                    <td className="px-4 py-2 border">
                                        {new Date(m.fecha).toLocaleDateString("es-GT", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-500 py-6">
                                    No se encontraron mantenimientos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaMantenimientos;
