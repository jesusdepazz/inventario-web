import React, { useState } from "react";
import axios from "axios";

const HojaResponsabilidadForm = () => {
    const [hojaNo, setHojaNo] = useState("");
    const [motivo, setMotivo] = useState("");
    const [comentarios, setComentarios] = useState("");

    const [empleados, setEmpleados] = useState([]);
    const [equipos, setEquipos] = useState([]);

    const [empleadoCodigo, setEmpleadoCodigo] = useState("");
    const [equipoCodificacion, setEquipoCodificacion] = useState("");

    const agregarEmpleado = async () => {
        if (!empleadoCodigo) return;

        try {
            const res = await axios.get(`https://localhost:7291/api/Empleados/${empleadoCodigo}`);
            setEmpleados([...empleados, res.data]);
            setEmpleadoCodigo("");
        } catch (err) {
            alert("Empleado no encontrado");
        }
    };

    const agregarEquipo = async () => {
        if (!equipoCodificacion) return;

        try {
            const res = await axios.get(`https://localhost:7291/api/Equipos/por-codificacion/${equipoCodificacion}`);
            setEquipos([...equipos, res.data]);
            setEquipoCodificacion("");
        } catch (err) {
            alert("Equipo no encontrado");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            hojaNo,
            motivo,
            comentarios,
            empleados: empleados.map(emp => ({
                empleadoId: emp.codigoEmpleado,
                nombre: emp.nombre,
                puesto: emp.puesto,
                departamento: emp.departamento
            })),
            equipos: equipos.map(eq => ({
                codificacion: eq.codificacion,
                marca: eq.marca,
                modelo: eq.modelo,
                serie: eq.serie,
                tipo: eq.tipo,
                tipoEquipo: eq.tipoEquipo,
                estado: eq.estado,
                ubicacion: eq.ubicacion
            }))
        };

        try {
            const res = await axios.post("https://localhost:7291/api/HojasResponsabilidad", payload);
            alert("Hoja creada con éxito! ID: " + res.data.id);
        } catch (error) {
            // Aquí capturamos el error exacto que envía el servidor
            if (error.response) {
                console.error("Respuesta del servidor:", error.response.data);
                alert("Error del servidor: " + JSON.stringify(error.response.data, null, 2));
            } else if (error.request) {
                console.error("No hubo respuesta del servidor:", error.request);
                alert("No hubo respuesta del servidor");
            } else {
                console.error("Error al configurar la solicitud:", error.message);
                alert("Error: " + error.message);
            }
        }
    };

    return (
        <div className="flex justify-center items-start px-4 py-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Crear Hoja de Responsabilidad</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Sección Hoja */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Detalles de la Hoja</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Hoja No.</label>
                                <input
                                    value={hojaNo}
                                    onChange={e => setHojaNo(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Motivo</label>
                                <input
                                    value={motivo}
                                    onChange={e => setMotivo(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-600 mb-1">Comentarios</label>
                            <textarea
                                value={comentarios}
                                onChange={e => setComentarios(e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Sección Empleados */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Agregar Empleado</h3>
                        <div className="flex gap-2 mb-3">
                            <input
                                placeholder="Código de empleado"
                                value={empleadoCodigo}
                                onChange={e => setEmpleadoCodigo(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                            <button
                                type="button"
                                onClick={agregarEmpleado}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                Agregar
                            </button>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                            {empleados.map((emp, i) => (
                                <li key={i} className="text-gray-700">{emp.nombre} - {emp.puesto}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Sección Equipos */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Agregar Equipo</h3>
                        <div className="flex gap-2 mb-3">
                            <input
                                placeholder="Codificación del equipo"
                                value={equipoCodificacion}
                                onChange={e => setEquipoCodificacion(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <button
                                type="button"
                                onClick={agregarEquipo}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                            >
                                Agregar
                            </button>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                            {equipos.map((eq, i) => (
                                <li key={i} className="text-gray-700">{eq.marca} {eq.modelo} ({eq.codificacion})</li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Crear Hoja
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default HojaResponsabilidadForm;
