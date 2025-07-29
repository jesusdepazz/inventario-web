import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CrearMantenimiento = () => {
    const [form, setForm] = useState({
        codificacion: "",
        modelo: "",
        tipoMantenimiento: "",
        realizadoPor: "",
        motivo: ""
    });

    const [modelos, setModelos] = useState([]);
    const [equiposPorCodigo, setEquiposPorCodigo] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleBuscarEquipo = async () => {
        try {
            const res = await axios.get("https://inveq.guandy.com/api/Equipos", {
                withCredentials: true
            });
            const encontrados = res.data.filter((e) => e.codificacion === form.codificacion);

            if (encontrados.length > 0) {
                const modelosUnicos = [...new Set(encontrados.map((e) => e.modelo))];
                setEquiposPorCodigo(encontrados);
                setModelos(modelosUnicos);
                setForm((prev) => ({
                    ...prev,
                    modelo: ""
                }));
                toast.success(`✅ Se encontraron ${encontrados.length} equipos con esa codificación`);
            } else {
                setModelos([]);
                setEquiposPorCodigo([]);
                toast.warn("⚠️ No se encontró ningún equipo con esa codificación");
            }
        } catch (error) {
            console.error("Error al buscar equipo:", error);
            toast.error("❌ Error al buscar el equipo");
        }
    };

    const handleModeloSeleccionado = (e) => {
        const modeloSeleccionado = e.target.value;
        setForm((prev) => ({
            ...prev,
            modelo: modeloSeleccionado
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.codificacion || !form.modelo || !form.tipoMantenimiento || !form.realizadoPor ||  !form.motivo) {
            toast.warn("⚠️ Completa los campos requeridos");
            return;
        }

        try {
            await axios.post("https://inveq.guandy.com/api/Mantenimientos", form, {
                withCredentials: true
            });

            toast.success("✅ Mantenimiento registrado correctamente");
            navigate("/mantenimientosDashboard");
        } catch (error) {
            console.error("Error al crear mantenimiento:", error);
            toast.error("❌ Error al crear mantenimiento");
        }
    };

    return (
        <div className="flex justify-center px-4 py-10 overflow-y-auto">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <h2 className="text-2xl font-semibold text-indigo-700 text-center mb-4">
                        Crear Mantenimiento
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="codificacion" className="block text-gray-700 font-medium mb-2">
                                Codificación del equipo
                            </label>
                            <input
                                name="codificacion"
                                id="codificacion"
                                value={form.codificacion}
                                onChange={handleChange}
                                onBlur={handleBuscarEquipo}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-400"
                                placeholder="Codificación del equipo"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="modelo" className="block text-gray-700 font-medium mb-2">
                                Modelo
                            </label>
                            <select
                                name="modelo"
                                id="modelo"
                                value={form.modelo}
                                onChange={handleModeloSeleccionado}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-400"
                                required
                            >
                                <option value="">-- Seleccione un modelo --</option>
                                {modelos.map((modelo, i) => (
                                    <option key={i} value={modelo}>{modelo}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tipoMantenimiento" className="block text-gray-700 font-medium mb-2">
                                Tipo de mantenimiento
                            </label>
                            <input
                                name="tipoMantenimiento"
                                id="tipoMantenimiento"
                                value={form.tipoMantenimiento}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-400"
                                placeholder="Ej. Preventivo, Correctivo"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="realizadoPor" className="block text-gray-700 font-medium mb-2">
                                Realizado por
                            </label>
                            <input
                                name="realizadoPor"
                                id="realizadoPor"
                                value={form.realizadoPor}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-400"
                                placeholder="Nombre del técnico o proveedor"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="realizadoPor" className="block text-gray-700 font-medium mb-2">
                                Motivo de mantenimiento
                            </label>
                            <input
                                name="motivo"
                                id="motivo"
                                value={form.motivo}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-400"
                                placeholder="Decripcion de mantenimiento"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 pt-6">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 font-semibold text-sm transition"
                        >
                            Crear
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/mantenimientosDashboard")}
                            className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 font-semibold text-sm transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearMantenimiento;
