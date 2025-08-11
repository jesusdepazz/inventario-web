import React, { useEffect, useState } from "react";
import EquiposService from "../../services/EquiposServices";

const camposFiltro = [
  { label: "Codificación", value: "codificacion", tipo: "texto" },
  { label: "Factura", value: "factura", tipo: "texto" },
  { label: "Marca", value: "marca", tipo: "texto" },
  { label: "Proveedor", value: "proveedor", tipo: "texto" },
  { label: "Modelo", value: "modelo", tipo: "texto" },
  { label: "Estado", value: "estado", tipo: "select", opciones: ["Buen estado", "Inactivo", "Obsoleto"] },
  { label: "Ubicación", value: "ubicacion", tipo: "texto" },
  { label: "Asignado a", value: "asignaciones", tipo: "texto" },
];

const ListaEquipos = () => {
  const [equipos, setEquipos] = useState([]);

  const [filtros, setFiltros] = useState([]);

  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        const res = await EquiposService.obtenerEquipos();
        setEquipos(res.data);
      } catch (err) {
        console.error("Error al obtener equipos:", err);
      }
    };
    cargarEquipos();
  }, []);

  const agregarFiltro = () => {
    setFiltros((prev) => [...prev, { campo: camposFiltro[0].value, valor: "" }]);
  };

  const cambiarCampoFiltro = (index, campoNuevo) => {
    setFiltros((prev) =>
      prev.map((filtro, i) =>
        i === index ? { campo: campoNuevo, valor: "" } : filtro
      )
    );
  };

  const cambiarValorFiltro = (index, valorNuevo) => {
    setFiltros((prev) =>
      prev.map((filtro, i) =>
        i === index ? { ...filtro, valor: valorNuevo } : filtro
      )
    );
  };

  const eliminarFiltro = (index) => {
    setFiltros((prev) => prev.filter((_, i) => i !== index));
  };

  const filtrarEquipos = () => {
    if (filtros.length === 0) return equipos;

    return equipos.filter((equipo) =>
      filtros.every(({ campo, valor }) => {
        if (!valor.trim()) return true;

        let valorCampo = "";

        if (campo === "asignaciones") {
          valorCampo =
            equipo.asignaciones
              ?.map(
                (a) =>
                  `${a.codigoEmpleado || ""} ${a.nombreEmpleado || ""} ${a.puesto || ""}`
              )
              .join(" ")
              .toLowerCase() || "";
        } else {
          valorCampo =
            equipo[campo] !== null && equipo[campo] !== undefined
              ? equipo[campo].toString().toLowerCase()
              : "";
        }

        return valorCampo.includes(valor.toLowerCase());
      })
    );
  };

  const resultadosFiltrados = filtrarEquipos();

  const colorEstado = {
    "Buen estado": "text-green-600 font-bold",
    Inactivo: "text-orange-500 font-bold",
    Obsoleto: "text-red-600 font-bold",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-4 flex flex-wrap gap-3 items-end">
        {filtros.map((filtro, i) => {
          const campoInfo = camposFiltro.find((c) => c.value === filtro.campo);

          return (
            <div key={i} className="flex items-center space-x-2 border rounded p-2 shadow">
              <select
                value={filtro.campo}
                onChange={(e) => cambiarCampoFiltro(i, e.target.value)}
                className="border rounded px-2 py-1"
              >
                {camposFiltro.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              {campoInfo.tipo === "select" ? (
                <select
                  value={filtro.valor}
                  onChange={(e) => cambiarValorFiltro(i, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="">-- Todos --</option>
                  {campoInfo.opciones.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={`Buscar ${campoInfo.label}`}
                  value={filtro.valor}
                  onChange={(e) => cambiarValorFiltro(i, e.target.value)}
                  className="border rounded px-3 py-1"
                />
              )}

              <button
                onClick={() => eliminarFiltro(i)}
                className="text-red-500 hover:text-red-700 font-bold px-2"
                title="Eliminar filtro"
              >
                &times;
              </button>
            </div>
          );
        })}

        <button
          onClick={agregarFiltro}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          + Añadir filtro
        </button>

        <button
          onClick={() => setFiltros([])}
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-6 max-w-full mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] text-xs text-left border border-gray-200">
            <thead className="bg-blue-900">
              <tr className="text-center font-bold bg-blue-900 text-white">
                <th colSpan="6" className="px-2 py-1 border whitespace-nowrap">
                  DATOS GENERALES
                </th>
                <th colSpan="3" className="px-2 py-1 border whitespace-nowrap">
                  DATOS DE USUARIO
                </th>
                <th colSpan="9" className="px-2 py-1 border whitespace-nowrap">
                  DATOS DEL EQUIPO
                </th>
                <th colSpan="1" className="px-2 py-1 border whitespace-nowrap">
                  UBICACION DEL EQUIPO
                </th>
                <th colSpan="6" className="px-2 py-1 border whitespace-nowrap">
                  INFORMACION DE TOMA DE INVENTARIO
                </th>
              </tr>
              <tr className="text-center bg-blue-900 text-white">
                <th className="px-2 py-1 border whitespace-nowrap">#</th>
                <th className="px-2 py-1 border whitespace-nowrap">No. de Registro Deprect</th>
                <th className="px-2 py-1 border whitespace-nowrap">Orden de Compra</th>
                <th className="px-2 py-1 border whitespace-nowrap">Factura</th>
                <th className="px-2 py-1 border whitespace-nowrap">Proveedor</th>
                <th className="px-2 py-1 border whitespace-nowrap">Fecha Ingreso</th>
                <th className="px-2 py-1 border whitespace-nowrap">Hoja No.</th>
                <th className="px-2 py-1 border whitespace-nowrap">Fecha Actualizacion</th>
                <th className="px-2 py-1 border whitespace-nowrap">Asignado a</th>
                <th className="px-2 py-1 border whitespace-nowrap">Codificación</th>
                <th className="px-2 py-1 border whitespace-nowrap">Marca</th>
                <th className="px-2 py-1 border whitespace-nowrap">Modelo</th>
                <th className="px-2 py-1 border whitespace-nowrap">Serie</th>
                <th className="px-2 py-1 border whitespace-nowrap">IMEI</th>
                <th className="px-2 py-1 border whitespace-nowrap">Estado</th>
                <th className="px-2 py-1 border whitespace-nowrap">Tipo</th>
                <th className="px-2 py-1 border whitespace-nowrap">Número asignado</th>
                <th className="px-2 py-1 border whitespace-nowrap">Extensión</th>
                <th className="px-2 py-1 border whitespace-nowrap">Ubicacion</th>
                <th className="px-2 py-1 border whitespace-nowrap">Revisado de toma fisica</th>
                <th className="px-2 py-1 border whitespace-nowrap">Fecha de toma</th>
                <th className="px-2 py-1 border whitespace-nowrap">Estado de Sticker</th>
                <th className="px-2 py-1 border whitespace-nowrap">Asignado a Hoja de responsabilidad</th>
                <th className="px-2 py-1 border whitespace-nowrap">Comentarios</th>
                <th className="px-2 py-1 border whitespace-nowrap">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {resultadosFiltrados.length > 0 ? (
                resultadosFiltrados.map((equipo, index) => (
                  <tr key={equipo.id} className="text-center">
                    <td className="px-2 py-1 border whitespace-nowrap">{index + 1}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.registroDeprec || "Sin registro"}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.orderCompra}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.factura}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.proveedor}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.fechaIngreso ? new Date(equipo.fechaIngreso).toLocaleDateString("es-ES") : "Sin fecha"}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.hojaNo}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.fechaActualizacion ? new Date(equipo.fechaActualizacion).toLocaleDateString("es-ES") : "Sin fecha"}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">
                      {equipo.asignaciones && equipo.asignaciones.length > 0 ? (
                        equipo.asignaciones.map((asignacion, idx) => (
                          <div key={idx} className="font-semibold mb-1">
                            {idx + 1}. <span className="text-blue-700">{asignacion.codigoEmpleado}</span> - {asignacion.nombreEmpleado} <span className="text-gray-600 italic">({asignacion.puesto})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">Sin asignaciones</span>
                      )}
                    </td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.codificacion}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.marca}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.modelo}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.serie}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.imei}</td>
                    <td className={`px-2 py-1 border whitespace-nowrap ${colorEstado[equipo.estado] || ""}`}>{equipo.estado}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.tipo}</td>
                    {equipo.tipo === "Teléfono móvil" ? (
                      <>
                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.numeroAsignado}</td>
                        <td className="px-2 py-1 border whitespace-nowrap">{equipo.extension}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-1 border whitespace-nowrap">-</td>
                        <td className="px-2 py-1 border whitespace-nowrap">-</td>
                      </>
                    )}
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.ubicacion}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.revisadoTomaFisica}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.fechaToma ? new Date(equipo.fechaToma).toLocaleDateString("es-ES") : "Sin fecha"}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.estadoSticker}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.asignadoHojaResponsabilidad}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.comentarios}</td>
                    <td className="px-2 py-1 border whitespace-nowrap">{equipo.observaciones}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="27" className="text-center p-4 text-gray-600">
                    No se encontraron equipos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListaEquipos;
