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

    const [empleadoActual, setEmpleadoActual] = useState({
        codigo: "",
        nombre: "",
        puesto: "",
        departamento: ""
    });

    const [empleadosAsignados, setEmpleadosAsignados] = useState([]);

    const [codificacion, setCodificacion] = useState("");

    const buscarEmpleado = async () => {
        if (!empleadoActual.codigo.trim()) {
            alert("Por favor ingresa un código de empleado");
            return;
        }

        try {
            const response = await EmpleadosService.obtenerPorCodigo(empleadoActual.codigo);
            const data = response.data;

            setEmpleadoActual({
                codigo: empleadoActual.codigo,
                nombre: data.nombre,
                puesto: data.puesto,
                departamento: data.departamento,
            });
        } catch (error) {
            alert("Empleado no encontrado");
        }
    };

    const agregarEmpleado = () => {
        if (!empleadoActual.codigo) return;

        const existe = empleadosAsignados.some(
            (e) => e.codigo === empleadoActual.codigo
        );

        if (existe) {
            alert("Este empleado ya fue agregado");
            return;
        }

        setEmpleadosAsignados((prev) => [...prev, empleadoActual]);

        setEmpleadoActual({
            codigo: "",
            nombre: "",
            puesto: "",
            departamento: ""
        });
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
        if (empleadosAsignados.length === 0 || equiposAsignados.length === 0) {
            alert("Debes agregar empleados y equipos");
            return;
        }

        try {
            const promesas = [];

            empleadosAsignados.forEach((emp) => {
                equiposAsignados.forEach((eq) => {
                    promesas.push(
                        AsignacionesService.crear({
                            codigoEmpleado: emp.codigo,
                            nombreEmpleado: emp.nombre,
                            puesto: emp.puesto,
                            departamento: emp.departamento,
                            codificacionEquipo: eq.codificacion,
                        })
                    );
                });
            });

            await Promise.all(promesas);

            alert("Asignaciones guardadas correctamente");
            navigate("/dashboard");
        } catch (error) {
            alert("Error al guardar asignaciones");
        }
    };

    return (
        <div className="flex justify-center px-4 py-10 overflow-y-auto">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-6xl">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">
                            Empleados
                        </h3>

                        <div className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                value={empleadoActual.codigo}
                                onChange={(e) =>
                                    setEmpleadoActual({ ...empleadoActual, codigo: e.target.value })
                                }
                                className="input-field"
                                placeholder="Código de empleado"
                            />

                            <button
                                type="button"
                                onClick={buscarEmpleado}
                                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                            >
                                Buscar
                            </button>

                            <button
                                type="button"
                                onClick={agregarEmpleado}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                                Agregar
                            </button>
                        </div>

                        {empleadoActual.nombre && (
                            <div className="mt-3 text-sm bg-gray-100 p-3 rounded border">
                                <strong>{empleadoActual.nombre}</strong> · {empleadoActual.puesto} · {empleadoActual.departamento}
                            </div>
                        )}

                        {empleadosAsignados.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {empleadosAsignados.map((emp, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 p-3 rounded border"
                                    >
                                        <div className="text-sm">
                                            <strong>{emp.codigo}</strong> — {emp.nombre} · {emp.puesto}
                                        </div>

                                        <button
                                            onClick={() =>
                                                setEmpleadosAsignados((prev) =>
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
