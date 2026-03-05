import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-blue-900 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 ml-80 h-screen overflow-hidden">
        <main className="flex-1 p-6 bg-blue-900 overflow-hidden relative">
          <Outlet />
        </main>

        <footer className="bg-blue-900 text-center text-sm text-white/80 py-2 border-t border-white/10">
          © 2025 Guandy · Todos los derechos reservados
        </footer>
      </div>
    </div>
  );
};

export default Layout;