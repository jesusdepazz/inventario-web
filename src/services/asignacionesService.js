const API_URL = import.meta.env.VITE_API_URL;

export const getAsignaciones = async () => {
  const res = await fetch(`${API_URL}/Asignaciones`);
  if (!res.ok) throw new Error("Error al obtener las asignaciones");
  return await res.json();
};

export const crearAsignacion = async (asignacion) => {
  const res = await fetch(`${API_URL}/Asignaciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(asignacion),
  });
  if (!res.ok) throw new Error("Error al crear asignación");
  return await res.json();
};

export const eliminarAsignacion = async (id) => {
  const res = await fetch(`${API_URL}/Asignaciones/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar asignación");
};
