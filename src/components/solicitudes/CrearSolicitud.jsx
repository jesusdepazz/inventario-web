import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CrearSolicitud = () => {
    const [empleado, setEmpleado] = useState({
        codigo: "",
        nombre: "",
        puesto: "",
        departamento: "",
    });

    const [ubicaciones, setUbicaciones] = useState([]);
    const [ubicacion, setUbicacion] = useState("");
    const [jefeInmediato, setJefeInmediato] = useState("");

    const [equiposDisponibles, setEquiposDisponibles] = useState([]);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState({
        codificacion: "",
        marca: "",
        modelo: "",
        serie: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://inveq.guandy.com/api/ubicaciones")
            .then(res => setUbicaciones(res.data))
            .catch(err => console.error("Error al cargar ubicaciones:", err));

        axios.get("https://inveq.guandy.com/api/equipos", { withCredentials: true })
            .then(res => {
                const disponibles = res.data.filter(e => !e.asignaciones || e.asignaciones.length === 0);
                setEquiposDisponibles(disponibles);
            })
            .catch(err => console.error("Error al cargar equipos:", err));
    }, []);

    const buscarEmpleado = async () => {
        try {
            const res = await axios.get(`https://inveq.guandy.com/api/empleados${empleado.codigo}`);
            const data = res.data;
            setEmpleado({
                ...empleado,
                nombre: data.nombre,
                puesto: data.puesto,
                departamento: data.departamento,
            });
        } catch (err) {
            toast.error("Empleado no encontrado");
            setEmpleado({
                ...empleado,
                nombre: "",
                puesto: "",
                departamento: "",
            });
        }
    };

    const handleEquipoSeleccionado = (e) => {
        const cod = e.target.value;
        const equipo = equiposDisponibles.find(eq => eq.codificacion === cod);
        if (equipo) {
            setEquipoSeleccionado({
                codificacion: cod,
                marca: equipo.marca,
                modelo: equipo.modelo,
                serie: equipo.serie,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!empleado.nombre || !ubicacion || !equipoSeleccionado.codificacion) {
            toast.warn("Por favor completa todos los campos requeridos");
            return;
        }

        const solicitud = {
            codigoEmpleado: empleado.codigo,
            nombreEmpleado: empleado.nombre,
            puesto: empleado.puesto,
            departamento: empleado.departamento,
            ubicacion,
            jefeInmediato,
            codificacionEquipo: equipoSeleccionado.codificacion,
            marca: equipoSeleccionado.marca,
            modelo: equipoSeleccionado.modelo,
            serie: equipoSeleccionado.serie
        };

        try {
            await axios.post("https://inveq.guandy.com/api/solicitudes", solicitud);
            toast.success("Solicitud creada exitosamente");
            navigate("/solicitudesDashboard");
        } catch (err) {
            console.error(err);
            toast.error("Error al crear la solicitud");
        }
    };

    return (
        <div className="flex justify-center px-4 py-10 overflow-y-auto">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-6xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">Datos del Empleado</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="codigo" className="mb-1 font-medium text-gray-700">Código de empleado</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="codigo"
                                        value={empleado.codigo}
                                        onChange={(e) => setEmpleado({ ...empleado, codigo: e.target.value })}
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
                                <div className="info-box">{empleado.nombre || "—"}</div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Puesto</label>
                                <div className="info-box">{empleado.puesto || "—"}</div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Departamento</label>
                                <div className="info-box">{empleado.departamento || "—"}</div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">Detalles del equipo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Ubicación</label>
                                <select
                                    value={ubicacion}
                                    onChange={(e) => setUbicacion(e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Seleccione una ubicación</option>
                                    {ubicaciones.map((ubi) => (
                                        <option key={ubi.id} value={ubi.id}>{ubi.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Jefe Inmediato</label>
                                <input
                                    type="text"
                                    value={jefeInmediato}
                                    onChange={(e) => setJefeInmediato(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Equipo</label>
                                <select
                                    value={equipoSeleccionado.codificacion}
                                    onChange={handleEquipoSeleccionado}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Seleccione un equipo</option>
                                    {equiposDisponibles.map((e, i) => (
                                        <option key={i} value={e.codificacion}>
                                            {e.codificacion} - {e.modelo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Marca</label>
                                <div className="info-box">{equipoSeleccionado.marca || "—"}</div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Modelo</label>
                                <div className="info-box">{equipoSeleccionado.modelo || "—"}</div>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Serie</label>
                                <div className="info-box">{equipoSeleccionado.serie || "—"}</div>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-center gap-4 pt-6">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold"
                        >
                            Crear Solicitud
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/solicitudesDashboard")}
                            className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 text-sm font-semibold"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearSolicitud;
