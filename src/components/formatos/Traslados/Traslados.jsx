import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrasladosServices from "../../../services/TrasladosServices";
import UbicacionesService from "../../../services/UbicacionesServices";

export default function CrearTraslado() {
    const navigate = useNavigate();

    const [ubicaciones, setUbicaciones] = useState([]);
    const [form, setForm] = useState({
        No: "",
        FechaEmision: "",
        Solicitante: "",
        DescripcionEquipo: "",
        Motivo: "",
        UbicacionDesde: "",
        UbicacionHasta: "",
        Status: "Pendiente",
        FechaLiquidacion: "",
        Razon: ""
    });

    useEffect(() => {
        const fetchUbicaciones = async () => {
            try {
                const res = await UbicacionesService.obtenerTodas();
                setUbicaciones(res.data);
            } catch (err) {
                console.error("Error cargando ubicaciones:", err);
            }
        };
        fetchUbicaciones();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...form,
                FechaEmision: form.FechaEmision ? new Date(form.FechaEmision).toISOString() : null,
                FechaLiquidacion: form.FechaLiquidacion ? new Date(form.FechaLiquidacion).toISOString() : null
            };

            await TrasladosServices.crear(payload);

            alert("Traslado creado correctamente ✅");

            setForm({
                No: "",
                FechaEmision: "",
                Solicitante: "",
                DescripcionEquipo: "",
                Motivo: "",
                UbicacionDesde: "",
                UbicacionHasta: "",
                Status: "Pendiente",
                FechaLiquidacion: "",
                Razon: ""
            });

        } catch (err) {
            console.error("Error creando traslado:", err);
            alert("Error creando traslado ❌");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center px-4 py-8">
            <div className="bg-white w-full max-w-6xl p-6 rounded-xl shadow-lg overflow-auto max-h-[90vh]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">Datos Generales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Número</label>
                                <input
                                    type="text"
                                    name="No"
                                    value={form.No}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Fecha Emisión</label>
                                <input
                                    type="date"
                                    name="FechaEmision"
                                    value={form.FechaEmision}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Solicitante</label>
                                <input
                                    type="text"
                                    name="Solicitante"
                                    value={form.Solicitante}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2"
                                    required
                                />
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">Detalles del Equipo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Equipo</label>
                                <input
                                    type="text"
                                    name="DescripcionEquipo"
                                    value={form.DescripcionEquipo}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Motivo</label>
                                <textarea
                                    name="Motivo"
                                    value={form.Motivo}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 resize-none"
                                    rows={2}
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Razón</label>
                                <textarea
                                    name="Razon"
                                    value={form.Razon}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 resize-none"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2">Ubicaciones</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Ubicación Desde</label>
                                <select
                                    name="UbicacionDesde"
                                    value={form.UbicacionDesde}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2"
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    {ubicaciones.map((u) => (
                                        <option key={u.id} value={u.nombre}>{u.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 font-medium text-gray-700">Ubicación Hasta</label>
                                <select
                                    name="UbicacionHasta"
                                    value={form.UbicacionHasta}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2"
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    {ubicaciones.map((u) => (
                                        <option key={u.id} value={u.nombre}>{u.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>
                    <div className="flex justify-center gap-4 pt-6">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold"
                        >
                            Crear Traslado
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/trasladosDashboard")}
                            className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 text-sm font-semibold"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
