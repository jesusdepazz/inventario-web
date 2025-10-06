import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EquiposServices from "../../services/EquiposServices";
import UbicacionesService from "../../services/UbicacionesServices";

const EditarEquipo = () => {
    const [id, setId] = useState("");
    const [equipo, setEquipo] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [ubicaciones, setUbicaciones] = useState([]);

    const navigate = useNavigate();

    const buscarEquipoPorId = async () => {
        try {
            const response = await EquiposServices.obtenerPorId(id);

            if (response.data) {
                setEquipo(response.data);
                if (response.data.imagenRuta)
                    setImagenPreview(`${import.meta.env.VITE_API_URL}/equipos/${response.data.imagenRuta}`);
                setModoEdicion(true);
            } else {
                toast.warn("Equipo no encontrado con ese ID");
            }
        } catch (error) {
            toast.error("Error al buscar equipo");
        }
    };

    useEffect(() => {
        const fetchUbicaciones = async () => {
            try {
                const response = await UbicacionesService.obtenerTodas();
                setUbicaciones(response.data);
            } catch (error) {
                toast.error("Error al cargar ubicaciones");
            }
        };

        if (modoEdicion) {
            fetchUbicaciones();
        }
    }, [modoEdicion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEquipo({ ...equipo, [name]: value });
    };

    const handleImagen = (e) => {
        const file = e.target.files[0];
        setNuevaImagen(file);
        setImagenPreview(URL.createObjectURL(file));
    };

    const guardarCambios = async () => {
        try {
            const formData = new FormData();
            formData.append("Tipo", equipo.tipo || "");
            formData.append("Codificacion", equipo.codificacion || "");
            formData.append("Estado", equipo.estado || "");
            formData.append("Marca", equipo.marca || "");
            formData.append("Modelo", equipo.modelo || "");
            formData.append("Serie", equipo.serie || "");
            formData.append("Imei", equipo.imei || "");
            formData.append("Especificaciones", equipo.especificaciones || "");
            formData.append("Accesorios", equipo.accesorios || "");
            formData.append("Ubicacion", equipo.ubicacion || "");
            formData.append("FechaIngreso", equipo.fechaIngreso ? equipo.fechaIngreso.slice(0, 10) : "");

            if (nuevaImagen) {
                formData.append("Imagen", nuevaImagen);
            }

            try {
                await EquiposServices.editar(equipo.id, formData);
                toast.success("Equipo actualizado correctamente");
            } catch (err) {
                console.error("Error al actualizar equipo:", err);

                if (err.response) {
                    console.error("Status:", err.response.status);
                    console.error("Headers:", err.response.headers);
                    console.error("Data:", err.response.data);

                    if (err.response.data && err.response.data.errors) {
                        console.group("Errores de validación");
                        for (const campo in err.response.data.errors) {
                            console.error(`${campo}:`, err.response.data.errors[campo]);
                        }
                        console.groupEnd();

                        const mensajes = Object.values(err.response.data.errors).flat().join("\n");
                        toast.error(`Errores de validación:\n${mensajes}`);
                    } else {
                        toast.error("Error al actualizar el equipo (sin detalles de validación)");
                    }
                } else {
                    toast.error("Error desconocido al actualizar el equipo");
                }
                return; 
            }

        } catch (error) {
            console.error("Error al guardar cambios:", error);
            toast.error("Error al guardar cambios");
        }
    };

    const volverABuscar = () => {
        setId("");
        setEquipo(null);
        setImagenPreview(null);
        setNuevaImagen(null);
        setModoEdicion(false);
    };

    return (
        <div className="flex justify-center px-4 py-10 min-h-scree">
            {!modoEdicion ? (
                <div className="flex flex-col justify-center items-center px-4 py-10 min-h-[50vh] overflow-y-auto">
                    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                buscarEquipoPorId();
                            }}
                            className="space-y-3"
                        >
                            <input
                                type="number"
                                placeholder="Ingrese ID del equipo"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                                >
                                    Buscar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                                >
                                    Atrás
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-6xl">
                    <form onSubmit={(e) => e.preventDefault()} encType="multipart/form-data" className="space-y-6 flex flex-col">
                        <section>
                            <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">Datos del equipo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    ["Tipo", "tipo"],
                                    ["Codificación", "codificacion"],
                                    ["Estado", "estado"],
                                    ["Marca", "marca"],
                                    ["Modelo", "modelo"],
                                    ["Serie", "serie"],
                                    ["IMEI", "imei"],
                                    ["Especificaciones", "especificaciones"],
                                    ["Accesorios", "accesorios"],
                                    ["Fecha Ingreso", "fechaIngreso"]
                                ].map(([label, name]) => (
                                    <div className="flex flex-col" key={name}>
                                        <label htmlFor={name} className="mb-1 font-medium text-gray-700">{label}</label>

                                        {name === "tipo" ? (
                                            <select
                                                id="tipo"
                                                name="tipo"
                                                value={equipo.tipo || ""}
                                                onChange={handleChange}
                                                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="">Seleccione un tipo</option>
                                                <option value="Equipo de escritorio">Equipo de escritorio</option>
                                                <option value="Comunal">Comunal</option>
                                                <option value="Equipo móvil">Equipo móvil</option>
                                            </select>
                                        ) : (
                                            <input
                                                type={name === "fechaIngreso" ? "date" : "text"}
                                                id={name}
                                                name={name}
                                                readOnly={["codificacion", "serie", "imei"].includes(name)}
                                                value={name === "fechaIngreso" && equipo[name] ? equipo[name].slice(0, 10) : equipo[name] || ""}
                                                onChange={handleChange}
                                                className={`border px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${["codificacion", "serie", "imei"].includes(name)
                                                    ? "bg-gray-100 cursor-not-allowed text-gray-500"
                                                    : "focus:ring-indigo-500"
                                                    }`}
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="flex flex-col">
                                    <label htmlFor="ubicacion" className="mb-1 font-medium text-gray-700">Ubicación</label>
                                    <select
                                        id="ubicacion"
                                        name="ubicacion"
                                        value={equipo.ubicacion || ""}
                                        onChange={handleChange}
                                        className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Seleccione una ubicación</option>
                                        {ubicaciones.map((u) => (
                                            <option key={u.id} value={u.nombre}>
                                                {u.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {equipo.tipo === "Equipo móvil" && (
                                    <>
                                        <div className="flex flex-col">
                                            <label htmlFor="numeroAsignado" className="mb-1 font-medium text-gray-700">Número asignado</label>
                                            <input
                                                type="text"
                                                id="numeroAsignado"
                                                name="numeroAsignado"
                                                value={equipo.numeroAsignado || ""}
                                                onChange={handleChange}
                                                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label htmlFor="extension" className="mb-1 font-medium text-gray-700">Extensión</label>
                                            <input
                                                type="text"
                                                id="extension"
                                                name="extension"
                                                value={equipo.extension || ""}
                                                onChange={handleChange}
                                                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex flex-col md:col-span-3">
                                    <label htmlFor="imagen" className="mb-1 font-medium text-gray-700">
                                        Imagen
                                    </label>
                                    <input
                                        type="file"
                                        id="imagen"
                                        name="imagen"
                                        accept="image/*"
                                        onChange={handleImagen}
                                        className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-center gap-4 mt-10">
                            <button
                                type="button"
                                onClick={guardarCambios}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
                            >
                                Guardar Cambios
                            </button>
                            <button
                                type="button"
                                onClick={volverABuscar}
                                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 font-semibold transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EditarEquipo;
