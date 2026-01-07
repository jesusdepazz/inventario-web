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
import BajaActivosForm from "./components/formatos/BajaActivo/BajaActivo";
import ListabajaAtivos from "./components/formatos/BajaActivo/ListaBajaActivo";
import { generarBajaPDF } from "./components/formatos/BajaActivo/BajaActivoPDF";
import HojaResponsabilidad from "./components/formatos/HojaResponsabilidad/HojaResponsabilidad";
import ListaHojasResponsabilidad from "./components/formatos/HojaResponsabilidad/ListaHojaResponsabilidad";
import ListaHojaSolvencia from "./components/formatos/HojaSolvencia/ListaHojaSolvencia";
import HojaSolvencia from "./components/formatos/HojaSolvencia/HojaSolvencia";
import CrearTraslado from "./components/formatos/Traslados/Traslados";
import TrasladosLista from "./components/formatos/Traslados/ListaTraslados";
import Suministros from "./components/suministros/Suministro"
import SuministrosInventario from "./components/suministros/InventarioSuministros";
import Movimientos from "./components/suministros/MovimientoSuministro";
import EliminarSuministros from "./components/suministros/EliminarMovimientos";
import CrearTrasladoRetorno from "./components/formatos/TrasladosRetorno/TrasladosRetorno";
import TrasladosRetornoLista from "./components/formatos/TrasladosRetorno/TrasladosRetornoLista";
import ProtectedRoute from "./components/ProtectedRout";

function RequireAuth({ children }) {
  const isAuthenticated = useIsAuthenticated();
  const tokenApp = localStorage.getItem("tokenApp");

  if (!isAuthenticated && !tokenApp) {
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
          <Route
            path="/equipos/crear"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <CrearEquipo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipos/inventario"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Inventario"]}>
                <ListaEquipos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipos/editar"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <EditarEquipo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipos/eliminar"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <EliminarEquipos />
              </ProtectedRoute>
            }
          />
          {/* ASIGNACIONES */}
          <Route
            path="/asignaciones/crear"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <CrearAsignacion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asignaciones/lista"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Inventario"]}>
                <ListaAsignaciones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asignaciones/eliminar"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <EliminarAsignacion />
              </ProtectedRoute>
            }
          />
          {/* MANTENIMIENTOS */}
          <Route
            path="/mantenimientos/crear"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <CrearMantenimiento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mantenimientos/lista"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Inventario"]}>
                <ListaMantenimientos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mantenimientos/eliminar"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <EliminarMantenimientos />
              </ProtectedRoute>
            }
          />
          {/* SOLICITUDES */}
          <Route
            path="/solicitudes/crear"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <CrearSolicitud />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solicitudes/lista"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Inventario"]}>
                <ListaSolicitud />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solicitudes/eliminar"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <EliminarSolicitud />
              </ProtectedRoute>
            }
          />
          {/* FORMATOS / RESPONSABILIDAD */}
          <Route
            path="/formatos/hojaderesponsabilidad"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <HojaResponsabilidad />
              </ProtectedRoute>
            }
          />
          <Route
            path="/formatos/listahojasresponsabilidad"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Inventario"]}>
                <ListaHojasResponsabilidad />
              </ProtectedRoute>
            }
          />
          {/* FORMATOS / SOLVENCIAS */}
          <Route
            path="/formatos/listahojasSolvencias"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Inventario"]}>
                <ListaHojaSolvencia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/formatos/hojasSolvencias"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <HojaSolvencia />
              </ProtectedRoute>
            }
          />
          {/* FORMATOS / BAJA ACTIVOS */}
          <Route
            path="/formatos/bajaAtivos"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <BajaActivosForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/formatos/ListabajaAtivos"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Inventario"]}>
                <ListabajaAtivos />
              </ProtectedRoute>
            }
          />
          <Route path="/formatos/BajaActivo/BajaActivoPDF" element={<generarBajaPDF />} />
          {/* FORMATOS / TRASLADOS */}
          <Route
            path="/formatos/traslados/lista"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Inventario"]}>
                <TrasladosLista />
              </ProtectedRoute>
            }
          />
          <Route
            path="/formatos/traslados/crear"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <CrearTraslado />
              </ProtectedRoute>
            }
          />
          {/* FORMATOS / TRASLADOS RETORNO */}
          <Route
            path="/formatos/trasladosRetorno/crear"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <CrearTrasladoRetorno />
              </ProtectedRoute>
            }
          />
          <Route
            path="/formatos/trasladosRetorno/lista"
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Inventario"]}>
                <TrasladosRetornoLista />
              </ProtectedRoute>
            }
          />
          {/* SUMINISTROS */}
          <Route
            path="/suministros"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <Suministros />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suministros/inventario"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <SuministrosInventario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suministros/movimientos"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <Movimientos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suministros/eliminarMovimientos"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <EliminarSuministros />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
