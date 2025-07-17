import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-azure overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen ml-60">
          <main className="flex-1 p-6 overflow-y-auto bg-gradient-azure mb-0">
            <img
              src="/logo_guandy.png"
              alt="Logo Guandy"
              className="absolute top-4 right-4 w-15 h-15"
            />
            <Outlet />
          </main>
        <footer className="bg-white text-center text-sm text-black py-2 shadow-inner mt-0">
          <div className="flex items-center justify-center gap-2">
            <span>© 2025 Guandy · Todos los derechos reservados</span>
            <img
              src="/oso_colgante.png"
              alt="Oso colgante"
              className="w-8 h-10"
            />
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Layout;
