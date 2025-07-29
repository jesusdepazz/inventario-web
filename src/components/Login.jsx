import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaWindows } from "react-icons/fa";

export default function Login() {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await instance.loginPopup(loginRequest);
      const account = response.account;

      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      const accessToken = tokenResponse.accessToken;

      localStorage.setItem("tokenAzure", accessToken);
      localStorage.setItem("email", account.username);
      localStorage.setItem("name", account.name);

      const apiResponse = await fetch("https://localhost:7291/api/auth/token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!apiResponse.ok) {
        throw new Error("No tienes permiso para ingresar.");
      }

      const data = await apiResponse.json();
      localStorage.setItem("tokenApp", data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error en login:", error);
      alert("No puedes ingresar, no tienes acceso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(to right, #1e3c72, #2a5298)" }}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Inicia sesión con tu cuenta de Microsoft
        </h2>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md text-white font-bold transition 
          ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          <FaWindows className="text-xl" />
          {loading ? "Conectando..." : "Iniciar sesión con Microsoft"}
        </button>

        <p className="mt-6 text-gray-600 text-sm">
          Solo usuarios autorizados podrán acceder a la plataforma.
        </p>
      </div>
    </div>
  );
}
