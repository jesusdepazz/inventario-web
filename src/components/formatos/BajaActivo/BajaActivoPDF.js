import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import BajaActivosService from "../../../services/BajaActivosServices";
import EquiposService from "../../../services/EquiposServices";
import UbicacionesService from "../../../services/UbicacionesServices";

export const generarBajaPDF = async (bajaId) => {
  try {
    const { data: baja } = await BajaActivosService.obtenerPorId(bajaId);
    const { data: equipo } = await EquiposService.obtenerPorCodificacion(baja.codificacionEquipo);
    const { data: ubicaciones } = await UbicacionesService.obtenerTodas();

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 5;
    const availableFooterWidth = pageWidth - marginX * 2;

    const headerY = 10;
    const logoWidth = 40;
    const logoHeight = 25;
    const cellHeight = 8;
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

    doc.setFont('helvetica', 'bold');
    const numeroX = marginX + availableFooterWidth - 20;
    doc.text(numeroPDF, numeroX, headerY + 5);

    const lineaY = headerY + logoHeight + 2;
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.line(marginX, lineaY, marginX + availableFooterWidth, lineaY);

    let y = lineaY + 2;

    // Bloque de justificación de la baja (sin motivo marcado)
    const motivosNombres = {
      obsolencia: "Obsolescencia",
      venta: "Venta",
      robo: "Robo",
      donacion: "Donación",
      otro: "Otro",
    };

    const motivos = Object.values(motivosNombres);
    const colCount = 5;
    const availableWidth = pageWidth - marginX * 2;
    const cellWidth = availableWidth / colCount;
    const checkboxSize = 4;

    doc.setDrawColor(0);
    doc.setFillColor(200, 200, 200);
    doc.rect(marginX, y, availableWidth, cellHeight, "FD");
    const titulo = "JUSTIFICACIÓN DE LA BAJA";
    const textWidth = doc.getTextWidth(titulo);
    const titleX = marginX + (availableWidth - textWidth) / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(titulo, titleX, y + cellHeight / 2 + 2);
    y += cellHeight;

    // Dibujar los 5 motivos (sin marcar)
    let x = marginX;
    motivos.forEach((motivoVisible, index) => {
      doc.setDrawColor(0);
      doc.rect(x, y, cellWidth, cellHeight);

      const checkboxX = x + 3;
      const checkboxY = y + cellHeight / 2 - checkboxSize / 2;

      // Cajita vacía sin X
      doc.rect(checkboxX, checkboxY, checkboxSize, checkboxSize);
      doc.text(motivoVisible, checkboxX + checkboxSize + 3, checkboxY + checkboxSize - 0.5);

      x += cellWidth;
      if ((index + 1) % colCount === 0) {
        x = marginX;
        y += cellHeight;
      }
    });

    if (motivos.length % colCount !== 0) y += cellHeight;

    const justificacionCellHeight = cellHeight * 3;
    const labelWidth = 30;
    const textAreaWidth = availableWidth - labelWidth;

    doc.rect(marginX, y, labelWidth, justificacionCellHeight);
    doc.setFont('helvetica', 'bold');
    doc.text('Justificación\nde la baja\nde activos', marginX + 2, y + 5, { maxWidth: labelWidth - 4, lineHeightFactor: 1.2 });
    doc.rect(marginX + labelWidth, y, textAreaWidth, justificacionCellHeight);
    y += justificacionCellHeight;

    const ubicacionActualNombre = ubicaciones.find(u => u.id === baja.ubicacionActual)?.nombre || baja.ubicacionActual;
    const destinoNombre = ubicaciones.find(u => u.id === baja.ubicacionDestino)?.nombre || baja.ubicacionDestino;

    autoTable(doc, {
      startY: y,
      head: [
        [{ content: 'INFORMACIÓN GENERAL', colSpan: 5, styles: { halign: 'center', fillColor: [200, 200, 200], fontStyle: 'bold', fontSize: 10, lineColor: [0, 0, 0], lineWidth: 0.2 } }],
        ['Codificación', 'Equipo', 'Marca', 'Modelo', 'Serie',]
      ],
      body: [
        [
          equipo.codificacion || '',
          equipo.tipoEquipo,
          equipo.marca,
          equipo.modelo || '',
          equipo.serie || ''
        ],
        [{ content: "Ubicación Actual", styles: { fontStyle: "bold" } }, { content: ubicacionActualNombre, colSpan: 5 }],
        [{ content: "Destino", styles: { fontStyle: "bold" } }, { content: destinoNombre, colSpan: 5 }],
        [{ content: "Observaciones", styles: { fontStyle: "bold" } }, { content: baja.detallesBaja || '', colSpan: 5 }]
      ],
      margin: { left: marginX, right: marginX },
      styles: { fontSize: 8, lineColor: [0, 0, 0], lineWidth: 0.2 },
      headStyles: { fillColor: [200, 200, 200], textColor: 0 },
      bodyStyles: { lineColor: [0, 0, 0], lineWidth: 0.2 }
    });

    y = doc.lastAutoTable.finalY + 5;

    autoTable(doc, {
      startY: y,
      head: [
        [{ content: 'NOMBRES Y FIRMAS', colSpan: 3, styles: { halign: 'center', fillColor: [200, 200, 200], fontStyle: 'bold', fontSize: 10 } }]
      ],
      body: [
        [
          'Nombre y firma solicitante\n\n\n\nAmparo Castellanos',
          'Enterado jefe inmediato',
          'Vo.Co. Contador General\n\n\n\nErick Pacajoj'
        ],
        [
          'Vo.Bo. Activos Fijos\n\n\n\nKelin Blanco',
          'Recibido\n\n\n\nGabriela Martinez/ Vanessa Aguilar',
          'Autorización\n\n\n\nGerrardo Araneda/ Vanessa Santiago'
        ]
      ],
      margin: { left: marginX, right: marginX },
      styles: { fontSize: 8, lineColor: [0, 0, 0], lineWidth: 0.2, minCellHeight: 10 },
      headStyles: { textColor: 0, fillColor: [200, 200, 200] },
      theme: 'grid'
    });

    doc.save(`Baja_${baja.codificacionEquipo}.pdf`);
  } catch (error) {
    console.error("Error generando PDF:", error);
  }
};
