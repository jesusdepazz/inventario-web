import React, { useState } from 'react';
import axios from 'axios';
import HojasServices from '../../../services/HojasServices';

const HojaResponsabilidad = () => {
    const [codigoEmpleado, setCodigoEmpleado] = useState("");
    const [codigoEquipo, setCodigoEquipo] = useState("");

    const [empleado, setEmpleado] = useState({
        nombre: "",
        puesto: "",
        departamento: "",
    });

    const [equipo, setEquipo] = useState({
        fechaEquipo: "",
        equipo: "",
        modelo: "",
        serie: "",
        ubicacion: "",
        marca: "",
    });

    const [fechaActualizacion, setFechaActualizacion] = useState("");
    const [jefeInmediato, setJefeInmediato] = useState("");
    const [motivoActualizacion, setMotivoActualizacion] = useState("");
    const [comentarios, setComentarios] = useState("");
    const [estado, setEstado] = useState("");
    const [solvenciaNo, setSolvenciaNo] = useState("")
    const [fechaSolvencia, setFechaSolvencia] = useState("")
    const [observaciones, setObservaciones] = useState("")

    const handleBuscarEmpleado = async () => {
        if (!codigoEmpleado.trim()) return;
        try {
            const res = await axios.get(`https://localhost:7291/api/empleados/${codigoEmpleado}`);
            setEmpleado({
                nombre: res.data.nombre,
                puesto: res.data.puesto,
                departamento: res.data.departamento,
            });
        } catch (error) {
            alert("Empleado no encontrado");
        }
    };

    const handleBuscarEquipo = async () => {
        if (!codigoEquipo.trim()) return;
        try {
            const res = await axios.get(`https://localhost:7291/api/equipos/por-codificacion/${codigoEquipo}`);
            setEquipo({
                fechaEquipo: res.data.fechaIngreso, // 👈 se asigna al campo correcto
                equipo: res.data.tipoEquipo,        // 👈 se asigna al campo correcto
                modelo: res.data.modelo,
                serie: res.data.serie,
                ubicacion: res.data.ubicacion,
                marca: res.data.marca,
            });
        } catch (error) {
            alert("Equipo no encontrado");
        }
    };

    const handleGuardarHoja = async () => {
        if (!codigoEmpleado || !codigoEquipo) {
            alert("Debes completar Código de Empleado y Código de Equipo");
            return;
        }

        const nuevaHoja = {
            FechaActualizacion: fechaActualizacion,
            CodigoEmpleado: codigoEmpleado,
            NombreEmpleado: empleado.nombre,
            Puesto: empleado.puesto,
            Departamento: empleado.departamento,

            FechaEquipo: equipo.fechaEquipo,
            CodigoEquipo: codigoEquipo,
            Equipo: equipo.equipo,
            Modelo: equipo.modelo,
            Serie: equipo.serie,
            Ubicacion: equipo.ubicacion,
            Marca: equipo.marca,

            JefeInmediato: jefeInmediato,
            MotivoActualizacion: motivoActualizacion,
            Comentarios: comentarios,
            Estado: estado,
            SolvenciaNo: solvenciaNo,
            fechaSolvencia: fechaSolvencia,
            observaciones: observaciones
        };


        try {
            const res = await HojasServices.crear(nuevaHoja);
            alert(`Hoja guardada ✅ Número de hoja: ${res.data.hojaNo}`);
        } catch (error) {
            if (error.response) {
                console.error("Error 400 Bad Request - detalles del backend:");
                console.log(JSON.stringify(error.response.data, null, 2));
                alert("Error al guardar hoja ❌ Revisa la consola para ver los errores de validación.");
            } else if (error.request) {
                console.error("Request hecho pero sin respuesta:", error.request);
            } else {
                console.error("Error configurando la solicitud:", error.message);
            }
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold text-center mb-6">
                Crear Hoja de Responsabilidad
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Código Empleado */}
                <div>
                    <label className="block font-semibold mb-1">Código de Empleado</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={codigoEmpleado}
                            onChange={e => setCodigoEmpleado(e.target.value)}
                            className="border px-3 py-2 rounded w-full"
                            placeholder="Ej. T01234"
                        />
                        <button
                            onClick={handleBuscarEmpleado}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Buscar
                        </button>
                    </div>
                    {empleado.nombre && (
                        <p className="mt-2 text-gray-700 text-sm">
                            {empleado.nombre} | {empleado.puesto} | {empleado.departamento}
                        </p>
                    )}
                </div>

                {/* Código Equipo */}
                <div>
                    <label className="block font-semibold mb-1">Código de Equipo</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={codigoEquipo}
                            onChange={e => setCodigoEquipo(e.target.value)}
                            className="border px-3 py-2 rounded w-full"
                            placeholder="Ej. EQP-1234"
                        />
                        <button
                            onClick={handleBuscarEquipo}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Buscar
                        </button>
                    </div>
                    {equipo.modelo && (
                        <p className="mt-2 text-gray-700 text-sm">
                            {equipo.marca} {equipo.modelo} | Serie: {equipo.serie} | Ubicación: {equipo.ubicacion} | Fecha ingreso: {equipo.fechaIngreso}
                        </p>
                    )}
                </div>

                {/* Fecha de Actualización */}
                <div>
                    <label className="block font-semibold mb-1">Fecha de Actualización</label>
                    <input
                        type="date"
                        value={fechaActualizacion}
                        onChange={e => setFechaActualizacion(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                    />
                </div>

                {/* Jefe Inmediato */}
                <div>
                    <label className="block font-semibold mb-1">Jefe Inmediato</label>
                    <input
                        type="text"
                        value={jefeInmediato}
                        onChange={e => setJefeInmediato(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                    />
                </div>

                {/* Motivo de actualización */}
                <div className="col-span-3">
                    <label className="block font-semibold mb-1">Motivo de actualización</label>
                    <textarea
                        value={motivoActualizacion}
                        onChange={e => setMotivoActualizacion(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                        rows={3}
                    />
                </div>
                {/* Comentarios */}
                <div className="col-span-3">
                    <label className="block font-semibold mb-1">Comentarios</label>
                    <textarea
                        value={comentarios}
                        onChange={e => setComentarios(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                        rows={2}
                    />
                </div>

                {/* Estado */}
                <div>
                    <label className="block font-semibold mb-1">Estado</label>
                    <select
                        value={estado}
                        onChange={e => setEstado(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                    >
                        <option value="">-- Selecciona un estado --</option>
                        <option value="Activa">Activa</option>
                        <option value="Inactiva">Inactiva</option>
                    </select>
                </div>

                {/* Solvencia No */}
                <div>
                    <label className="block font-semibold mb-1">Solvencia No.</label>
                    <input
                        type="text"
                        value={solvenciaNo}
                        onChange={e => setSolvenciaNo(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                    />
                </div>

                {/* Fecha Solvencia */}
                <div>
                    <label className="block font-semibold mb-1">Fecha Solvencia</label>
                    <input
                        type="date"
                        value={fechaSolvencia}
                        onChange={e => setFechaSolvencia(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                    />
                </div>

                {/* Observaciones */}
                <div className="col-span-3">
                    <label className="block font-semibold mb-1">Observaciones</label>
                    <textarea
                        value={observaciones}
                        onChange={e => setObservaciones(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                        rows={2}
                    />
                </div>
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={handleGuardarHoja}
                    className="bg-green-600 text-white px-6 py-3 rounded font-bold"
                >
                    Guardar Hoja
                </button>
            </div>
        </div>

    );
};

export default HojaResponsabilidad;
