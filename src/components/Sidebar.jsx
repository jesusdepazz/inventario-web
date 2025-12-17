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
    FaBoxOpen,
    FaPlus,
    FaExchangeAlt,
    FaHistory
} from "react-icons/fa";


export default function Sidebar() {
    const navigate = useNavigate();
    const [equiposOpen, setEquiposOpen] = useState(false);
    const [asignacionesOpen, setAsignacionesOpen] = useState(false);
    const [mantenimientosOpen, setMantenimientosOpen] = useState(false);
    const [formatosOpen, setFormatosOpen] = useState(false);
    const [modalHojaOpen, setModalHojaOpen] = useState(false);
    const [modalSolvenciaOpen, setModalSolvenciaOpen] = useState(false);
    const [modalTrasladoOpen, setModalTrasladoOpen] = useState(false);
    const [suministrosOpen, setSuministrosOpen] = useState(false);
    const [modalBajasActivoOpen, setModalBajasActivoOpen] = useState(false);
    const [modalTrasladoRetornoOpen, setModalTrasladoRetornoOpen] = useState(false);


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
    const openSolvenciaModal = () => setModalSolvenciaOpen(true);
    const closeSolvenciaModal = () => setModalSolvenciaOpen(false);
    const handleSolvenciaOption = (path) => {
        navigate(path);
        closeSolvenciaModal();
    };
    const openTrasladoModal = () => setModalTrasladoOpen(true);
    const closeTrasladoModal = () => setModalTrasladoOpen(false);
    const handleTrasladoOption = (path) => {
        navigate(path);
        closeTrasladoModal();
    };

    const openBajasActivoModal = () => setModalBajasActivoOpen(true);
    const closeBajasActivoModal = () => setModalBajasActivoOpen(false);
    const handleBajasActivoOption = (path) => {
        navigate(path);
        closeBajasActivoModal();
    };

    const handleTrasladoRetornoOption = (ruta) => {
        setModalTrasladoRetornoOpen(false);
        navigate(ruta);
    };

    const closeTrasladoRetornoModal = () => setModalTrasladoRetornoOpen(false);

    return (
        <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white w-80 h-screen p-6 fixed flex flex-col justify-between shadow-2xl rounded-r-2xl">
            <div>
                <div className="flex flex-col items-center mb-10">
                    <img src="/logo_guandy.png" alt="Logo Guandy" className="h-16 mb-3" />
                    <h2 className="text-xl font-extrabold tracking-wider">INVENTARIO</h2>
                    <hr className="border-blue-400 w-3/4 mt-4" />
                </div>

                <nav className="flex flex-col gap-3">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 font-semibold text-lg px-3 py-2 rounded-lg hover:bg-white/10 hover:translate-x-2 transition-all duration-300"
                    >
                        <FaHome /> Inicio
                    </Link>
                    <div>
                        <button
                            onClick={() => setEquiposOpen(!equiposOpen)}
                            className="flex items-center justify-between w-full font-semibold text-lg px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                        >
                            <span className="flex items-center gap-3">
                                <FaLaptop /> Equipos
                            </span>
                            {equiposOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <div
                            className={`ml-6 mt-1 flex flex-col gap-2 overflow-hidden transition-all duration-500 ${equiposOpen ? "max-h-40" : "max-h-0"}`}
                        >
                            <Link to="/equipos/inventario" className="flex items-center gap-2 hover:text-blue-300">
                                <FaClipboardList /> Inventario
                            </Link>
                            <Link to="/equipos/crear" className="flex items-center gap-2 hover:text-blue-300">
                                <FaUpload /> Ingresar
                            </Link>
                            <Link to="/equipos/editar" className="flex items-center gap-2 hover:text-blue-300">
                                <FaEdit /> Editar
                            </Link>
                            <Link to="/equipos/eliminar" className="flex items-center gap-2 hover:text-blue-300">
                                <FaTrash /> Eliminar
                            </Link>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={() => setSuministrosOpen(!suministrosOpen)}
                            className="flex items-center justify-between w-full font-semibold text-lg px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                        >
                            <span className="flex items-center gap-3">
                                <FaBoxOpen /> Suministros
                            </span>
                            {suministrosOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>

                        <div
                            className={`ml-6 mt-1 flex flex-col gap-2 overflow-hidden transition-all duration-500 ${suministrosOpen ? "max-h-48" : "max-h-0"}`}
                        >
                            <Link
                                to="/suministros"
                                className="flex items-center gap-2 hover:text-blue-300"
                            >
                                <FaPlus /> Crear Suministro
                            </Link>
                            <Link
                                to="/suministros/inventario"
                                className="flex items-center gap-2 hover:text-blue-300"
                            >
                                <FaClipboardList /> Inventario de suministros
                            </Link>
                            <Link
                                to="/suministros/movimientos"
                                className="flex items-center gap-2 hover:text-blue-300"
                            >
                                <FaUpload /> Movimientos de suministros
                            </Link>
                            <Link to="/suministros/eliminarMovimientos"
                                className="flex items-center gap-2 hover:text-blue-300">
                                <FaTrash /> Eliminar Movimientos
                            </Link>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={() => setAsignacionesOpen(!asignacionesOpen)}
                            className="flex items-center justify-between w-full font-semibold text-lg px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                        >
                            <span className="flex items-center gap-3">
                                <FaUserCheck /> Asignaciones
                            </span>
                            {asignacionesOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <div
                            className={`ml-6 mt-1 flex flex-col gap-2 overflow-hidden transition-all duration-500 ${asignacionesOpen ? "max-h-32" : "max-h-0"}`}
                        >
                            <Link to="/asignaciones/crear" className="flex items-center gap-2 hover:text-blue-300">
                                <FaUpload /> Asignar
                            </Link>
                            <Link to="/asignaciones/lista" className="flex items-center gap-2 hover:text-blue-300">
                                <FaClipboardList /> Historial
                            </Link>
                            <Link to="/asignaciones/eliminar" className="flex items-center gap-2 hover:text-blue-300">
                                <FaTrash /> Desasignar
                            </Link>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={() => setMantenimientosOpen(!mantenimientosOpen)}
                            className="flex items-center justify-between w-full font-semibold text-lg px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                        >
                            <span className="flex items-center gap-3">
                                <FaClipboardList /> Solicitudes
                            </span>
                            {mantenimientosOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <div
                            className={`ml-6 mt-1 flex flex-col gap-2 overflow-hidden transition-all duration-500 ${mantenimientosOpen ? "max-h-32" : "max-h-0"}`}
                        >
                            <Link to="/solicitudes/crear" className="flex items-center gap-2 hover:text-blue-300">
                                <FaUpload /> Crear
                            </Link>
                            <Link to="/solicitudes/lista" className="flex items-center gap-2 hover:text-blue-300">
                                <FaClipboardList /> Historial
                            </Link>
                            <Link to="/solicitudes/eliminar" className="flex items-center gap-2 hover:text-blue-300">
                                <FaTrash /> Eliminar
                            </Link>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={() => setFormatosOpen(!formatosOpen)}
                            className="flex items-center justify-between w-full font-semibold text-lg px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                        >
                            <span className="flex items-center gap-3">
                                <FaClipboardList /> Formatos
                            </span>
                            {formatosOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <div
                            className={`ml-6 mt-1 flex flex-col gap-2 overflow-hidden transition-all duration-500 ${formatosOpen ? "max-h-64" : "max-h-0"}`}
                        >
                            <button onClick={openHojaModal} className="flex items-center gap-2 hover:text-blue-300">
                                <FaUpload /> Hoja de responsabilidad
                            </button>
                            <button onClick={openSolvenciaModal} className="flex items-center gap-2 hover:text-blue-300">
                                <FaUpload /> Solvencias
                            </button>
                            <button
                                onClick={() => setModalTrasladoRetornoOpen(true)}
                                className="flex items-center gap-2 hover:text-blue-300 w-full text-left"
                            >
                                <FaUpload /> Pase de salida con retorno
                            </button>
                            <button onClick={openBajasActivoModal} className="flex items-center gap-2 hover:text-blue-300">
                                <FaUpload /> Bajas
                            </button>
                            <button onClick={openTrasladoModal} className="flex items-center gap-2 hover:text-blue-300">
                                <FaUpload /> Traslados
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
            <div>
                <hr className="border-blue-400 my-4" />
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 font-bold text-lg px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors w-full justify-center"
                >
                    <FaSignOutAlt /> Cerrar sesión
                </button>
            </div>

            {modalHojaOpen && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-96">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 text-center"> Selecciona una opción </h2>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => handleHojaOption("/formatos/hojaderesponsabilidad")} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700" > Crear </button>
                        <button onClick={() => handleHojaOption("/formatos/listahojasresponsabilidad")} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700" > Ver Historial </button>
                        <button onClick={closeHojaModal} className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500" > Cancelar </button>
                    </div>
                </div>
            </div>)}
            {modalSolvenciaOpen && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-96">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 text-center"> Solvencias </h2>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => handleSolvenciaOption("/formatos/hojasSolvencias")}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        > Crear
                        </button>
                        <button onClick={() => handleSolvenciaOption("/formatos/listahojasSolvencias")}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        > Ver Historial
                        </button>
                        <button onClick={closeSolvenciaModal}
                            className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                        > Cancelar
                        </button>
                    </div>
                </div>
            </div>)}
            {modalTrasladoOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-96">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
                            Traslados
                        </h2>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleTrasladoOption("/formatos/traslados/crear")}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Crear
                            </button>
                            <button
                                onClick={() => handleTrasladoOption("/formatos/traslados/lista")}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Ver Historial
                            </button>
                            <button
                                onClick={closeTrasladoModal}
                                className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {modalBajasActivoOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-96">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 text-center"> Bajas de Activos </h2>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleBajasActivoOption("/formatos/bajaAtivos")}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Crear Baja
                            </button>
                            <button
                                onClick={() => handleBajasActivoOption("/formatos/ListabajaAtivos")}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Ver Historial
                            </button>
                            <button
                                onClick={closeBajasActivoModal}
                                className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {modalTrasladoRetornoOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 animate-fadeIn">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
                            Selecciona una opción
                        </h2>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() =>
                                    handleTrasladoRetornoOption("/formatos/trasladosRetorno/crear")
                                }
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Crear Traslado Retorno
                            </button>

                            <button
                                onClick={() =>
                                    handleTrasladoRetornoOption("/formatos/trasladosRetorno/lista")
                                }
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Ver Historial
                            </button>

                            <button
                                onClick={closeTrasladoRetornoModal}
                                className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
