import React, { useState, useEffect, useMemo } from "react";
import HojasService from "../../../services/HojasServices";
import generarPDFHoja from "./HojaResponsabilidadPDF";
import generarPDFHojaMovil from "./HojaResponsabilidadMovilPdf";
import { useNavigate } from "react-router-dom";

const ListaHojasResponsabilidad = () => {
  const [hojas, setHojas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [rol, setRol] = useState("");
  const [filtros, setFiltros] = useState({
    hojaNo: "",
    codigo: "",
    responsable: "",
    departamento: "",
    estado: "",
    tipoHoja: "",
    desde: "",
    hasta: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedRol = localStorage.getItem("rol") || "";
    setRol(storedRol);
  }, []);

  useEffect(() => {
    const fetchHojas = async () => {
      try {
        const data = await HojasService.listarHojas();
        const hojasNormalizadas = data?.$values ?? data ?? [];
        setHojas(Array.isArray(hojasNormalizadas) ? hojasNormalizadas : []);
      } catch (error) {
        console.error("Error al obtener hojas:", error);
        window.alert("Error al cargar las hojas de responsabilidad");
      }
    };

    fetchHojas();
  }, []);

  const handleGenerarPDF = (hoja) => {
    if (hoja.tipoHoja === "Movil") generarPDFHojaMovil(hoja);
    else generarPDFHoja(hoja);
  };

  const normalize = (v) =>
    (v ?? "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const hoyTexto = useMemo(() => {
    return new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const esAdmin = rol === "Administrador";

  const hojasFiltradas = useMemo(() => {
    const q = normalize(busqueda);

    const cumpleRango = (fechaStr) => {
      if (!filtros.desde && !filtros.hasta) return true;
      if (!fechaStr) return false;

      const f = new Date(fechaStr);
      if (Number.isNaN(f.getTime())) return false;

      if (filtros.desde) {
        const d = new Date(filtros.desde);
        d.setHours(0, 0, 0, 0);
        if (f < d) return false;
      }
      if (filtros.hasta) {
        const h = new Date(filtros.hasta);
        h.setHours(23, 59, 59, 999);
        if (f > h) return false;
      }
      return true;
    };

    return (hojas || []).filter((hoja) => {
      const emp0 = hoja?.empleados?.[0] ?? hoja?.empleados?.$values?.[0];
      const eq0 = hoja?.equipos?.[0] ?? hoja?.equipos?.$values?.[0];

      const hojaNo = hoja?.hojaNo ?? "";
      const fechaCreacion = hoja?.fechaCreacion ?? "";
      const codigo = emp0?.empleadoId ?? emp0?.EmpleadoId ?? "";
      const responsable = emp0?.nombre ?? emp0?.Nombre ?? "";
      const puesto = emp0?.puesto ?? emp0?.Puesto ?? "";
      const departamento = emp0?.departamento ?? emp0?.Departamento ?? "";
      const jefe = hoja?.jefeInmediato ?? "";
      const ubicacion = eq0?.ubicacion ?? eq0?.Ubicacion ?? "";
      const estado = hoja?.estado ?? "";
      const obs = hoja?.observaciones ?? "";
      const tipoHoja = hoja?.tipoHoja ?? "";

      const blob = normalize(
        `${hojaNo} ${codigo} ${responsable} ${puesto} ${departamento} ${jefe} ${ubicacion} ${estado} ${obs} ${tipoHoja}`
      );
      if (q && !blob.includes(q)) return false;

      if (filtros.hojaNo && !normalize(hojaNo).includes(normalize(filtros.hojaNo))) return false;
      if (filtros.codigo && !normalize(codigo).includes(normalize(filtros.codigo))) return false;
      if (filtros.responsable && !normalize(responsable).includes(normalize(filtros.responsable))) return false;
      if (filtros.departamento && !normalize(departamento).includes(normalize(filtros.departamento))) return false;
      if (filtros.estado && normalize(estado) !== normalize(filtros.estado)) return false;
      if (filtros.tipoHoja && normalize(tipoHoja) !== normalize(filtros.tipoHoja)) return false;
      if (!cumpleRango(fechaCreacion)) return false;

      return true;
    });
  }, [hojas, busqueda, filtros]);

  const limpiar = () => {
    setBusqueda("");
    setFiltros({
      hojaNo: "",
      codigo: "",
      responsable: "",
      departamento: "",
      estado: "",
      tipoHoja: "",
      desde: "",
      hasta: "",
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] px-4 py-6">
      <div className="max-w-7xl mx-auto h-[calc(100vh-56px-48px)]">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-full flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex-none">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-extrabold text-lg text-slate-900">Guatemalan Candies, S.A.</p>
                <p className="font-bold text-lg text-blue-600">
                  Listado de hojas de responsabilidad
                </p>
                <p className="font-semibold text-sm text-slate-600 mt-1">{hoyTexto}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                  Mostrando: <span className="text-slate-900">{hojasFiltradas.length}</span>
                </span>

                <button
                  onClick={() => setMostrarFiltros((p) => !p)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Filtros
                </button>

                <button
                  onClick={limpiar}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[260px]">
                  <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar (hoja, código, responsable, depto, jefe, estado, tipo...)"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>

              {mostrarFiltros && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    <input
                      value={filtros.hojaNo}
                      onChange={(e) => setFiltros((p) => ({ ...p, hojaNo: e.target.value }))}
                      placeholder="Hoja No"
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <input
                      value={filtros.codigo}
                      onChange={(e) => setFiltros((p) => ({ ...p, codigo: e.target.value }))}
                      placeholder="Código"
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <input
                      value={filtros.responsable}
                      onChange={(e) => setFiltros((p) => ({ ...p, responsable: e.target.value }))}
                      placeholder="Responsable"
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <input
                      value={filtros.departamento}
                      onChange={(e) => setFiltros((p) => ({ ...p, departamento: e.target.value }))}
                      placeholder="Departamento"
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />

                    <select
                      value={filtros.estado}
                      onChange={(e) => setFiltros((p) => ({ ...p, estado: e.target.value }))}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >
                      <option value="">Estado (Todos)</option>
                      <option value="Activa">Activa</option>
                      <option value="Inactiva">Inactiva</option>
                    </select>

                    <select
                      value={filtros.tipoHoja}
                      onChange={(e) => setFiltros((p) => ({ ...p, tipoHoja: e.target.value }))}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >
                      <option value="">Tipo hoja (Todos)</option>
                      <option value="Computo">Computo</option>
                      <option value="Movil">Movil</option>
                    </select>

                    <input
                      type="date"
                      value={filtros.desde}
                      onChange={(e) => setFiltros((p) => ({ ...p, desde: e.target.value }))}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <input
                      type="date"
                      value={filtros.hasta}
                      onChange={(e) => setFiltros((p) => ({ ...p, hasta: e.target.value }))}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="min-w-[1700px]">
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-blue-800 text-white">
                    <th className="px-4 py-3 border-b border-blue-900/40">Hoja No</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Fecha</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Código</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Responsable</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Puesto</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Departamento</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Jefe inmediato</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Ubicación</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Estado</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Fecha solvencia</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Observaciones</th>
                    <th className="px-4 py-3 border-b border-blue-900/40">Tipo</th>
                    <th className="px-4 py-3 border-b border-blue-900/40 text-center">Acciones</th>
                    {esAdmin && (
                      <th className="px-4 py-3 border-b border-blue-900/40 text-center">Editar</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {hojasFiltradas.length > 0 ? (
                    hojasFiltradas.map((hoja, idx) => {
                      const emp0 = hoja?.empleados?.[0] ?? hoja?.empleados?.$values?.[0];
                      const eq0 = hoja?.equipos?.[0] ?? hoja?.equipos?.$values?.[0];

                      const fechaCreacion = hoja?.fechaCreacion
                        ? new Date(hoja.fechaCreacion).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "—";

                      const fechaSolv = hoja?.fechaSolvencia
                        ? new Date(hoja.fechaSolvencia).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "—";

                      return (
                        <tr
                          key={hoja?.id ?? hoja?.hojaNo ?? idx}
                          className="border-b border-slate-100 hover:bg-blue-50/50"
                        >
                          <td className="px-4 py-3 font-semibold text-slate-900">{hoja?.hojaNo ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-700">{fechaCreacion}</td>
                          <td className="px-4 py-3 text-slate-700">{emp0?.empleadoId ?? emp0?.EmpleadoId ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-700">{emp0?.nombre ?? emp0?.Nombre ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-700">{emp0?.puesto ?? emp0?.Puesto ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-700">{emp0?.departamento ?? emp0?.Departamento ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-700">{hoja?.jefeInmediato ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-700">{eq0?.ubicacion ?? eq0?.Ubicacion ?? "—"}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                hoja?.estado === "Activa"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : hoja?.estado === "Inactiva"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                              }`}
                            >
                              {hoja?.estado ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{fechaSolv}</td>
                          <td className="px-4 py-3 text-slate-700 max-w-[360px]">
                            <div className="truncate">{hoja?.observaciones ?? "—"}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{hoja?.tipoHoja ?? "—"}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleGenerarPDF(hoja)}
                              className="rounded-xl bg-blue-600 text-white px-4 py-2 text-xs font-semibold hover:bg-blue-700"
                            >
                              PDF
                            </button>
                          </td>
                          {esAdmin && (
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => navigate(`/hojas-responsabilidad/editar/${hoja.id}`)}
                                className="rounded-xl bg-amber-500 text-white px-4 py-2 text-xs font-semibold hover:bg-amber-600"
                              >
                                Editar
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={esAdmin ? 14 : 13} className="px-6 py-10 text-center text-slate-500">
                        No se encontraron hojas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 bg-white flex-none">
            <div className="text-xs text-slate-600">
              Tip: usá la búsqueda rápida o los filtros para encontrar hojas más rápido.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaHojasResponsabilidad;