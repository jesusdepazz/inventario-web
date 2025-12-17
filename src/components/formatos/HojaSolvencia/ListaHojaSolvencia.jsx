import { useEffect, useState } from "react";
import SolvenciasService from "../../../services/HojasSolvencias";
import { PDFDownloadLink } from "@react-pdf/renderer";
import HojaSolvenciaPDF from "./HojaSolvenciaPDF";

export default function ListaHojaSolvencia() {
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await SolvenciasService.listarHistorico();
                setHistorico(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-6">
                <div className="text-center mb-4">
                    <p className="font-bold text-lg">Guatemalan Candies, S.A.</p>
                    <p className="font-bold text-lg text-blue-500">Listado de Solvencias - Equipo de cómputo</p>
                    <p className="font-bold text-lg">
                        {new Date().toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </p>
                </div>
                <div className="overflow-x-auto">
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
                                <th className="p-3 font-semibold">Jefe inmediato</th>
                                <th className="p-3 font-semibold">Observaciones</th>
                                <th className="p-3 font-semibold">Acciones</th>
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
                                        className={`transition-colors duration-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
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
                                        <td className="border p-2">
                                            {h.JefeInmediato}
                                        </td>
                                        <td className="border p-2">{h.observaciones}</td>
                                        <td className="border p-2">
                                            <PDFDownloadLink
                                                document={<HojaSolvenciaPDF data={h} />}
                                                fileName={`HojaSolvencia-${h.id}.pdf`}
                                            >
                                                {({ loading }) => loading ? "Generando..." : "Descargar PDF"}
                                            </PDFDownloadLink>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
