import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HojasService from "../../../services/HojasServices";
import EquiposService from "../../../services/EquiposServices";
import EmpleadosService from "../../../services/EmpleadosServices";
import AsignacionesService from "../../../services/AsignacionesServices";

const HojaResponsabilidadEditar = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- Estados principales ---
    const [hojaNo, setHojaNo] = useState("");
    const [motivo, setMotivo] = useState("");
    const [comentarios, setComentarios] = useState("");
    const [estado, SetEstado] = useState("");
    const [solvenciaNo, SetSolvenciaNo] = useState("");
    const [fechaSolvencia, SetFechaSolvencia] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [empleados, setEmpleados] = useState([]);
    const [jefeInmediato, setJefeInmediato] = useState("");
    const [jefeSeleccionado, setJefeSeleccionado] = useState(null);
    const [jefeSuggestions, setJefeSuggestions] = useState([]);
    const [isTypingJefe, setIsTypingJefe] = useState(false);
    const [equipos, setEquipos] = useState([]);
    const [empleadoCodigo, setEmpleadoCodigo] = useState("");
    const [equipoCodificacion, setEquipoCodificacion] = useState("");
    const [accesorios, setAccesorios] = useState([]);

    const accesoriosDisponibles = [
        "Maletin", "Adaptador", "Cable USB", "Cargador/Cubo", "Audifonos",
        "Control Remoto", "Baterias", "Estuche", "Memoria SD", "Otros"
    ];

    // --- Fetch de hoja por ID ---
    useEffect(() => {
        const fetchHoja = async () => {
            try {
                const h = await HojasService.obtenerHoja(id);

                setHojaNo(h.hojaNo);
                setMotivo(h.motivo);
                setComentarios(h.comentarios || "");
                SetEstado(h.estado);
                setObservaciones(h.observaciones);
                SetSolvenciaNo(h.solvenciaNo || "");
                SetFechaSolvencia(h.fechaSolvencia?.slice(0, 10) || "");
                setAccesorios(h.accesorios ? h.accesorios.split(", ") : []);

                // Jefe
                if (h.jefeInmediato) {
                    const [nombre, puesto] = h.jefeInmediato.split(" - ");
                    setJefeSeleccionado({ nombre, puesto });
                    setJefeInmediato(h.jefeInmediato);
                }

                setEmpleados(h.empleados || []);
                setEquipos(h.equipos || []);

            } catch (err) {
                console.error(err);
                alert("Error al cargar la hoja");
            }
        };
        fetchHoja();
    }, [id]);

    // --- Jefe ---
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (jefeInmediato.trim().length < 2) return setJefeSuggestions([]);

            try {
                const res = await EmpleadosService.buscarPorNombre(jefeInmediato);
                setJefeSuggestions(res.data || []);
                setIsTypingJefe(true);
            } catch (err) {
                console.error(err);
                setJefeSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [jefeInmediato]);

    const selectJefe = (j) => {
        setJefeSeleccionado(j);
        setJefeInmediato(`${j.nombre} - ${j.puesto}`);
        setJefeSuggestions([]);
    };

    // --- Empleados ---
    const agregarEmpleado = async () => {
        if (!empleadoCodigo) return;

        try {
            const res = await EmpleadosService.obtenerPorCodigo(empleadoCodigo);
            const emp = res.data;

            if (!empleados.some(e => e.codigoEmpleado === emp.codigoEmpleado)) {
                setEmpleados([...empleados, emp]);

                // Traer equipos del empleado y agregar a lista
                const resEquipos = await AsignacionesService.obtenerEquiposPorEmpleado(emp.codigoEmpleado);
                const nuevosEquipos = resEquipos.data.map(eq => ({
                    Codificacion: eq.codificacion,
                    Marca: eq.marca,
                    Modelo: eq.modelo,
                    Serie: eq.serie,
                    TipoEquipo: eq.tipoEquipo,
                    Ubicacion: eq.ubicacion,
                    FechaIngreso: eq.fechaIngreso,
                    Estado: eq.estado || "Activo"
                }));

                setEquipos([...equipos, ...nuevosEquipos]);
            }

            setEmpleadoCodigo("");
        } catch (err) {
            console.error(err);
            alert("Empleado no encontrado o sin equipos asignados");
        }
    };

    const eliminarEmpleado = (index) => setEmpleados(empleados.filter((_, i) => i !== index));

    // --- Equipos ---
    const agregarEquipo = async () => {
        if (!equipoCodificacion) return;

        try {
            const res = await EquiposService.obtenerPorCodificacion(equipoCodificacion);
            const eq = res.data;

            const equipoDTO = {
                Codificacion: eq.codificacion,
                Marca: eq.marca,
                Modelo: eq.modelo,
                Serie: eq.serie,
                TipoEquipo: eq.tipoEquipo,
                Ubicacion: eq.ubicacion,
                FechaIngreso: eq.fechaIngreso,
                Estado: eq.estado || "Activo"
            };

            setEquipos([...equipos, equipoDTO]);
            setEquipoCodificacion("");
        } catch (err) {
            console.error(err);
            alert("Equipo no encontrado");
        }
    };

    const eliminarEquipo = (index) => setEquipos(equipos.filter((_, i) => i !== index));

    // --- Submit ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            HojaNo: hojaNo,
            Motivo: motivo,
            Comentarios: comentarios,
            Estado: estado,
            Observaciones: observaciones,
            Accesorios: accesorios.join(", "),
            JefeInmediato: jefeSeleccionado
                ? `${jefeSeleccionado.nombre} - ${jefeSeleccionado.puesto}`
                : jefeInmediato,
            Empleados: empleados.map(emp => ({
                EmpleadoId: emp.codigoEmpleado ?? emp.empleadoId,
                Nombre: emp.nombre,
                Puesto: emp.puesto,
                Departamento: emp.departamento
            })),
            Equipos: equipos.map(eq => ({
                Codificacion: eq.Codificacion ?? eq.codificacion,
                Marca: eq.Marca ?? eq.marca,
                Modelo: eq.Modelo ?? eq.modelo,
                Serie: eq.Serie ?? eq.serie,
                TipoEquipo: eq.TipoEquipo ?? eq.tipoEquipo,
                Ubicacion: eq.Ubicacion ?? eq.ubicacion,
                FechaIngreso: eq.FechaIngreso ?? eq.fechaIngreso,
                Estado: eq.Estado ?? eq.estado ?? "Activo"
            })),
            ...(estado === "Inactiva" && {
                SolvenciaNo: solvenciaNo,
                FechaSolvencia: fechaSolvencia
            })
        };

        console.log("Payload a enviar:", payload);

        try {
            await HojasService.actualizarHoja(id, payload);
            alert("Hoja actualizada correctamente");
            navigate("/hojas-responsabilidad");
        } catch (err) {
            console.error(err);
            alert("Error al actualizar la hoja");
        }
    };

    // --- Render ---
    return (
        <div className="flex justify-center items-start px-4 py-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
                    Editar Hoja de Responsabilidad
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Detalles de la hoja */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Detalles de la Hoja
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 mb-1 font-semibold">Hoja No.</label>
                                <input
                                    value={hojaNo}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label>Motivo</label>
                                <input
                                    value={motivo}
                                    onChange={e => setMotivo(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label>Estado</label>
                                <select
                                    value={estado}
                                    onChange={e => SetEstado(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    <option value="">-- Selecciona --</option>
                                    <option value="Activa">Activa</option>
                                    <option value="Inactiva">Inactiva</option>
                                </select>
                            </div>
                            {estado === "Inactiva" && (
                                <>
                                    <div>
                                        <label>No. Solvencia</label>
                                        <input
                                            value={solvenciaNo}
                                            onChange={e => SetSolvenciaNo(e.target.value)}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label>Fecha Solvencia</label>
                                        <input
                                            type="date"
                                            value={fechaSolvencia}
                                            onChange={e => SetFechaSolvencia(e.target.value)}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label>Observaciones</label>
                                <input
                                    value={observaciones}
                                    onChange={e => setObservaciones(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <label>Comentarios</label>
                            <textarea
                                value={comentarios}
                                onChange={e => setComentarios(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label>Accesorios</label>
                            {accesoriosDisponibles.map(item => (
                                <div key={item}>
                                    <input
                                        type="checkbox"
                                        checked={accesorios.includes(item)}
                                        onChange={e => {
                                            if (e.target.checked) setAccesorios([...accesorios, item]);
                                            else setAccesorios(accesorios.filter(a => a !== item));
                                        }}
                                    /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Agregar Empleado</h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                placeholder="Código de empleado"
                                value={empleadoCodigo}
                                onChange={e => setEmpleadoCodigo(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={agregarEmpleado}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Agregar
                            </button>
                        </div>

                        <ul className="space-y-2">
                            {empleados.map((emp, i) => (
                                <li
                                    key={i}
                                    className="flex justify-between items-center bg-white p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{emp.nombre}</p>
                                        <p className="text-sm text-gray-500">{emp.puesto}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => eliminarEmpleado(i)}
                                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative mt-4">
                        <label className="block text-gray-600 mb-1 font-semibold">Jefe Inmediato</label>
                        <input
                            placeholder="Nombre del jefe"
                            value={jefeInmediato}
                            onChange={e => {
                                setJefeInmediato(e.target.value);
                                setIsTypingJefe(e.target.value.trim().length > 0);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        {isTypingJefe && jefeSuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto z-20 mt-1">
                                {jefeSuggestions.map((j, i) => (
                                    <li
                                        key={i}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => selectJefe(j)}
                                    >
                                        <strong>{j.nombre}</strong> — {j.puesto}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200 mt-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Agregar Equipo</h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                placeholder="Codificación del equipo"
                                value={equipoCodificacion}
                                onChange={e => setEquipoCodificacion(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={agregarEquipo}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Agregar
                            </button>
                        </div>

                        <ul className="space-y-2">
                            {equipos.map((eq, i) => (
                                <li
                                    key={i}
                                    className="flex justify-between items-center bg-white p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {eq.Marca || eq.marca} {eq.Modelo || eq.modelo}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {eq.TipoEquipo || eq.tipoEquipo} — {eq.Codificacion || eq.codificacion}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => eliminarEquipo(i)}
                                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl">Actualizar Hoja</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HojaResponsabilidadEditar;
