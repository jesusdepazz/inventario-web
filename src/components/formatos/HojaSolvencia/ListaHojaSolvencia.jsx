import { useEffect, useState } from "react";
import axios from "axios";

export default function ListaHojaSolvencia() {
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        axios
            .get("https://localhost:7291/api/HojaSolvencias/historico")
            .then((res) => setHistorico(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Histórico de Solvencias</h2>
            <div className="overflow-x-auto w-full bg-white shadow-lg rounded-xl p-4">
                <table className="min-w-[2000px] w-full text-sm text-left border border-gray-200 rounded-xl">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="border p-3 text-gray-700 font-medium">Solvencia No.</th>
                            <th className="border p-3 text-gray-700 font-medium">Fecha</th>
                            <th className="border p-3 text-gray-700 font-medium">Código</th>
                            <th className="border p-3 text-gray-700 font-medium">Nombre</th>
                            <th className="border p-3 text-gray-700 font-medium">Puesto</th>
                            <th className="border p-3 text-gray-700 font-medium">Departamento</th>
                            <th className="border p-3 text-gray-700 font-medium">Ubicación</th>
                            <th className="border p-3 text-gray-700 font-medium">Hoja No.</th>
                            <th className="border p-3 text-gray-700 font-medium">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historico.map((h, i) => {
                            const primerEmpleado = h.empleados?.split(",")[0] || "";
                            const [codigo, nombre, puesto, depto] = primerEmpleado.split(" - ");

                            const primerEquipo = h.equiposObj?.[0]; 
                            const ubicacion = primerEquipo?.ubicacion || "";

                            return (
                                <tr key={i} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="border p-2">{h.solvenciaNo}</td>
                                    <td className="border p-2">{new Date(h.fechaSolvencia).toLocaleDateString()}</td>
                                    <td className="border p-2">{codigo}</td>
                                    <td className="border p-2">{nombre}</td>
                                    <td className="border p-2">{puesto}</td>
                                    <td className="border p-2">{depto}</td>
                                    <td className="border p-2">{ubicacion}</td>
                                    <td className="border p-2">{h.hojaNo}</td>
                                    <td className="border p-2">{h.observaciones}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
