import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmpleadosService from "../../services/EmpleadosServices";
import EquiposService from "../../services/EquiposServices";
import AsignacionesService from "../../services/AsignacionesServices";

export default function CrearAsignacion() {
    const navigate = useNavigate();

    const [equiposAsignados, setEquiposAsignados] = useState([]);

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
            const response = await EmpleadosService.obtenerPorCodigo(empleado.codigo);
            const data = response.data;

            setEmpleado((prev) => ({
                ...prev,
                nombre: data.nombre,
                puesto: data.puesto,
                departamento: data.departamento,
            }));
        } catch (error) {
            console.error("Error al buscar empleado:", error.message);
            alert("Empleado no encontrado");
        }
    };

    const buscarEquipo = async () => {
        if (!codificacion.trim()) return;

        try {
            const response = await EquiposService.obtenerPorCodificacion(codificacion);
            const data = response.data;

            const existe = equiposAsignados.some(
                (e) => e.codificacion === codificacion
            );

            if (existe) {
                alert("Este equipo ya fue agregado");
                return;
            }

            setEquipo(data);

            setEquiposAsignados((prev) => [
                ...prev,
                {
                    codificacion,
                    ...data
                }
            ]);

            setCodificacion("");
        } catch (error) {
            console.error("Error al buscar equipo:", error.message);
            alert("Equipo no encontrado");
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
        if (!empleado.codigo || equiposAsignados.length === 0) {
            alert("Empleado o equipos incompletos");
            return;
        }

        try {
            const promesas = equiposAsignados.map((eq) => {
                const asignacion = {
                    codigoEmpleado: empleado.codigo,
                    nombreEmpleado: empleado.nombre,
                    puesto: empleado.puesto,
                    departamento: empleado.departamento,
                    codificacionEquipo: eq.codificacion,
                };

                return AsignacionesService.crear(asignacion);
            });

            await Promise.all(promesas);

            alert("Asignaciones guardadas correctamente");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error al guardar asignaciones:", error.message);
            alert("Hubo un error al guardar las asignaciones");
        }
    };

    return (
        <div className="flex justify-center px-4 py-10 overflow-y-auto">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-6xl">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

                    {/* EMPLEADO */}
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">Empleado</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-1">
                                <label className="mb-1 font-medium text-gray-700">Código de empleado</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
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
                                <div className="px-3 py-2 bg-gray-100 rounded border">{empleado.nombre || "—"}</div>
                            </div>

                            <div>
                                <label className="mb-1 font-medium text-gray-700">Puesto</label>
                                <div className="px-3 py-2 bg-gray-100 rounded border">{empleado.puesto || "—"}</div>
                            </div>

                            <div>
                                <label className="mb-1 font-medium text-gray-700">Departamento</label>
                                <div className="px-3 py-2 bg-gray-100 rounded border">{empleado.departamento || "—"}</div>
                            </div>
                        </div>
                    </section>

                    {/* EQUIPOS */}
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">Detalles del equipo</h3>

                        <div className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                value={codificacion}
                                onChange={(e) => setCodificacion(e.target.value)}
                                className="input-field"
                                placeholder="Codificación del equipo"
                            />
                            <button
                                type="button"
                                onClick={buscarEquipo}
                                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                            >
                                Agregar
                            </button>
                        </div>

                        {/* LISTA DE EQUIPOS */}
                        {equiposAsignados.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {equiposAsignados.map((eq, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 p-3 rounded border"
                                    >
                                        <div className="text-sm">
                                            <strong>{eq.codificacion}</strong> — {eq.modelo} · {eq.tipoEquipo} · {eq.marca}
                                        </div>
                                        <button
                                            onClick={() =>
                                                setEquiposAsignados((prev) =>
                                                    prev.filter((_, i) => i !== index)
                                                )
                                            }
                                            className="text-red-600 text-sm hover:underline"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* BOTONES */}
                    <div className="flex justify-center gap-4 pt-6">
                        <button
                            type="button"
                            onClick={guardarAsignacion}
                            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                        >
                            Crear asignaciones
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 font-semibold text-sm"
                        >
                            Cancelar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
