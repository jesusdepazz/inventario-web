import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UbicacionesService from "../../services/UbicacionesServices";
import EquiposService from "../../services/EquiposServices";

const CrearEquipo = () => {
    const [form, setForm] = useState({
        orderCompra: "",
        factura: "",
        proveedor: "",
        fechaIngreso: "",
        hojaNo: "",
        fechaActualizacion: "",
        codificacion: "",
        tipoEquipo: "",
        marca: "",
        modelo: "",
        serie: "",
        numeroAsignado: "",
        extension: "",
        tipo: "",
        responsableAnterior: "",
        estado: "",
        ubicacion: "",
        comentarios: "",
        observaciones: "",
    });

    const [ubicaciones, setUbicaciones] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarUbicaciones = async () => {
            try {
                const res = await UbicacionesService.obtenerTodas();
                let lista = [];

                if (Array.isArray(res.data)) {
                    lista = res.data;
                } else if (Array.isArray(res.data?.$values)) {
                    lista = res.data.$values;
                }

                setUbicaciones(lista.map(u => u.nombre));
            } catch (error) {
                console.error("Error al cargar ubicaciones:", error);
            }
        };

        cargarUbicaciones();
    }, []);


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imagen") {
            setForm((prev) => ({ ...prev, imagen: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const camposObligatorios = [
            "tipo",
            "estado",
            "marca",
            "modelo",
            "ubicacion",
            "codificacion",
        ];

        for (const campo of camposObligatorios) {
            if (!form[campo]) {
                toast.warn(`El campo "${campo}" es obligatorio.`);
                return;
            }
        }

        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key] ?? "");
        }

        try {
            await EquiposService.crear(formData);

            toast.success("Equipo creado exitosamente");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error al crear el equipo:", error);
            if (error.response) {
                const data = error.response.data;
                if (data.errors) {
                    const mensajes = Object.values(data.errors).flat().join("\n");
                    toast.error(mensajes);
                } else if (data.title) {
                    toast.error(data.title);
                } else if (typeof data === "string") {
                    toast.error(data);
                } else {
                    toast.error("Error desconocido del servidor.");
                }
            } else {
                toast.error("No se pudo conectar con el servidor.");
            }
        }
    };

    return (
        <div className="flex justify-center items-start px-2 py-8">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-6xl">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-700 text-center">
                    Crear Equipo
                </h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">
                            DATOS DE COMPRA
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col">
                                <label
                                    htmlFor="orderCompra"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Orden de compra
                                </label>
                                <input
                                    type="text"
                                    id="orderCompra"
                                    name="orderCompra"
                                    value={form.orderCompra}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Orden de compra"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="factura"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Factura
                                </label>
                                <input
                                    type="text"
                                    id="factura"
                                    name="factura"
                                    value={form.factura}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Número de factura"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="proveedor"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Proveedor
                                </label>
                                <input
                                    type="text"
                                    id="proveedor"
                                    name="proveedor"
                                    value={form.proveedor}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Proveedor"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="fechaIngreso"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Fecha Ingreso <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="fechaIngreso"
                                    name="fechaIngreso"
                                    value={form.fechaIngreso}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">
                            DATOS DE USUARIO
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col">
                                <label
                                    htmlFor="hojaNo"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Hoja No.
                                </label>
                                <input
                                    type="text"
                                    id="hojaNo"
                                    name="hojaNo"
                                    value={form.hojaNo}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Hoja No."
                                />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="fechaActualizacion"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Fecha Actualización <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="fechaActualizacion"
                                    name="fechaActualizacion"
                                    value={form.fechaActualizacion}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">
                            DATOS DE EQUIPO
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col">
                                <label
                                    htmlFor="codificacion"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Codificación <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="codificacion"
                                    name="codificacion"
                                    value={form.codificacion}
                                    onChange={handleChange}
                                    placeholder="Codificación"
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label
                                    htmlFor="tipoEquipo"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Equipo
                                </label>
                                <input
                                    type="text"
                                    id="tipoEquipo"
                                    name="tipoEquipo"
                                    value={form.tipoEquipo}
                                    onChange={handleChange}
                                    placeholder="Equipo"
                                    className="input-field"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="marca" className="mb-1 font-medium text-gray-700">
                                    Marca <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="marca"
                                    name="marca"
                                    value={form.marca}
                                    onChange={handleChange}
                                    placeholder="Marca"
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="modelo" className="mb-1 font-medium text-gray-700">
                                    Modelo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="modelo"
                                    name="modelo"
                                    value={form.modelo}
                                    onChange={handleChange}
                                    placeholder="Modelo"
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="serie" className="mb-1 font-medium text-gray-700">
                                    Serie
                                </label>
                                <input
                                    type="text"
                                    id="serie"
                                    name="serie"
                                    value={form.serie}
                                    onChange={handleChange}
                                    placeholder="Serie"
                                    className="input-field"
                                />
                            </div>
                            {form.tipo === "Equipo móvil" && (
                                <>
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="numeroAsignado"
                                            className="mb-1 font-medium text-gray-700"
                                        >
                                            Número asignado
                                        </label>
                                        <input
                                            type="text"
                                            id="numeroAsignado"
                                            name="numeroAsignado"
                                            value={form.numeroAsignado}
                                            onChange={handleChange}
                                            placeholder="Número asignado"
                                            className="input-field"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="extension" className="mb-1 font-medium text-gray-700">
                                            Extensión
                                        </label>
                                        <input
                                            type="text"
                                            id="extension"
                                            name="extension"
                                            value={form.extension}
                                            onChange={handleChange}
                                            placeholder="Extensión"
                                            className="input-field"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex flex-col">
                                <label
                                    htmlFor="estado"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Estado <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="estado"
                                    name="estado"
                                    value={form.estado}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    <option value="">-- Seleccione estado --</option>
                                    <option value="Buen estado" className="text-green-500">Buen estado</option>
                                    <option value="Inactivo" className="text-yellow-500">Reparacion</option>
                                    <option value="Obsoleto" className="text-red-500">Obsoleto</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="tipo" className="mb-1 font-medium text-gray-700">
                                    Tipo <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="tipo"
                                    name="tipo"
                                    value={form.tipo}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    <option value="">-- Seleccione tipo --</option>
                                    <option value="Equipo móvil" >Equipo móvil</option>
                                    <option value="Equipo de escritorio">Equipo de escritorio</option>
                                    <option value="Equipo comunal">Equipo comunal</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="responsableAnterior" className="mb-1 font-medium text-gray-700">
                                    Responsable Anterior
                                </label>
                                <input
                                    type="text"
                                    id="responsableAnterior"
                                    name="responsableAnterior"
                                    value={form.responsableAnterior}
                                    onChange={handleChange}
                                    placeholder="Responsable Anterior"
                                    className="input-field"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="ubicacion" className="mb-1 font-medium text-gray-700">
                                    Ubicación <span className="text-red-500">*</span>
                                </label>
                                <input
                                    list="ubicaciones-list"
                                    id="ubicacion"
                                    name="ubicacion"
                                    value={form.ubicacion}
                                    onChange={handleChange}
                                    placeholder="Ubicación"
                                    required
                                    className="input-field"
                                />
                                <datalist id="ubicaciones-list">
                                    {ubicaciones.map((u, i) => (
                                        <option key={i} value={u} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="comentarios"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Comentarios
                                </label>
                                <input
                                    type="text"
                                    id="comentarios"
                                    name="comentarios"
                                    value={form.comentarios}
                                    onChange={handleChange}
                                    placeholder="Comentarios"
                                    className="input-field"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="observaciones"
                                    className="mb-1 font-medium text-gray-700"
                                >
                                    Observaciones
                                </label>
                                <input
                                    type="text"
                                    id="observaciones"
                                    name="observaciones"
                                    value={form.observaciones}
                                    onChange={handleChange}
                                    placeholder="Observaciones"
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </section>
                    <div className="flex justify-end gap-4">
                        <button
                             type="submit"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold transition"
                        >
                            Crear Equipo
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 font-semibold transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearEquipo;