import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HojaResponsabilidad = () => {
    const [codigoEmpleado, setCodigoEmpleado] = useState('');
    const [empleados, setEmpleados] = useState([]);
    const [codEquipo, setCodEquipo] = useState('');
    const [equipos, setEquipos] = useState([]);
    const [motivo, setMotivo] = useState('');
    const today = new Date();
    const fechaActual = today.toLocaleDateString('es-GT');
    const [accesoriosSeleccionados, setAccesoriosSeleccionados] = useState({
        maletin: false,
        adaptador: false,
        cableUSB: false,
        cargadorCubo: false,
        audifonos: false,
        controlRemoto: false,
        baterias: false,
        estuche: false,
        memoriaSDI: false,
        otros: false,
    });

    const handleAgregarEmpleado = async () => {
        if (!codigoEmpleado.trim()) return;
        try {
            const res = await axios.get(`https://inveq.guandy.com/api/empleados/${codigoEmpleado}`);
            setEmpleados(prev => [...prev, res.data]);
            setCodigoEmpleado('');
        } catch (error) {
            alert('Empleado no encontrado');
        }
    };

    const HandleAgregarEquipo = async () => {
        if (!codEquipo.trim()) return;
        try {
            const res = await fetch(`https://inveq.guandy.com/api/equipos/por-codificacion/${codEquipo}`);
            if (!res.ok) throw new Error('Equipo no encontrado');
            const data = await res.json();
            setEquipos((prev) => [...prev, { ...data, codificacion: codEquipo }]);
            setCodEquipo('');
        } catch (error) {
            alert(error.message);
        }
    };

    const agregarFooter = (doc, numeroPagina, totalPaginas) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - 10;
        const pageWidth = doc.internal.pageSize.width;

        doc.setFontSize(8);
        doc.setTextColor(100);

        doc.text('Depto. de Contabilidad', 10, footerY);

        const textoPagina = `Página ${numeroPagina}${totalPaginas ? ` de ${totalPaginas}` : ''}`;
        const textWidth = doc.getTextWidth(textoPagina);
        doc.text(textoPagina, (pageWidth - textWidth) / 2, footerY);

        const emision = `Emisión: ${fechaActual}`;
        const emisionWidth = doc.getTextWidth(emision);
        doc.text(emision, pageWidth - emisionWidth - 10, footerY);
    };

    const agregarEncabezado = async (doc, numeroHoja, marginX, mostrarContador = true, yStart = 20) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const boxWidth = pageWidth - marginX * 2;

        const logoUrl = `${window.location.origin}/logo_guandy.png`;

        const logoImg = await loadImage(logoUrl);

        const logoWidth = 40;
        const logoHeight = 20;
        const logoX = (pageWidth - logoWidth) / 2;
        const logoY = 10;

        doc.setDrawColor(0, 102, 204);

        const lineMarginX = marginX;
        const lineWidth = pageWidth - marginX * 2;

        const centerY = logoY + logoHeight / 2;
        const space = 0.7;

        const lineY1 = centerY - space * 2;
        const lineY2 = centerY;
        const lineY3 = centerY + space * 2;

        doc.setLineWidth(0.3);
        doc.line(lineMarginX, lineY1, lineMarginX + lineWidth, lineY1);

        doc.setLineWidth(1.2);
        doc.line(lineMarginX, lineY2, lineMarginX + lineWidth, lineY2);

        doc.setLineWidth(0.3);
        doc.line(lineMarginX, lineY3, lineMarginX + lineWidth, lineY3);

        doc.setDrawColor(0);
        doc.setLineWidth(0.200025);


        doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);

        yStart = logoY + logoHeight + 5;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('ADMINISTRACION DE ACTIVOS FIJOS', marginX, yStart);

        if (mostrarContador) {
            doc.setTextColor(255, 0, 0);
            doc.text(`No. ${numeroHoja.toString().padStart(5, '0')}`, pageWidth - marginX - 20, yStart);
        }

        doc.setTextColor(0, 0, 0);
        doc.text('HOJA DE RESPONSABILIDAD', marginX, yStart + 6);
        doc.text('ACTIVOS FIJOS, EQUIPOS Y SUMINISTROS', marginX, yStart + 12);
        doc.text(`FECHA DE ACTUALIZACIÓN: ${fechaActual}`, marginX, yStart + 18);

        const yTitulo = yStart + 26;
        const titulo = 'HOJA DE RESPONSABILIDAD EQUIPO DE COMPUTO';
        const textWidth = doc.getTextWidth(titulo);
        const tituloX = (pageWidth - textWidth) / 3;
        const lineHeight = 10;

        doc.setFillColor(204, 229, 255);
        doc.rect(marginX, yTitulo, boxWidth, lineHeight, 'F');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(titulo, tituloX, yTitulo + 7);

        return yTitulo + lineHeight + 6;
    };

    const loadImage = (url) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });

    const handleGenerarPDF = async () => {
        const motivoTexto = motivo || "Sin motivo especificado";
        const doc = new jsPDF();

        const tablaEstilos = {
            styles: {
                fontSize: 8,
                textColor: [40, 40, 40],
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
                cellPadding: 1,
            },
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            margin: { top: 10, left: 14, right: 14 },
        };

        const pageWidth = doc.internal.pageSize.getWidth();
        const marginX = 14;
        const boxWidth = pageWidth - marginX * 2;

        let contadorHoja = parseInt(localStorage.getItem('contadorHoja') || '0', 10) + 1;
        localStorage.setItem('contadorHoja', contadorHoja.toString());

        const numeroHoja = contadorHoja;


        let yActual = await agregarEncabezado(doc, numeroHoja, marginX, true);

        if (empleados.length > 0) {
            doc.setFillColor(230, 230, 230);
            doc.rect(marginX, yActual, boxWidth, 8, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Datos del responsable y jefe inmediato:', marginX + 2, yActual + 6);

            yActual += 8;

            autoTable(doc, {
                ...tablaEstilos,
                startY: yActual,
                head: [['Código', 'Nombre', 'Puesto', 'Departamento']],
                body: empleados.map(emp => [
                    emp.codigoEmpleado,
                    emp.nombre,
                    emp.puesto,
                    emp.departamento,
                ]),
                didDrawPage: () => {
                    agregarEncabezado(doc, numeroHoja, marginX);
                }
            });

            yActual = doc.lastAutoTable.finalY + 6;
        }

        const motivoLabel = "Motivo de actualización:";
        const motivoTextoX = marginX + doc.getTextWidth(motivoLabel) + 4;
        const motivoTextoWidth = boxWidth - (motivoTextoX - marginX) - 4;
        const motivoHeight = 8;

        doc.setFillColor(200, 230, 255);
        doc.setDrawColor(180);
        doc.rect(marginX, yActual, boxWidth, motivoHeight, 'FD');

        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(motivoLabel, marginX + 2, yActual + 6);

        doc.setFillColor(255, 255, 255);
        doc.rect(motivoTextoX, yActual + 1.5, motivoTextoWidth, motivoHeight - 3, 'FD');

        doc.setFontSize(9);
        doc.text(
            doc.splitTextToSize(motivoTexto, motivoTextoWidth - 4),
            motivoTextoX + 2,
            yActual + 6
        );

        yActual += motivoHeight + 4;

        if (equipos.length > 0) {
            doc.setFillColor(230, 230, 230);
            doc.rect(marginX, yActual, boxWidth, 8, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Detalles de equipo entregados:', marginX + 2, yActual + 6);

            yActual += 8;

            autoTable(doc, {
                ...tablaEstilos,
                startY: yActual,
                head: [['Codificación', 'Marca', 'Modelo', 'Serie', 'Estado', 'Tipo', 'Ubicación', 'Observaciones']],
                body: equipos.map(eq => [
                    eq.codificacion || '',
                    eq.marca,
                    eq.modelo,
                    eq.serie || '',
                    eq.estado,
                    eq.tipo,
                    eq.ubicacion,
                ]),
            });

            yActual = doc.lastAutoTable.finalY + 6;
        }

        const accesoriosNombres = {
            maletin: 'Maletín',
            adaptador: 'Adaptador',
            cableUSB: 'Cable USB',
            cargadorCubo: 'Cargador/Cubo',
            audifonos: 'Audífonos',
            controlRemoto: 'Control Remoto',
            baterias: 'Baterías',
            estuche: 'Estuche',
            memoriaSDI: 'Memoria SD',
            otros: 'Otros',
        };

        const accesorios = Object.entries(accesoriosSeleccionados);
        const colCount = 5;
        const availableWidth = pageWidth - marginX * 2;
        const spacingX = availableWidth / colCount;
        const spacingY = 5;
        const checkboxSize = 4;

        doc.setFillColor(230, 230, 230);
        doc.rect(marginX, yActual, boxWidth, 8, 'F');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);

        const tituloAccesorios = 'Accesorios Entregados:';
        const textWidth = doc.getTextWidth(tituloAccesorios);
        const titleX = marginX + (availableWidth - textWidth) / 2;

        doc.text(tituloAccesorios, titleX, yActual + 6);

        yActual += 12;

        let x = marginX;
        let y = yActual;

        accesorios.forEach(([clave, entregado], index) => {
            const nombreVisible = accesoriosNombres[clave] || clave;
            doc.rect(x, y - checkboxSize + 1, checkboxSize, checkboxSize);

            if (entregado) {
                doc.setFontSize(10);
                doc.text('X', x + 1.2, y + 1);
            }

            doc.setFontSize(10);
            doc.text(nombreVisible, x + checkboxSize + 3, y + 1);

            x += spacingX;
            if ((index + 1) % colCount === 0) {
                x = marginX;
                y += spacingY;
            }
        });

        yActual = y + 4;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);

        const col1Width = boxWidth * 0.7;
        const col2Width = boxWidth * 0.3;

        doc.setFillColor(204, 229, 255);
        doc.rect(marginX, yActual, col1Width, 8, 'F');
        doc.rect(marginX + col1Width, yActual, col2Width, 8, 'F');

        doc.text('Comentarios relacionados al estado del equipo', marginX + 2, yActual + 6);
        doc.text('Firma del responsable', marginX + col1Width + 2, yActual + 6);

        yActual += 8;

        const rowHeight = 20;
        doc.setDrawColor(180);

        doc.rect(marginX, yActual, col1Width, rowHeight);
        doc.rect(marginX + col1Width, yActual, col2Width, rowHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('(F):', marginX + col1Width + 4, yActual + rowHeight / 2 + 3);

        yActual += rowHeight + 10;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text('Me haré responsable del manejo óptimo de estos recursos, a través de lo siguiente:', marginX, yActual);
        yActual += 4;

        const printWrappedText = (texto, x, y, maxWidth) => {
            const lines = doc.splitTextToSize(texto, maxWidth);
            doc.text(lines, x, y);
            return y + lines.length * 3;
        };

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(0, 102, 204);

        yActual = printWrappedText('A) Conservar íntegro los recursos anteriormente descritos.', marginX, yActual, boxWidth);
        yActual = printWrappedText('B) Cualquier circunstancia adversa a mis manejos de los recursos, lo reportaré de manera inmediata a mi jefe inmediato y a Administrador de activos fijos.', marginX, yActual, boxWidth);
        yActual = printWrappedText('C) Verificar la integridad de las etiquetas de código de activos, cualquier anomalía se reportará a Administrador de Activos Fijos.', marginX, yActual, boxWidth);
        yActual = printWrappedText('D) Me comprometo a devolver los recursos en buenas condiciones, y en el momento que sean devueltos, si por circunstancias el Activo fuese destruido total o parcialmente por negligencia mía, AUTORIZO a la empresa ¨Guatemalan Candies, S.A.¨ realizar el reclamo respectivo del mismo, deduciendo la suma que cubra el valor del o los recursos de mi salario al cual tengo derecho.', marginX, yActual, boxWidth);

        const numeroPagina = doc.internal.getNumberOfPages();
        agregarFooter(doc, numeroPagina);

        doc.addPage();

        const nuevaPagina = doc.internal.getNumberOfPages();
        let yFirmas = await agregarEncabezado(doc, nuevaPagina, marginX, false);
        yFirmas += 20;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);

        const colWidth = boxWidth / 3;
        const col1X = marginX + colWidth / 2;
        const col2X = marginX + colWidth + colWidth / 2;
        const col3X = marginX + colWidth * 2 + colWidth / 2;

        // 💠 Firma izquierda fija (Kelin)
        doc.setTextColor(0, 0, 0);
        doc.text("(F)_________________", col1X - doc.getTextWidth("(F)_________________") / 2, yFirmas);
        doc.text("Realizado por:", col1X - doc.getTextWidth("Realizado por:") / 2, yFirmas + 6);
        doc.setTextColor(0, 102, 204); // Azul
        doc.text("Kelin Stefani Blanco", col1X - doc.getTextWidth("Kelin Stefani Blanco") / 2, yFirmas + 12);
        doc.setTextColor(0, 0, 0);
        doc.text("Administración", col1X - doc.getTextWidth("Administración") / 2, yFirmas + 18);

        // 💠 Firma derecha fija (Carlos)
        doc.setTextColor(0, 0, 0);
        doc.text("(F):________________", col3X - doc.getTextWidth("(F):________________") / 2, yFirmas);
        doc.text("Entrega de equipo:", col3X - doc.getTextWidth("Entrega de equipo:") / 2, yFirmas + 6);
        doc.setTextColor(0, 102, 204);
        doc.text("Carlos Mazariegos", col3X - doc.getTextWidth("Carlos Mazariegos") / 2, yFirmas + 12);
        doc.setTextColor(0, 0, 0);
        doc.text("Gerente de sistemas", col3X - doc.getTextWidth("Gerente de sistemas") / 2, yFirmas + 18);

        // 💠 Firmas dinámicas de empleados
        const columnas = [col1X, col2X, col3X];
        let firmaY = yFirmas + 40;
        const alturaFila = 30;

        empleados.forEach((empleado, index) => {
            const colIndex = index % 3;
            const x = columnas[colIndex];
            const y = firmaY;

            doc.setTextColor(0, 0, 0);
            doc.text("(F):________________", x - doc.getTextWidth("(F):________________") / 2, y);
            doc.text("Responsable:", x - doc.getTextWidth("Responsable:") / 2, y + 6);

            doc.setTextColor(0, 102, 204);
            doc.text(empleado.nombre, x - doc.getTextWidth(empleado.nombre) / 2, y + 12);

            doc.setTextColor(0, 0, 0);
            doc.text((empleado.puesto || ''), x - doc.getTextWidth(empleado.puesto || '') / 2, y + 18);

            // Si ya se llenaron las 3 columnas, baja a siguiente fila
            if (colIndex === 2) {
                firmaY += alturaFila;
            }
        });

        agregarFooter(doc, nuevaPagina);

        doc.save('hoja_responsabilidad.pdf');
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold text-center mb-6">Hoja de Responsabilidad</h2>
            <div className="mb-6">
                <label className="block font-semibold mb-1">Código de Empleado</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={codigoEmpleado}
                        onChange={e => setCodigoEmpleado(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded w-full"
                        placeholder="Ej. T01234"
                    />
                    <button onClick={handleAgregarEmpleado} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Agregar
                    </button>
                </div>
            </div>

            {empleados.length > 0 && (
                <div className="mb-8">
                    <h3 className="font-bold mb-2">Empleados Agregados</h3>
                    <ul className="list-disc ml-5">
                        {empleados.map((emp, i) => (
                            <li key={i}>
                                {emp.codigoEmpleado} - {emp.nombre} ({emp.departamento})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mb-6">
                <label className="block font-semibold mb-1">Codificación del Equipo</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={codEquipo}
                        onChange={e => setCodEquipo(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded w-full"
                        placeholder="Ej. EQP-1234"
                    />
                    <button onClick={HandleAgregarEquipo} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Agregar
                    </button>
                </div>
            </div>

            {equipos.length > 0 && (
                <div className="mb-8">
                    <h3 className="font-bold mb-2">Equipos Agregados</h3>
                    <ul className="list-disc ml-5">
                        {equipos.map((eq, i) => (
                            <li key={i}>
                                <span className="text-blue-700 font-semibold">
                                    {eq.codificacion}
                                </span>{" "}
                                - {eq.marca} {eq.modelo} (Serie: {eq.serie || 'N/A'})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="my-4">
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">
                    Motivo de actualización:
                </label>
                <textarea
                    id="motivo"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={3}
                />
            </div>
            <div className="mt-6">
                <h3 className="font-semibold mb-2">Accesorios entregados</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.keys(accesoriosSeleccionados).map((key) => (
                        <label key={key} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={accesoriosSeleccionados[key]}
                                onChange={() =>
                                    setAccesoriosSeleccionados((prev) => ({
                                        ...prev,
                                        [key]: !prev[key],
                                    }))
                                }
                            />
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="text-center mt-8">
                <button
                    onClick={handleGenerarPDF}
                    className="bg-green-600 text-white px-6 py-3 rounded font-bold"
                >
                    Generar Hoja PDF
                </button>
            </div>
        </div>
    );
};

export default HojaResponsabilidad;
