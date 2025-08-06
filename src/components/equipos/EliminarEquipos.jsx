import React, { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";
import EquiposService from "../../services/EquiposServices";

const EliminarEquipos = () => {
    const [equipos, setEquipo] = useState([]);
    const [filtros, setFiltros] = useState({
        codificacion: "",
        marca: "",
        modelo: "",
        tipo: "",
        fechaExacta: "",
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const colorEstado = {
        "Buen estado": "text-green-600 font-bold",
        Inactivo: "text-orange-500 font-bold",
        Obsoleto: "text-red-600 font-bold",
    };

    const cargarEquipo = async () => {
        try {
            const res = await EquiposService.obtenerEquipos();
            setEquipo(res.data);
        } catch (err) {
            console.error("Error al cargar equipos", err);
            toast.error("Error al obtener los equipos");
        }
    };

    const eliminarEquipos = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este equipo?")) return;

        try {
            await EquiposService.eliminar(id);
            toast.success("Equipo eliminado correctamente");
            cargarEquipo();
        } catch (err) {
            console.error("Error al eliminar equipo", err);
            toast.error("No se pudo eliminar el equipo");
        }
    };

    useEffect(() => {
        cargarEquipo();
    }, []);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };


    const equiposFiltrados = equipos.filter((equipo) => {
        return (
            equipo.codificacion?.toLowerCase().includes(filtros.codificacion.toLowerCase()) &&
            equipo.marca?.toLowerCase().includes(filtros.marca.toLowerCase()) &&
            equipo.modelo?.toLowerCase().includes(filtros.modelo.toLowerCase()) &&
            equipo.tipo?.toLowerCase().includes(filtros.tipo.toLowerCase()) &&
            (!filtros.fechaExacta ||
                new Date(equipo.fechaIngreso).toISOString().split("T")[0] === filtros.fechaExacta)
        );
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        name="codificacion"
                        placeholder="Buscar por codificación"
                        value={filtros.codificacion}
                        onChange={handleFiltroChange}
                        className="border border-gray-300 rounded-md px-4 py-2 w-64"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Mostrar filtros"
                        >
                            <FiFilter size={24} />
                        </button>
                    </div>
                </div>

                {mostrarFiltros && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {["marca", "modelo", "tipo"].map((campo) => (
                            <input
                                key={campo}
                                type="text"
                                name={campo}
                                placeholder={`Filtrar por ${campo}`}
                                value={filtros[campo]}
                                onChange={handleFiltroChange}
                                className="border border-gray-300 rounded-md px-4 py-2"
                            />
                        ))}
                        <input
                            type="date"
                            name="fechaExacta"
                            value={filtros.fechaExacta}
                            onChange={handleFiltroChange}
                            className="border border-gray-300 rounded-md px-4 py-2"
                        />
                    </div>
                )}

                <table className="w-full text-sm text-left border border-gray-200">
                    <thead className="bg-indigo-100">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Codificación</th>
                            <th className="px-4 py-2 border">Marca</th>
                            <th className="px-4 py-2 border">Modelo</th>
                            <th className="px-4 py-2 border">Serie</th>
                            <th className="px-4 py-2 border">IMEI</th>
                            <th className="px-4 py-2 border">Estado</th>
                            <th className="px-4 py-2 border">Tipo</th>
                            <th className="px-4 py-2 border">Ubicación</th>
                            <th className="px-4 py-2 border">Imagen</th>
                            <th className="px-4 py-2 border">Fecha Ingreso</th>
                            <th className="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equiposFiltrados.length > 0 ? (
                            equiposFiltrados.map((equipo) => (
                                <tr key={equipo.id} className="text-center">
                                    <td className="px-4 py-2 border">{equipo.id}</td>
                                    <td className="px-4 py-2 border">{equipo.codificacion}</td>
                                    <td className="px-4 py-2 border">{equipo.marca}</td>
                                    <td className="px-4 py-2 border">{equipo.modelo}</td>
                                    <td className="px-4 py-2 border">{equipo.serie}</td>
                                    <td className="px-4 py-2 border">{equipo.imei}</td>
                                    <td className={`px-4 py-2 border ${colorEstado[equipo.estado] || ""}`}>
                                        {equipo.estado}
                                    </td>
                                    <td className="px-4 py-2 border">{equipo.tipo}</td>
                                    <td className="px-4 py-2 border">{equipo.ubicacion}</td>
                                    <td className="px-4 py-2 border">
                                        {equipo.imagenRuta ? (
                                            <img
                                                src={`https://inveq.guandy.com/${equipo.imagenRuta}`}
                                                alt="Equipo"
                                                className="w-20 h-auto rounded"
                                            />
                                        ) : (
                                            "Sin imagen"
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {new Date(equipo.fechaIngreso).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-5 justify-center">
                                        <button
                                            onClick={() => eliminarEquipos(equipo.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold text-sm transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center p-4 text-gray-600">
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

export default EliminarEquipos;
