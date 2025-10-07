import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import UbicacionesService from '../../services/UbicacionesServices';

const HojaBajaActivo = () => {
    const [codEquipo, setCodEquipo] = useState('');
    const [equipos, setEquipos] = useState([]);
    const [motivosSeleccionados, setMotivosSeleccionados] = useState({
        obsolencia: false,
        venta: false,
        robo: false,
        donacion: false,
        otro: false,
    });
    const [justificacion, setJustificacion] = useState('');
    const [ubicaciones, setUbicaciones] = useState([]);
    const [ubicacionActual, setUbicacionActual] = useState('');
    const [destino, setDestino] = useState('');

    useEffect(() => {
        UbicacionesService.obtenerTodas()
            .then(res => {
                setUbicaciones(res.data);
            })
            .catch(err => {
                console.error("Error cargando ubicaciones:", err);
            });
    }, []);

    const handleAgregarEquipo = async () => {
        if (!codEquipo.trim()) return;
        try {
            const res = await axios.get(`https://inveq.guandy.com/api/equipos/por-codificacion/${codEquipo}`);
            setEquipos(prev => [...prev, { ...res.data, codificacion: codEquipo }]);
            setCodEquipo('');
        } catch (error) {
            alert('Equipo no encontrado');
        }
    };

    const handleGenerarPDF = () => {
        const doc = new jsPDF();
        const ubicacionActualNombre = ubicaciones.find(u => String(u.id) === String(ubicacionActual))?.nombre || '';
        const destinoNombre = ubicaciones.find(u => String(u.id) === String(destino))?.nombre || '';
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginX = 5;
        const availableFooterWidth = pageWidth - marginX * 2;

        const headerY = 10;
        const logoWidth = 40;
        const logoHeight = 25;
        const cellPadding = 4;

        const numeroPDF = 'No. ' + String(Math.floor(100000 + Math.random() * 900000));

        doc.addImage('/logo_guandy.png', 'PNG', marginX, headerY, logoWidth, logoHeight);

        const centroX = marginX + logoWidth + 50;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Guatemala Candies, S.A.', centroX, headerY + 5);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Administracion de Activos Fijos', centroX, headerY + 11);
        doc.text('Baja de Equipo de Computo', centroX, headerY + 17);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        const numeroX = marginX + availableFooterWidth - 20;
        doc.text(numeroPDF, numeroX, headerY + 5);

        const lineaY = headerY + logoHeight + 2;
        doc.setDrawColor(0);
        doc.setLineWidth(0.2);
        doc.line(marginX, lineaY, marginX + availableFooterWidth, lineaY);

        let y = lineaY + 2;

        const motivosNombres = {
            obsolencia: "Obsolescencia",
            venta: "Venta",
            robo: "Robo",
            donacion: "Donación",
            otro: "Otro",
        };

        const motivos = Object.entries(motivosSeleccionados);
        const colCount = 5;
        const availableWidth = pageWidth - marginX * 2;
        const cellWidth = availableWidth / colCount;
        const cellHeight = 8;
        const checkboxSize = 4;

        const tituloFecha = '';
        const alturaTitulo = 8;

        doc.setDrawColor(0);
        doc.setFillColor(200, 200, 200);
        doc.rect(marginX, y, availableWidth, alturaTitulo, 'FD');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);

        const textoAncho = doc.getTextWidth(tituloFecha);
        const textoX = marginX + (availableWidth - textoAncho) / 2;
        const textoY = y + alturaTitulo / 2 + 3;

        doc.text(tituloFecha, textoX, textoY);

        y += alturaTitulo + 0;

        const fechaTitulo = 'Fecha';
        const fechaValor = new Date().toLocaleDateString('es-GT');
        const fechaCellHeight = 8;
        const fechaCellWidth = 40;
        const valorCellWidth = availableWidth - fechaCellWidth;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setDrawColor(0);
        doc.setTextColor(0);

        doc.rect(marginX, y, fechaCellWidth, fechaCellHeight);
        doc.text(fechaTitulo, marginX + 2, y + 5);

        doc.setFont('helvetica', 'normal');
        doc.rect(marginX + fechaCellWidth, y, valorCellWidth, fechaCellHeight);
        doc.text(fechaValor, marginX + fechaCellWidth + 2, y + 5);

        y += fechaCellHeight;

        doc.setDrawColor(0);
        doc.setFillColor(200, 200, 200);
        doc.rect(marginX, y, availableWidth, cellHeight, 'FD');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);

        const titulo = 'JUSTIFICACIÓN DE LA BAJA';
        const textWidth = doc.getTextWidth(titulo);
        const titleX = marginX + (availableWidth - textWidth) / 2;

        doc.text(titulo, titleX, y + cellHeight / 2 + 2);
        y += cellHeight;
        let x = marginX;
        let rowCount = 0;

        motivos.forEach(([clave, seleccionado], index) => {
            const motivoVisible = motivosNombres[clave] || clave;

            doc.setDrawColor(0);
            doc.rect(x, y, cellWidth, cellHeight);

            const checkboxX = x + 3;
            const checkboxY = y + cellHeight / 2 - checkboxSize / 2;

            doc.rect(checkboxX, checkboxY, checkboxSize, checkboxSize);

            if (seleccionado) {
                doc.text('X', checkboxX + 1.2, checkboxY + checkboxSize - 0.5);
            }

            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(motivoVisible, checkboxX + checkboxSize + 3, checkboxY + checkboxSize - 0.5);

            x += cellWidth;
            if ((index + 1) % colCount === 0) {
                x = marginX;
                y += cellHeight;
                rowCount++;
            }
        });

        if (motivos.length % colCount !== 0) {
            y += cellHeight;
        }

        const justificacionCellHeight = cellHeight * 3;
        const labelWidth = 30;
        const textAreaWidth = availableWidth - labelWidth;

        doc.setDrawColor(0);
        doc.rect(marginX, y, labelWidth, justificacionCellHeight);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Justificación\nde la baja\nde activos', marginX + 2, y + 5, {
            maxWidth: labelWidth - 4,
            lineHeightFactor: 1.2
        });

        doc.rect(marginX + labelWidth, y, textAreaWidth, justificacionCellHeight);

        const lineSpacing = justificacionCellHeight / 3;
        for (let i = 1; i <= 2; i++) {
            const lineY = y + i * lineSpacing;
            doc.setDrawColor(180);
            doc.line(marginX + labelWidth + 2, lineY, marginX + availableWidth - 2, lineY);
        }

        y += justificacionCellHeight + 0;

        autoTable(doc, {
            startY: y,
            head: [
                [
                    {
                        content: 'INFORMACIÓN GENERAL',
                        colSpan: 6,
                        styles: {
                            halign: 'center',
                            fillColor: [200, 200, 200],
                            fontStyle: 'bold',
                            fontSize: 10,
                            lineColor: [0, 0, 0],
                            lineWidth: 0.2
                        }
                    }
                ],
                ['Codificación', 'Marca', 'Modelo', 'Serie', 'Estado', 'Tipo']
            ],
            body: [
                ...equipos.map(eq => [
                    eq.codificacion || '',
                    eq.marca,
                    eq.modelo,
                    eq.serie || '',
                    eq.estado,
                    eq.tipo,
                ]),
                [
                    { content: "Ubicación Actual", styles: { fontStyle: "bold" } },
                    { content: ubicacionActualNombre, colSpan: 5 }
                ],
                [
                    { content: "Destino", styles: { fontStyle: "bold" } },
                    { content: destinoNombre, colSpan: 5 }
                ],
                [
                    {
                        content: 'Observaciones',
                        colSpan: 1,
                        styles: { fontStyle: 'bold', halign: 'left', valign: 'center' }
                    },
                    {
                        content: '\n\n',
                        colSpan: 6,
                        styles: { halign: 'left' }
                    }
                ]
            ],
            margin: { left: marginX, right: marginX },
            styles: {
                fontSize: 8,
                lineColor: [0, 0, 0],
                lineWidth: 0.2
            },
            headStyles: {
                fillColor: [200, 200, 200],
                textColor: 0
            },
            bodyStyles: {
                lineColor: [0, 0, 0],
                lineWidth: 0.2
            }
        });

        y = doc.lastAutoTable.finalY + 0;

        autoTable(doc, {
            startY: y,
            head: [
                [
                    {
                        content: 'DETALLES DE BAJA DE ACTIVO POR VENTA Y/O DONACIÓN',
                        colSpan: 2,
                        styles: {
                            halign: 'center',
                            fillColor: [200, 200, 200],
                            fontStyle: 'bold',
                            fontSize: 10,
                            lineColor: [0, 0, 0],
                            lineWidth: 0.2
                        }
                    }
                ]
            ],
            body: [
                ['Pase de salida SR:', ''],
                ['Factura:', ''],
                ['Deposito:', ''],
                ['Recibo:', ''],
                ['Otro:', '']
            ],
            columnStyles: {
                0: { cellWidth: 45 },
                1: { cellWidth: 'auto' }
            },
            margin: { left: marginX, right: marginX },
            styles: {
                fontSize: 10,
                lineColor: [0, 0, 0],
                lineWidth: 0.2
            },
            headStyles: {
                fillColor: [200, 200, 200],
                textColor: 0
            },
            bodyStyles: {
                halign: 'left',
                valign: 'middle'
            }
        });

        y = doc.lastAutoTable.finalY + 0;

        autoTable(doc, {
            startY: y,
            head: [
                [
                    {
                        content: 'OBSERVACIONES',
                        colSpan: 1,
                        styles: {
                            halign: 'center',
                            fillColor: [200, 200, 200],
                            fontStyle: 'bold',
                            fontSize: 10,
                            lineColor: [0, 0, 0],
                            lineWidth: 0.2,
                            minCellWidth: 8
                        }
                    }
                ]
            ],
            body: [
                [''],
                [''],
                ['']
            ],
            columnStyles: {
                0: { cellWidth: 'auto' }
            },
            margin: { left: marginX, right: marginX },
            styles: {
                fontSize: 10,
                lineColor: [0, 0, 0],
                lineWidth: 0.2,
                minCellHeight: 8
            },
            headStyles: {
                fillColor: [200, 200, 200],
                textColor: 0
            },
            bodyStyles: {
                valign: 'top'
            }
        });

        y = doc.lastAutoTable.finalY + 0;

        autoTable(doc, {
            startY: y,
            head: [
                [
                    {
                        content: 'NOMBRES Y FIRMAS',
                        colSpan: 3,
                        styles: {
                            halign: 'center',
                            fillColor: [200, 200, 200],
                            fontStyle: 'bold',
                            fontSize: 10,
                            lineColor: [0, 0, 0],
                            lineWidth: 0.2,
                            minCellWidth: 5
                        }
                    }
                ],
                [
                    {
                        content: 'Nombre y firma solicitante\n\n\n\nAmparo Castellanos',
                        styles: {
                            halign: 'center',
                            fontSize: 8,
                            fontStyle: 'bold',
                            fillColor: [230, 230, 230],
                            textColor: 0,
                            cellPadding: 2,
                        }
                    },
                    {
                        content: 'Enterado jefe inmediato',
                        styles: {
                            halign: 'center',
                            fontSize: 8,
                            fontStyle: 'bold',
                            fillColor: [230, 230, 230],
                            textColor: 0
                        }
                    },
                    {
                        content: 'Vo.Co. Contador General\n\n\n\nErick Pacajoj',
                        styles: {
                            halign: 'center',
                            fontSize: 8,
                            fontStyle: 'bold',
                            fillColor: [230, 230, 230],
                            textColor: 0
                        }
                    }
                ],
                [
                    {
                        content: 'Vo.Bo. Activos Fijos\n\n\n\nKelin Blanco',
                        styles: {
                            halign: 'center',
                            fontSize: 8,
                            fontStyle: 'bold',
                            fillColor: [230, 230, 230],
                            textColor: 0
                        }
                    },
                    {
                        content: 'Recibido\n\n\n\nGabriela Martinez/ Vanessa Aguilar',
                        styles: {
                            halign: 'center',
                            fontSize: 8,
                            fontStyle: 'bold',
                            fillColor: [230, 230, 230],
                            textColor: 0
                        }
                    },
                    {
                        content: 'Autorización\n\n\n\nGerrardo Araneda/ Vanessa Santiago',
                        styles: {
                            halign: 'center',
                            fontSize: 8,
                            fontStyle: 'bold',
                            fillColor: [230, 230, 230],
                            textColor: 0
                        }
                    }
                ]
            ],
            body: [],
            margin: { left: marginX, right: marginX },
            styles: {
                fontSize: 8,
                lineColor: [0, 0, 0],
                lineWidth: 0.2,
                minCellHeight: 10
            },
            headStyles: {
                textColor: 0,
                fillColor: [200, 200, 200]
            },
            theme: 'grid'
        });

        doc.save("hoja_baja_activo.pdf");
    };

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold text-center mb-6">Hoja de Baja de Activo</h2>

            <div className="mb-6">
                <label className="block font-semibold mb-1">Codificación del Equipo</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={codEquipo}
                        onChange={e => setCodEquipo(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded w-full"
                    />
                    <button onClick={handleAgregarEquipo} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Agregar
                    </button>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="font-semibold mb-2">Motivo de la Baja</h3>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                    {Object.keys(motivosSeleccionados).map((key) => (
                        <label key={key} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={motivosSeleccionados[key]}
                                onChange={() =>
                                    setMotivosSeleccionados((prev) => ({
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
            <br></br>
            <div className="mb-6">
                <label className="block font-semibold mb-2">Detalles de baja de activo por venta y o donacion</label>
                <textarea
                    value={justificacion}
                    onChange={e => setJustificacion(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    placeholder="Describa la razón detallada por la que se da de baja este activo..."
                />
            </div>
            <div className="mb-4">
                <label className="block font-semibold mb-1">Ubicación Actual</label>
                <select
                    value={ubicacionActual}
                    onChange={e => setUbicacionActual(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded w-full"
                >
                    <option value="">Seleccione una ubicación</option>
                    {ubicaciones.map((ubi) => (
                        <option key={ubi.id} value={ubi.id}>
                            {ubi.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Destino</label>
                <select
                    value={destino}
                    onChange={e => setDestino(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded w-full"
                >
                    <option value="">Seleccione un destino</option>
                    {ubicaciones.map((ubi) => (
                        <option key={ubi.id} value={ubi.id}>
                            {ubi.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="text-center mt-8">
                <button
                    onClick={handleGenerarPDF}
                    className="bg-green-600 text-white px-6 py-3 rounded font-bold"
                >
                    Generar PDF de Baja
                </button>
            </div>
        </div>
    );
};

export default HojaBajaActivo;