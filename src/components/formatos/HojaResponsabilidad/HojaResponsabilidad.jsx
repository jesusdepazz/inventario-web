import React, { useState, useEffect } from "react";
import HojasService from "../../../services/HojasServices";
import EquiposService from "../../../services/EquiposServices";
import EmpleadosService from "../../../services/EmpleadosServices";
import AsignacionesService from "../../../services/AsignacionesServices";

const HojaResponsabilidadForm = () => {
    const [hojaNo, setHojaNo] = useState("");
    const [motivo, setMotivo] = useState("");
    const [comentarios, setComentarios] = useState("");
    const [estado, SetEstado] = useState("");
    const [solvenciaNo, SetSolvenciaNo] = useState("");
    const [fechaSolvencia, SetFechaSolvencia] = useState("");
    const [observaciones, SetObservaciones] = useState("");
    const [empleados, setEmpleados] = useState([]);
    const [jefeInmediato, setJefeInmediato] = useState("");
    const [jefeData, setJefeData] = useState(null);
    const [jefeSuggestions, setJefeSuggestions] = useState([]);
    const [isTypingJefe, setIsTypingJefe] = useState(false);
    const [jefeSeleccionado, setJefeSeleccionado] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [empleadoCodigo, setEmpleadoCodigo] = useState("");
    const [equipoCodificacion, setEquipoCodificacion] = useState("");
    const [accesorios, setAccesorios] = useState([]);


    const agregarEmpleado = async () => {
        if (!empleadoCodigo) return;

        try {
            const res = await EmpleadosService.obtenerPorCodigo(empleadoCodigo);
            const empleado = res.data;

            setEmpleados([...empleados, empleado]);

            const resEquipos = await AsignacionesService
                .obtenerEquiposPorEmpleado(empleado.codigoEmpleado);

            setEquipos(resEquipos.data || []);

            setEmpleadoCodigo("");
        } catch (err) {
            console.error(err);
            window.alert("Empleado no encontrado o sin equipos asignados");
        }
    };


    useEffect(() => {
        const delay = setTimeout(async () => {
            if (jefeInmediato.trim().length < 2) {
                setJefeSuggestions([]);
                return;
            }

            try {
                const res = await EmpleadosService.buscarPorNombre(jefeInmediato);

                if (res?.data && Array.isArray(res.data)) {
                    setJefeSuggestions(res.data);
                    setIsTypingJefe(true);
                } else {
                    setJefeSuggestions([]);
                }
            } catch (err) {
                console.error(err);
                setJefeSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [jefeInmediato]);


    const selectJefe = (jefe) => {
        setJefeData(jefe);
        setJefeSeleccionado(jefe);
        setJefeInmediato(jefe.nombre);
        setJefeSuggestions([]);
    };

    const eliminarEmpleado = (index) => {
        setEmpleados(empleados.filter((_, i) => i !== index));
    };

    const agregarEquipo = async () => {
        if (!equipoCodificacion) return;

        try {
            const res = await EquiposService.obtenerPorCodificacion(equipoCodificacion);
            setEquipos([...equipos, res.data]);
            setEquipoCodificacion("");
        } catch (err) {
            window.alert("Equipo no encontrado");
        }
    };

    const eliminarEquipo = (index) => {
        setEquipos(equipos.filter((_, i) => i !== index));
    };

    const accesoriosDisponibles = [
        "Maletin",
        "Adaptador",
        "Cable USB",
        "Cargador/Cubo",
        "Audifonos",
        "Control Remoto",
        "Baterias",
        "Estuche",
        "Memoria SD",
        "Otros"
    ];


    const handleSubmit = async (e) => {
        e.preventDefault();

        const accesoriosString =
            Array.isArray(accesorios) && accesorios.length > 0
                ? accesorios.join(", ")
                : "";

        const empleadosMapped =
            Array.isArray(empleados) && empleados.length > 0
                ? empleados.map((emp) => ({
                    EmpleadoId: emp.codigoEmpleado,
                    Nombre: emp.nombre,
                    Puesto: emp.puesto,
                    Departamento: emp.departamento,
                }))
                : [];

        const equiposMapped =
            Array.isArray(equipos) && equipos.length > 0
                ? equipos.map((eq) => ({
                    Codificacion: eq.codificacion,
                    Marca: eq.marca,
                    Modelo: eq.modelo,
                    Serie: eq.serie,
                    TipoEquipo: eq.tipoEquipo,
                    Ubicacion: eq.ubicacion,
                    FechaIngreso: eq.fechaIngreso,
                    Estado: eq.estado,
                }))
                : [];

        const payload = {
            HojaNo: hojaNo,
            Motivo: motivo,
            Comentarios: comentarios,
            Estado: estado,
            Observaciones: observaciones,
            Accesorios: accesoriosString,
            JefeInmediato: jefeSeleccionado
                ? `${jefeSeleccionado.nombre} - ${jefeSeleccionado.puesto}`
                : "",
            Empleados: empleadosMapped,
            Equipos: equiposMapped,
            ...(estado === "Inactiva" && {
                SolvenciaNo: solvenciaNo,
                FechaSolvencia: fechaSolvencia,
            }),
        };

        try {
            const res = await HojasService.crearHoja(payload);
            window.alert("Hoja creada con éxito! ID: " + res.Id);
        } catch (error) {
            if (error.mensaje) {
                window.alert("Error del servidor: " + error.mensaje);
            } else {
                console.error(error);
                window.alert("Ocurrió un error al crear la hoja");
            }
        }
    };

    return (
        <div className="flex justify-center items-start px-4 py-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
                    Crear Hoja de Responsabilidad
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Detalles de la Hoja
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Hoja No.</label>
                                <input
                                    value={hojaNo}
                                    onChange={(e) => setHojaNo(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Motivo</label>
                                <input
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Estado</label>
                                <select
                                    value={estado}
                                    onChange={(e) => SetEstado(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">-- Selecciona estado --</option>
                                    <option value="Activa">Activa</option>
                                    <option value="Inactiva">Inactiva</option>
                                </select>
                            </div>
                            {estado === "Inactiva" && (
                                <>
                                    <div>
                                        <label className="block text-gray-600 mb-1">No. Solvencia</label>
                                        <input
                                            value={solvenciaNo}
                                            onChange={(e) => SetSolvenciaNo(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 mb-1">Fecha de Solvencia</label>
                                        <input
                                            type="date"
                                            value={fechaSolvencia}
                                            onChange={(e) => SetFechaSolvencia(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-gray-600 mb-1">Observaciones</label>
                                <input
                                    value={observaciones}
                                    onChange={(e) => SetObservaciones(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-600 mb-1">Comentarios</label>
                            <textarea
                                value={comentarios}
                                onChange={(e) => setComentarios(e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Accesorios</label>
                            {accesoriosDisponibles.map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={accesorios.includes(item)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setAccesorios([...accesorios, item]);
                                            } else {
                                                setAccesorios(accesorios.filter((a) => a !== item));
                                            }
                                        }}
                                    />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Agregar Empleado
                        </h3>
                        <div className="flex gap-2 mb-3">
                            <input
                                placeholder="Código de empleado"
                                value={empleadoCodigo}
                                onChange={(e) => setEmpleadoCodigo(e.target.value)}
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
                        <ul className="space-y-2">
                            {empleados.map((emp, i) => (
                                <li
                                    key={i}
                                    className="flex justify-between items-center bg-white p-2 border rounded-lg shadow-sm"
                                >
                                    <span className="text-gray-700">
                                        {emp.nombre} - {emp.puesto}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => eliminarEmpleado(i)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col mb-3 relative">
                        <input
                            placeholder="Ingrese nombre del jefe inmediato"
                            value={jefeInmediato}
                            onChange={(e) => {
                                const val = e.target.value;
                                setJefeInmediato(val);
                                setIsTypingJefe(val.trim().length > 0);

                                if (val.trim().length < 2) {
                                    setJefeSuggestions([]);
                                }
                            }}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {isTypingJefe && jefeSuggestions.length > 0 && (
                            <ul className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-20 max-h-48 overflow-auto">
                                {jefeSuggestions.map((j, i) => (
                                    <li
                                        key={i}
                                        className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            selectJefe(j);
                                            setIsTypingJefe(false);
                                        }}
                                    >
                                        <strong>{j.nombre}</strong> — {j.puesto}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {jefeData && (
                        <div className="bg-white p-2 border rounded-lg shadow-sm flex justify-between items-center mt-2">
                            <span>{jefeData.nombre} - {jefeData.puesto}</span>
                            <button
                                className="text-red-500 font-bold"
                                onClick={() => {
                                    setJefeData(null);
                                    setJefeInmediato("");
                                    setIsTypingJefe(false);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Agregar Equipo
                        </h3>
                        <div className="flex gap-2 mb-3">
                            <input
                                placeholder="Codificación del equipo"
                                value={equipoCodificacion}
                                onChange={(e) => setEquipoCodificacion(e.target.value)}
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
                        <ul className="space-y-2">
                            {equipos.map((eq, i) => (
                                <li
                                    key={i}
                                    className="flex justify-between items-center bg-white p-2 border rounded-lg shadow-sm"
                                >
                                    <span className="text-gray-700">
                                        {eq.marca} {eq.modelo} ({eq.codificacion})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => eliminarEquipo(i)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ✕
                                    </button>
                                </li>
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
