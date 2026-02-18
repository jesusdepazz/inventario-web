import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generarPDFHoja = async (hoja) => {
  const doc = new jsPDF();
  const marginX = 5;
  const pageWidth = doc.internal.pageSize.getWidth();
  const boxWidth = pageWidth - marginX * 2;
  const pageHeight = doc.internal.pageSize.getHeight();

  const fechaActual = new Date().toLocaleDateString("es-ES");

  const formatFecha = (fecha) => {
    if (!fecha || fecha.startsWith("0001-01-01")) return "—";
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  const agregarFooter = (doc, numeroPagina) => {
    const footerY = pageHeight - 10;

    doc.setFontSize(8);
    doc.setTextColor(100);

    doc.text("Depto. de Sistemas", 10, footerY);

    const textoPagina = `Página ${numeroPagina}`;
    const textWidth = doc.getTextWidth(textoPagina);
    doc.text(textoPagina, (pageWidth - textWidth) / 2, footerY);

    const emision = `Emisión: ${fechaActual}`;
    const emisionWidth = doc.getTextWidth(emision);
    doc.text(emision, pageWidth - emisionWidth - 10, footerY);
  };

  const agregarEncabezado = async (doc, numeroHoja, marginX, mostrarContador = true, yStart = 20) => {
    const logoUrl = `${window.location.origin}/logo_guandy.png`;
    const logoImg = await loadImage(logoUrl);

    const logoWidth = 40;
    const logoHeight = 20;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = 10;
    const lineMarginX = marginX;
    const lineWidth = pageWidth - marginX * 2;
    const centerY = logoY + logoHeight / 2;
    const space = 0.7;

    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.3);
    doc.line(lineMarginX, centerY - space * 2, lineMarginX + lineWidth, centerY - space * 2);
    doc.setLineWidth(1.2);
    doc.line(lineMarginX, centerY, lineMarginX + lineWidth, centerY);
    doc.setLineWidth(0.3);
    doc.line(lineMarginX, centerY + space * 2, lineMarginX + lineWidth, centerY + space * 2);

    doc.addImage(logoImg, "PNG", logoX, logoY, logoWidth, logoHeight);

    yStart = logoY + logoHeight + 5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("ADMINISTRACION DE ACTIVOS IT", marginX, yStart);

    if (mostrarContador) {
      doc.setFontSize(15);
      doc.setTextColor(255, 0, 0);
      doc.text(
        `No. ${String(numeroHoja).padStart(5, "0")}`,
        pageWidth - marginX,
        yStart,
        { align: "right" }
      );

      doc.setFontSize(10);
    }

    doc.setTextColor(0, 0, 0);
    doc.text("HOJA DE RESPONSABILIDAD", marginX, yStart + 4);
    doc.text("ACTIVOS IT, EQUIPOS Y SUMINISTROS", marginX, yStart + 8);
    doc.text(`FECHA DE ACTUALIZACIÓN: ${fechaActual}`, marginX, yStart + 12);

    const yTitulo = yStart + 22;
    const titulo = "HOJA DE RESPONSABILIDAD EQUIPO DE COMPUTO";
    const textWidth = doc.getTextWidth(titulo);
    const tituloX = (pageWidth - textWidth) / 3;
    const lineHeight = 10;

    doc.setFillColor(204, 229, 255);
    doc.rect(marginX, yTitulo, boxWidth, lineHeight, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, tituloX, yTitulo + 7);

    return yTitulo + lineHeight + 1;
  };

  const numeroHoja = hoja.hojaNo ?? 1;
  let yActual = await agregarEncabezado(doc, numeroHoja, marginX, true);

  const empleados = hoja.empleados ?? [];
  const empleadosBody = empleados.map(emp => [
    emp.empleadoId ?? "—",
    emp.nombre ?? "—",
    emp.puesto ?? "—",
    emp.departamento ?? "—"
  ]);

  autoTable(doc, {
    startY: yActual,
    head: [["Código", "Nombre", "Puesto", "Departamento"]],
    body: empleadosBody.length > 0 ? empleadosBody : [["—", "—", "—", "—"]],
    styles: {
      fontSize: 6,
      cellPadding: 1,
      minCellHeight: 4,
      lineColor: [0, 0, 0],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontSize: 6
    },
    margin: { left: marginX, right: marginX },
    tableWidth: boxWidth,
    pageBreak: "auto"
  });

  yActual = doc.lastAutoTable.finalY + 1;

  const motivoLabel = "Motivo de actualización:";
  const motivoTexto = hoja.motivo ?? "—";
  const motivoTextoX = marginX + doc.getTextWidth(motivoLabel) + 4;
  const motivoTextoWidth = boxWidth - (motivoTextoX - marginX) - 4;
  const motivoHeight = 8;

  doc.setFillColor(200, 230, 255);
  doc.setDrawColor(180);
  doc.rect(marginX, yActual, boxWidth, motivoHeight, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(motivoLabel, marginX + 2, yActual + 5);

  doc.setFillColor(255, 255, 255);
  doc.rect(motivoTextoX, yActual + 1.5, motivoTextoWidth, motivoHeight - 3, 'FD');

  doc.setFontSize(9);
  doc.text(
    doc.splitTextToSize(motivoTexto, motivoTextoWidth - 4),
    motivoTextoX + 2,
    yActual + 6
  );

  yActual += motivoHeight + 1;

  const equipos = hoja.equipos ?? [];
  const equiposBody = equipos.map(eq => [
    eq.fechaIngreso ? formatFecha(eq.fechaIngreso) : "—",
    eq.codificacion ?? "—",
    eq.tipoEquipo ?? "—",
    eq.marca ?? "—",
    eq.modelo ?? "—",
    eq.serie ?? "—",
    eq.estado ?? "-",
  ]);

  autoTable(doc, {
    startY: yActual,
    head: [["Fecha", "Código", "Equipo", "Marca", "Modelo", "Serie", "Observaciones."]],
    body: equiposBody.length > 0 ? equiposBody : [["—", "—", "—", "—", "—", "—", "—"]],
    styles: {
      fontSize: 6,
      cellPadding: 1,
      minCellHeight: 4,
      lineColor: [0, 0, 0],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontSize: 6
    },
    margin: { left: marginX, right: marginX },
    tableWidth: boxWidth,
    pageBreak: "auto"
  });

  yActual = doc.lastAutoTable.finalY + 3;

  const alturaTituloAccesorios = 6;
  doc.setFillColor(200, 230, 255);
  doc.rect(marginX, yActual, boxWidth, alturaTituloAccesorios, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("Detalle de accesorios entregados:", marginX + 2, yActual + 4.5);

  yActual += alturaTituloAccesorios + 1;

  const accesorios = [
    "Maletin",
    "Adaptador",
    "Cable USB",
    "Cargador/Cubo",
    "Audífonos",
    "Control Remoto",
    "Baterías",
    "Estuche",
    "Memoria SD",
    "Otros",
  ];

  const accesoriosSeleccionados = hoja.accesorios
    ? hoja.accesorios.split(",").map(a => a.trim())
    : [];

  const spacingX = 35;
  const spacingY = 8;

  accesorios.forEach((acc, i) => {
    const x = marginX + (i % 5) * spacingX;
    const y = yActual + Math.floor(i / 5) * spacingY;

    doc.rect(x, y, 3.5, 3.5);

    if (accesoriosSeleccionados.includes(acc)) {
      doc.setFont("helvetica", "bold");
      doc.text("X", x + 0.9, y + 2.7);
    }

    doc.setFont("helvetica", "normal");
    doc.text(acc, x + 5.5, y + 2.7);

    if (acc === "Otros") {
      const lineStartX = x + 26;
      const lineEndX = pageWidth - marginX;
      doc.line(lineStartX, y + 2.7, lineEndX, y + 2.7);
    }
  });

  yActual += 18

  const col1Width = boxWidth * 0.7;
  const col2Width = boxWidth * 0.3;
  const headerHeight = 6;
  const rowHeight = 12;

  doc.setFillColor(204, 229, 255);
  doc.rect(marginX, yActual, col1Width, headerHeight, 'F');
  doc.rect(marginX + col1Width, yActual, col2Width, headerHeight, 'F');

  doc.text(
    'Comentarios relacionados al estado del equipo',
    marginX + 2,
    yActual + 4
  );
  doc.text(
    'Firma del responsable',
    marginX + col1Width + 2,
    yActual + 4
  );

  yActual += headerHeight;

  doc.setDrawColor(180);
  doc.rect(marginX, yActual, col1Width, rowHeight);
  doc.rect(marginX + col1Width, yActual, col2Width, rowHeight);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);

  const comentariosTexto = hoja.comentarios || "Sin comentarios";
  const comentariosLines = doc.splitTextToSize(
    comentariosTexto,
    col1Width - 4
  );

  doc.text(comentariosLines, marginX + 2, yActual + 4);

  yActual += 15;

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

  yActual += 20;

  const marginFirma = 30;

  const verificarSaltoPagina = async (alturaNecesaria) => {
    if (yActual + alturaNecesaria > pageHeight - 40) {
      agregarFooter(doc, doc.internal.getNumberOfPages());
      doc.addPage();
      yActual = await agregarEncabezado(doc, numeroHoja, marginX, true) + 10;
    }
  };

  const firmas = [
    ...empleados.map(e => ({
      nombre: e.nombre,
      puesto: e.puesto,
      label: "Responsable:"
    })),
    {
      nombre: "Kleidy López",
      puesto: "Asistente IT",
      label: "Realizado por:"
    },
    {
      nombre: "Carlos Mazariegos",
      puesto: "Gerente de Sistemas",
      label: "Entrega de equipo:"
    }
  ];

  const firmasPorFila = 3;
  const alturaFirma = 35;
  const totalFilas = Math.ceil(firmas.length / firmasPorFila);
  const alturaTotalFirmas = totalFilas * alturaFirma + 10;

  await verificarSaltoPagina(alturaTotalFirmas);

  const inicioFirmasY = yActual;

  for (let i = 0; i < firmas.length; i++) {
    const fila = Math.floor(i / firmasPorFila);
    const col = i % firmasPorFila;

    const firmasEnFila = Math.min(
      firmasPorFila,
      firmas.length - fila * firmasPorFila
    );

    let x;

    if (firmasEnFila === 1) {
      x = pageWidth / 2;
    } else if (firmasEnFila === 2) {
      x = col === 0 ? marginFirma : pageWidth - marginFirma;
    } else {
      if (col === 0) x = marginFirma;
      else if (col === 1) x = pageWidth / 2;
      else x = pageWidth - marginFirma;
    }

    const y = inicioFirmasY + fila * alturaFirma;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("(F):________________", x, y, { align: "center" });

    doc.setFontSize(8);
    doc.text(firmas[i].label, x, y + 6, { align: "center" });

    doc.setTextColor(0, 102, 204);
    doc.text(firmas[i].nombre ?? "", x, y + 12, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.text(firmas[i].puesto ?? "", x, y + 18, { align: "center" });
  }

  yActual = inicioFirmasY + alturaTotalFirmas;

  agregarFooter(doc, doc.internal.getNumberOfPages());

  doc.save('hoja_responsabilidad.pdf');
};

export default generarPDFHoja;