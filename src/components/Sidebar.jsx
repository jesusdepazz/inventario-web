import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FaHome,
    FaLaptop,
    FaClipboardList,
    FaSignOutAlt,
    FaChevronDown,
    FaChevronUp,
    FaUpload,
    FaEdit,
    FaTrash,
    FaUserCheck,
    FaTools,
} from "react-icons/fa";

export default function Sidebar() {
    const navigate = useNavigate();
    const [equiposOpen, setEquiposOpen] = useState(false);
    const [asignacionesOpen, setAsignacionesOpen] = useState(false);
    const [mantenimientosOpen, setMantenimientosOpen] = useState(false);
    const [formatosOpen, setFormatosOpen] = useState(false);
    const [modalHojaOpen, setModalHojaOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    };

    const openHojaModal = () => setModalHojaOpen(true);
    const closeHojaModal = () => setModalHojaOpen(false);

    const handleHojaOption = (path) => {
        navigate(path);
        closeHojaModal();
    };

    return (
        <div className="bg-gradient-azure text-white w-80 h-screen p-6 fixed flex flex-col justify-between shadow-lg rounded-r-xl">
            <div>
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-extrabold tracking-wide">INVENTARIO</h2>
                    <hr className="border-indigo-400 my-4" />
                </div>
                <nav className="flex flex-col gap-4">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 font-bold text-lg hover:text-blue-300 transition-transform duration-300 ease-in-out hover:translate-x-2"
                    >
                        <FaHome /> Inicio
                    </Link>
                    <div>
                        <button
                            onClick={() => setEquiposOpen(!equiposOpen)}
                            className="flex items-center justify-between w-full font-bold text-lg hover:text-blue-300 transition-transform duration-300 ease-in-out"
                        >
                            <span className="flex items-center gap-3">
                                <FaLaptop /> Equipos
                            </span>
                            {equiposOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                        </button>
                        {equiposOpen && (
                            <div className="ml-8 flex flex-col gap-1 text-base font-medium pt-1">
                                <Link to="/equipos/inventario" className="flex items-center gap-3">
                                    <FaClipboardList /> Inventario
                                </Link>
                                <Link to="/equipos/crear" className="flex items-center gap-3">
                                    <FaUpload /> Ingresar
                                </Link>
                                <Link to="/equipos/editar" className="flex items-center gap-3">
                                    <FaEdit /> Editar
                                </Link>
                                <Link to="/equipos/eliminar" className="flex items-center gap-3">
                                    <FaTrash /> Eliminar
                                </Link>
                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={() => setAsignacionesOpen(!asignacionesOpen)}
                            className="flex items-center justify-between w-full font-bold text-lg hover:text-blue-300 transition-transform duration-300 ease-in-out"
                        >
                            <span className="flex items-center gap-3">
                                <FaUserCheck /> Asignaciones
                            </span>
                            {asignacionesOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                        </button>
                        {asignacionesOpen && (
                            <div className="ml-8 flex flex-col gap-1 text-base font-medium pt-1">
                                <Link to="/asignaciones/crear" className="flex items-center gap-3">
                                    <FaUpload /> Asignar
                                </Link>
                                <Link to="/asignaciones/lista" className="flex items-center gap-3">
                                    <FaClipboardList /> Historial
                                </Link>
                                <Link to="/asignaciones/eliminar" className="flex items-center gap-3">
                                    <FaTrash /> Desasignar
                                </Link>
                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={() => setMantenimientosOpen(!mantenimientosOpen)}
                            className="flex items-center justify-between w-full font-bold text-lg hover:text-blue-300 transition-transform duration-300 ease-in-out"
                        >
                            <span className="flex items-center gap-3">
                                <FaClipboardList />
                                Solicitudes
                            </span>
                            {mantenimientosOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                        </button>
                        {mantenimientosOpen && (
                            <div className="ml-8 flex flex-col gap-1 text-base font-medium pt-1">
                                <Link to="/solicitudes/crear" className="flex items-center gap-3">
                                    <FaUpload /> Crear
                                </Link>
                                <Link to="/solicitudes/lista" className="flex items-center gap-3">
                                    <FaClipboardList /> Historial
                                </Link>
                                <Link to="/solicitudes/eliminar" className="flex items-center gap-3">
                                    <FaTrash /> Eliminar
                                </Link>
                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={() => setFormatosOpen(!formatosOpen)}
                            className="flex items-center justify-between w-full font-bold text-lg hover:text-blue-300 transition-transform duration-300 ease-in-out"
                        >
                            <span className="flex items-center gap-3">
                                <FaClipboardList />
                                Formatos
                            </span>
                            {formatosOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                        </button>
                        {formatosOpen && (
                            <div className="ml-8 flex flex-col gap-1 text-base font-medium pt-1">
                                <button
                                    onClick={openHojaModal}
                                    className="flex items-center gap-3 hover:text-blue-300 transition-colors duration-300"
                                >
                                    <FaUpload /> Hoja de responsabilidad
                                </button>
                                <Link to="/formatos/hojaSalidaRetorno" className="flex items-center gap-3">
                                    <FaUpload /> Pase de salida con retorno
                                </Link>
                                <Link to="/formatos/bajaAtivos" className="flex items-center gap-3">
                                    <FaUpload /> Bajas
                                </Link>
                                <Link to="/formatos/listahojasSolvencias" className="flex items-center gap-3">
                                    <FaUpload /> Solvencias
                                </Link>
                                <Link to="/formatos/hojaderesponsabilidad" className="flex items-center gap-3">
                                    <FaUpload /> Traslado
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            <div>
                <hr className="border-indigo-400 my-4" />
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 font-bold text-lg hover:text-red-400 transition-colors duration-300"
                >
                    <FaSignOutAlt /> Cerrar sesión
                </button>
            </div>

            {modalHojaOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h2 className="text-lg font-bold mb-4 text-black text-center">Selecciona una opción</h2>
                        <button
                            onClick={() => handleHojaOption("/formatos/hojaderesponsabilidad")}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-600"
                        >
                            Crear
                        </button>
                        <button
                            onClick={() => handleHojaOption("/formatos/listahojasresponsabilidad")}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-600"
                        >
                            Ver Historial
                        </button>
                        <button
                            onClick={closeHojaModal}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
