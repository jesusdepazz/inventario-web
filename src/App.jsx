import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useIsAuthenticated } from "@azure/msal-react";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Login from "./components/Login";
import CrearEquipo from "./components/equipos/Crearquipos";
import ListaEquipos from "./components/equipos/ListaEquipos";
import EditarEquipo from "./components/equipos/EditarEquipos";
import EliminarEquipos from "./components/equipos/EliminarEquipos";
import CrearAsignacion from "./components/asignaciones/CrearAsignacion";
import CrearMantenimiento from "./components/asignaciones/mantenimientos/CrearMantenimientos";
import ListaMantenimientos from "./components/asignaciones/mantenimientos/ListaMantenimientos";
import EliminarMantenimientos from "./components/asignaciones/mantenimientos/EliminarMantenimiento";
import ListaAsignaciones from "./components/asignaciones/ListaAsignacion";
import EliminarAsignacion from "./components/asignaciones/EliminarAsignacion";
import CrearSolicitud from "./components/solicitudes/CrearSolicitud";
import ListaSolicitud from "./components/solicitudes/ListaSolicitud";
import EliminarSolicitud from "./components/solicitudes/EliminarSolicitud";
import HojaBajaActivo from "./components/formatos/HojaBajaActivo";
import HojaResponsabilidad from "./components/formatos/HojaResponsabilidad/HojaResponsabilidad";
import ListaHojasResponsabilidad from "./components/formatos/HojaResponsabilidad/ListaHojaResponsabilidad";
import ListaHojaSolvencia from "./components/formatos/HojaSolvencia/ListaHojaSolvencia";
import HojaSolvencia from "./components/formatos/HojaSolvencia/HojaSolvencia";
import HistoricoTraslados from "./components/formatos/Traslados/ListaTraslados";
import CrearTraslado from "./components/formatos/Traslados/Traslados";
import MovimientosForm from "./components/suministros/MovimientosForm";
import HistorialMovimientos from "./components/suministros/HistorialMovimientos";
import InventarioSuministros from "./components/suministros/InventarioSuministros";
import CrearSuministro from "./components/suministros/Suministro";

function RequireAuth({ children }) {
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          {/* EQUIPOS */}
          <Route path="/equipos/crear" element={<CrearEquipo />} />
          <Route path="/equipos/inventario" element={<ListaEquipos />} />
          <Route path="/equipos/editar" element={<EditarEquipo />} />
          <Route path="/equipos/eliminar" element={<EliminarEquipos />} />
          {/* ASIGNACIONES */}
          <Route path="/asignaciones/crear" element={<CrearAsignacion/>} />
          <Route path="asignaciones/lista" element={<ListaAsignaciones/>} />
          <Route path="asignaciones/eliminar" element={<EliminarAsignacion/>} />
          {/* MANTENIMIENTOS */}
          <Route path="/mantenimientos/crear" element={<CrearMantenimiento/>} />
          <Route path="/mantenimientos/lista" element={<ListaMantenimientos/>} />
          <Route path="/mantenimientos/eliminar" element={<EliminarMantenimientos />} />
          {/* SOLICITUDES */}
          <Route path="/solicitudes/crear" element={<CrearSolicitud/>} />
          <Route path="/solicitudes/lista" element={<ListaSolicitud/>} />
          <Route path="/solicitudes/eliminar" element={<EliminarSolicitud/>} />
          {/* FORMATOS/RESPONSABILIDAD */}
          <Route path="/formatos/hojaderesponsabilidad" element={<HojaResponsabilidad/>} />
          <Route path="/formatos/listahojasresponsabilidad" element={<ListaHojasResponsabilidad/>} />
          {/* FORMATOS/SOLVENCIAS */}
          <Route path="/formatos/listahojasSolvencias" element={<ListaHojaSolvencia/>} />
          <Route path="/formatos/hojasSolvencias" element={<HojaSolvencia/>} />
          {/* FORMATOS/BAJADEACTIVOS */}
          <Route path="/formatos/bajaAtivos" element={<HojaBajaActivo/>} />
          {/* FORMATOS/TRASLADOS */}
          <Route path="/formatos/traslados" element={<HistoricoTraslados/>} />
          <Route path="/formatos/traslados/crear" element={<CrearTraslado/>} />
          {/* SUMINISTROS */}
          <Route path="/suministros" element={<CrearSuministro/>} />
          <Route path="/suministros/inventario" element={<InventarioSuministros/>} />
          <Route path="/suministros/movimientos" element={<MovimientosForm/>} />
          <Route path="/suministros/movimientos/historial" element={<HistorialMovimientos/>} />
         </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
