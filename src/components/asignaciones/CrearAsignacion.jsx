import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearAsignacion() {
    const navigate = useNavigate();
    const [empleado, setEmpleado] = useState({
        codigo: "",
        nombre: "",
        puesto: "",
        departamento: ""
    });

    const [equipo, setEquipo] = useState({
        marca: "",
        modelo: "",
        estado: "",
        tipo: "",
        ubicacion: ""
    });

    const [codificacion, setCodificacion] = useState("");

    const buscarEmpleado = async () => {
        if (!empleado.codigo.trim()) {
            alert("Por favor ingresa un código de empleado");
            return;
        }

        try {
            const response = await fetch(`https://inveq.guandy.com/api/empleados/${empleado.codigo}`);

            if (!response.ok) {
                throw new Error("Empleado no encontrado");
            }

            const data = await response.json();

            setEmpleado((prev) => ({
                ...prev,
                nombre: data.nombre,
                puesto: data.puesto,
                departamento: data.departamento
            }));
        } catch (error) {
            console.error("Error al buscar empleado:", error.message);
            alert("Empleado no encontrado");
        }
    };

    const buscarEquipo = async () => {
        try {
            const response = await fetch(`https://inveq.guandy.com/api/equipos/por-codificacion/${codificacion}`);
            if (!response.ok) throw new Error("Equipo no encontrado");
            const data = await response.json();
            setEquipo(data);
        } catch (error) {
            console.error("Error al buscar equipo:", error.message);
            setEquipo({
                marca: "",
                modelo: "",
                estado: "",
                tipo: "",
                ubicacion: ""
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmpleado((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const guardarAsignacion = async () => {
        const asignacion = {
            codigoEmpleado: empleado.codigo,
            nombreEmpleado: empleado.nombre,
            puesto: empleado.puesto,
            departamento: empleado.departamento,
            codificacionEquipo: codificacion,
        };

        try {
            const response = await fetch("https://inveq.guandy.com/api/api/asignaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(asignacion)
            });

            if (!response.ok) throw new Error("Error al guardar asignación");

            alert("Asignación guardada correctamente");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar la asignación");
        }
    };

    return (
        <div className="flex justify-center px-4 py-10 overflow-y-auto">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-6xl">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">Empleado</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-1">
                                <label htmlFor="codigo" className="mb-1 font-medium text-gray-700">Código de empleado</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="codigo"
                                        name="codigo"
                                        value={empleado.codigo}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                    <button
                                        type="button"
                                        onClick={buscarEmpleado}
                                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                                    >
                                        Buscar
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Nombre</label>
                                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm text-gray-800">
                                    {empleado.nombre || "—"}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Puesto</label>
                                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm text-gray-800">
                                    {empleado.puesto || "—"}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Departamento</label>
                                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm text-gray-800">
                                    {empleado.departamento || "—"}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">Detalles del equipo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="codificacion" className="mb-1 font-medium text-gray-700">Codificación del equipo</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="codificacion"
                                        value={codificacion}
                                        onChange={(e) => setCodificacion(e.target.value)}
                                        className="input-field"
                                    />
                                    <button
                                        type="button"
                                        onClick={buscarEquipo}
                                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                                    >
                                        Buscar
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Marca</label>
                                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm text-gray-800">
                                    {equipo.marca || "—"}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Modelo</label>
                                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm text-gray-800">
                                    {equipo.modelo || "—"}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Estado</label>
                                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm text-gray-800">
                                    {equipo.estado || "—"}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Tipo</label>
                                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm text-gray-800">
                                    {equipo.tipo || "—"}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Ubicación</label>
                                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm text-gray-800">
                                    {equipo.ubicacion || "—"}
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="flex justify-center gap-4 pt-6">
                        <button
                            type="button"
                            onClick={guardarAsignacion}
                            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                        >
                            Crear asignación
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 font-semibold text-sm transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
