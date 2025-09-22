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
            <div className="overflow-x-auto w-full bg-white shadow-lg rounded-xl">
                <table className="min-w-[2000px] w-full text-sm text-left border border-gray-200 rounded-xl">
                    <thead className="bg-blue-800 text-white">
                        <tr>
                            <th className="p-3 font-semibold">Solvencia No.</th>
                            <th className="p-3 font-semibold">Fecha</th>
                            <th className="p-3 font-semibold">Código</th>
                            <th className="p-3 font-semibold">Nombre</th>
                            <th className="p-3 font-semibold">Puesto</th>
                            <th className="p-3 font-semibold">Departamento</th>
                            <th className="p-3 font-semibold">Ubicación</th>
                            <th className="p-3 font-semibold">Hoja No.</th>
                            <th className="p-3 font-semibold">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historico.map((h, i) => {
                            const primerEmpleado = h.empleados?.split(",")[0] || "";
                            const [codigo, nombre, puesto, depto] = primerEmpleado.split(" - ");
                            const primerEquipo = h.equiposObj?.[0];
                            const ubicacion = primerEquipo?.ubicacion || "";

                            return (
                                <tr
                                    key={i}
                                    className={`transition-colors duration-200 ${
                                        i % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    } hover:bg-blue-50`}
                                >
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
