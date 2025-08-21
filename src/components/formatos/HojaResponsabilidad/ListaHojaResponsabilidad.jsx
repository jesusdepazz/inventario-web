import React, { useState, useEffect } from "react";
import axios from "axios";

const ListaHojasResponsabilidad = () => {
    const [hojas, setHojas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHojas = async () => {
        try {
            const res = await axios.get("https://localhost:7291/api/hojas");
            setHojas(res.data);
        } catch (err) {
            console.error("Error al obtener hojas:", err);
            alert("No se pudieron cargar las hojas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHojas();
    }, []);

    if (loading) return <p>Cargando hojas...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto w-full bg-white shadow-md rounded-xl p-6">
                <div className="text-center mb-4">
                    <p className="font-bold text-lg">Guatemalan Candies, S.A.</p>
                    <p className="font-bold text-lg text-blue-500">Listado de hojas de responsabilidad - Equipo de cómputo</p>
                    <p className="font-bold text-lg">
                        {new Date().toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table border={1} cellPadding={5} cellSpacing={0}>
                        <thead>
                            <tr>
                                <th>Hoja No</th>
                                <th>Equipo</th>
                                <th>Motivo</th>
                                <th>Accesorios</th>
                                <th>Comentarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hojas.map((hoja) => (
                                <tr key={hoja.hojaNo}>
                                    <td>{hoja.hojaNo}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListaHojasResponsabilidad;
