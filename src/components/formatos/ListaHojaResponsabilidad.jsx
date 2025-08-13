const ListaHojasResponsabilidad = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-6 max-w-full mx-auto">
                <div className="text-center mb-4">
                    <p className="font-bold text-lg">Guatemalan Candies, S.A.</p>
                    <p className="font-bold text-lg text-blue-500">Listado de hojas de responsabilidad - Equipo de cómputo</p>
                    <p className="font-bold text-lg">Administración de Activos Fijos / Depto de contabilidad</p>
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
                    <table className="min-w-[1000px] text-xs text-left border border-gray-200">
                        <thead>
                            <tr className="text-center bg-blue-800 text-white">
                                <th className="px-4 py-2 border whitespace-nowrap">No. de Hoja</th>
                                <th className="px-4 py-2 border whitespace-nowrap">Fecha de actualizacion de Hoja</th>
                                <th className="px-4 py-2 border whitespace-nowrap">Codigo de Usuario</th>
                                <th className="px-4 py-2 border whitespace-nowrap">Responsable</th>
                                <th className="px-4 py-2 border whitespace-nowrap">Puesto</th>
                                <th className="px-4 py-2 border whitespace-nowrap">Departamento</th>
                                <th className="px-4 py-2 border whitespace-nowrap">Jefe Inmediato</th>
                                <th className="px-4 py-2 border whitespace-nowrap">Ubicacion del equipo</th>
                                <th className="px-4 py-2 border whitespace-nowrap">Solvencia No.</th>
                                <th className="px-4 py-2 border whitespace-nowrap">Fecha de Solvencia</th>
                                <th className="px-4 py-2 border whitespace-nowrap">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td className="px-4 py-2 border whitespace-nowrap"></td>
                                <td className="px-4 py-2 border whitespace-nowrap"></td>
                                <td className="px-4 py-2 border whitespace-nowrap"></td>
                                <td className="px-4 py-2 border whitespace-nowrap"></td>
                                <td className="px-4 py-2 border whitespace-nowrap"></td>
                                <td className="px-4 py-2 border whitespace-nowrap"></td>
                                <td className="px-4 py-2 border whitespace-nowrap text-red-600"></td>
                                <td className="px-4 py-2 border whitespace-nowrap"></td>
                                <td className="px-4 py-2 border whitespace-nowrap font-bold text-blue-800"></td>
                                <td className="px-4 py-2 border whitespace-nowrap"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListaHojasResponsabilidad;