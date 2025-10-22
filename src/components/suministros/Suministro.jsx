import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SuministrosService from "../../services/SuministrosService";
import UbicacionesService from "../../services/UbicacionesServices";

const CrearSuministro = () => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    unidadMedida: "",
    stockInicial: 0,
    ubicacionId: "",
  });

  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    cargarUbicaciones();
  }, []);

  const cargarUbicaciones = async () => {
    try {
      const res = await UbicacionesService.obtenerTodas();
      setUbicaciones(res.data);
    } catch (err) {
      toast.error("Error al cargar ubicaciones");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await SuministrosService.crear(form);
      toast.success("Suministro creado correctamente");
      setForm({
        nombre: "",
        descripcion: "",
        categoria: "",
        unidadMedida: "",
        stockInicial: 0,
        ubicacionId: "",
      });
    } catch (err) {
      toast.error("Error al crear suministro");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
          Registrar nuevo suministro
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ej. Cable HDMI"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Categoría
            </label>
            <input
              type="text"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Ej. Cables, Energía..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Unidad de medida
            </label>
            <input
              type="text"
              name="unidadMedida"
              value={form.unidadMedida}
              onChange={handleChange}
              placeholder="Ej. unidades, metros..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Stock inicial
            </label>
            <input
              type="number"
              name="stockInicial"
              min={0}
              value={form.stockInicial}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Ubicación
            </label>
            <select
              name="ubicacionId"
              value={form.ubicacionId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Seleccione ubicación</option>
              {ubicaciones.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="3"
            placeholder="Detalles adicionales..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Crear Suministro
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearSuministro;
