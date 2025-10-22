import React, { useEffect, useState } from "react";
import SuministrosService from "../../services/SuministrosService";
import { toast } from "react-toastify";

export default function InventarioSuministros() {
  const [suministros, setSuministros] = useState([]);

  const cargarSuministros = async () => {
    try {
      const res = await SuministrosService.obtenerTodos();
      setSuministros(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar los suministros");
    }
  };

  useEffect(() => {
    cargarSuministros();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Inventario de Suministros</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">Unidad de Medida</th>
              <th className="px-4 py-2 border">Stock Total</th>
              <th className="px-4 py-2 border">Activo</th>
            </tr>
          </thead>
          <tbody>
            {suministros.length > 0 ? (
              suministros.map((s) => (
                <tr key={s.id} className="text-center">
                  <td className="px-4 py-2 border">{s.id}</td>
                  <td className="px-4 py-2 border">{s.nombre}</td>
                  <td className="px-4 py-2 border">{s.descripcion ?? "-"}</td>
                  <td className="px-4 py-2 border">{s.unidadMedida}</td>
                  <td className="px-4 py-2 border">{s.stockTotal}</td>
                  <td className={`px-4 py-2 border font-bold ${s.activo ? "text-green-600" : "text-red-600"}`}>
                    {s.activo ? "Sí" : "No"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-600">
                  No hay suministros registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
