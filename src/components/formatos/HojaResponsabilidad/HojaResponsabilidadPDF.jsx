import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generarPDFHoja = async (hoja) => {
  const doc = new jsPDF();
  const marginX = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const boxWidth = pageWidth - marginX * 2;
  const pageHeight = doc.internal.pageSize.getHeight();

  const fechaActual = new Date().toLocaleDateString("es-ES");
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

    doc.text("Depto. de Contabilidad", 10, footerY);

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

    // Línea detrás del logo siempre azul
    doc.setDrawColor(30, 58, 138); // Azul
    doc.setLineWidth(0.3);
    doc.line(lineMarginX, centerY - space * 2, lineMarginX + lineWidth, centerY - space * 2);
    doc.setLineWidth(1.2);
    doc.line(lineMarginX, centerY, lineMarginX + lineWidth, centerY);
    doc.setLineWidth(0.3);
    doc.line(lineMarginX, centerY + space * 2, lineMarginX + lineWidth, centerY + space * 2);

    doc.addImage(logoImg, "PNG", logoX, logoY, logoWidth, logoHeight);

    yStart = logoY + logoHeight + 5;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("ADMINISTRACION DE ACTIVOS FIJOS", marginX, yStart);

    if (mostrarContador) {
      doc.setTextColor(255, 0, 0);
      doc.text(`No. ${String(numeroHoja).padStart(5, "0")}`, pageWidth - marginX - 20, yStart);
    }

    doc.setTextColor(0, 0, 0);
    doc.text("HOJA DE RESPONSABILIDAD", marginX, yStart + 6);
    doc.text("ACTIVOS FIJOS, EQUIPOS Y SUMINISTROS", marginX, yStart + 12);
    doc.text(`FECHA DE ACTUALIZACIÓN: ${fechaActual}`, marginX, yStart + 18);

    const yTitulo = yStart + 26;
    const titulo = "HOJA DE RESPONSABILIDAD EQUIPO DE COMPUTO";
    const textWidth = doc.getTextWidth(titulo);
    const tituloX = (pageWidth - textWidth) / 3;
    const lineHeight = 10;

    doc.setFillColor(204, 229, 255);
    doc.rect(marginX, yTitulo, boxWidth, lineHeight, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, tituloX, yTitulo + 7);

    return yTitulo + lineHeight + 6;
  };

  const numeroHoja = hoja.hojaNo ?? 1;
  let yActual = await agregarEncabezado(doc, numeroHoja, marginX, true);

  // Tabla de empleados
  const empleados = hoja.empleados?.$values ?? [];
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
    styles: { fontSize: 8, lineColor: [0, 0, 0], lineWidth: 0.3 },
    headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] }
  });
  yActual = doc.lastAutoTable.finalY + 6;

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

    const equipos = hoja.equipos?.$values ?? [];
    const equiposBody = equipos.map(eq => [
        eq.codificacion ?? "—",
        eq.marca ?? "—",
        eq.modelo ?? "—",
        eq.serie ?? "—",
        hoja.estado ?? "—",
        eq.tipo ?? "—",
        eq.ubicacion ?? "—"
    ]);

    autoTable(doc, {
        startY: yActual,
        head: [["Codificación", "Marca", "Modelo", "Serie", "Estado", "Tipo", "Ubicación"]],
        body: equiposBody.length > 0 ? equiposBody : [["—", "—", "—", "—", "—", "—", "—"]],
        styles: {
            fontSize: 8,
            lineColor: [0, 0, 0],
            lineWidth: 0.3
        },
        headStyles: {
            fillColor: [30, 58, 138],
            textColor: [255, 255, 255],
            lineColor: [0, 0, 0],
            lineWidth: 0.3
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.3
    });
    yActual = doc.lastAutoTable.finalY + 10;

    const alturaTituloAccesorios = 8;
    doc.setFillColor(200, 230, 255);
    doc.rect(marginX, yActual, boxWidth, alturaTituloAccesorios, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Detalle de accesorios entregados:", marginX + 2, yActual + 6);

    yActual += alturaTituloAccesorios + 4;

    const accesorios = ["Maletín", "Adaptador", "Cable USB", "Cargador/Cubo", "Audífonos", "Control Remoto", "Baterías", "Estuche", "Memoria SD", "Otros"];
    accesorios.forEach((acc, i) => {
        doc.rect(marginX + (i % 5) * 35, yActual + Math.floor(i / 5) * 8, 4, 4);
        doc.text(acc, marginX + 6 + (i % 5) * 35, yActual + 3 + Math.floor(i / 5) * 8);
    });

    yActual += 20;

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

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);

    const comentariosTexto = hoja.comentarios || "Sin comentarios";
    const comentariosLines = doc.splitTextToSize(comentariosTexto, col1Width - 4);
    doc.text(comentariosLines, marginX + 2, yActual + 6);

    yActual += 25;

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

    yActual += 10;

    agregarFooter(doc, doc.internal.getNumberOfPages());

     const espacioNecesario = 30;
  if (yActual + espacioNecesario > pageHeight - 20) {
    doc.addPage();
    yActual = await agregarEncabezado(doc, numeroHoja, marginX, true);
    yActual = pageHeight / 2 - 30;
  }

  const marginFirma = 40;
  const firmaY = yActual;

  if (empleados.length > 0) {
    const n = empleados.length;
    const espacio = n > 1 ? (pageWidth - 2 * marginFirma) / (n - 1) : 0;

    empleados.forEach((emp, index) => {
      let xPos = n === 1 ? pageWidth / 2 : marginFirma + espacio * index;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("(F):_________________________", xPos, firmaY, { align: "center" });

      doc.setFontSize(8);
      doc.text("Responsable:", xPos, firmaY + 6, { align: "center" });

      doc.setTextColor(0, 102, 204);
      doc.text(emp.nombre ?? "", xPos, firmaY + 12, { align: "center" });

      doc.setTextColor(0, 0, 0);
      doc.text(emp.puesto ?? "", xPos, firmaY + 18, { align: "center" });
    });
  } else {
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Sin responsable asignado", pageWidth / 2, firmaY + 6, { align: "center" });
  }

  yActual += 20;

  // =========================
  // FIRMAS FIJAS KELIN Y CARLOS
  // =========================
  const firmaTexto = "(F):________________";
  const firmaDerechaX = pageWidth - marginFirma;

  // Kelin izquierda
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(firmaTexto, marginFirma, yActual);

  const firmaAncho = doc.getTextWidth(firmaTexto);
  const firmaCentroX = marginFirma + firmaAncho / 2;

  doc.setFontSize(8);
  doc.text("Realizado Por:", firmaCentroX, yActual + 6, { align: "center" });
  doc.setTextColor(0, 102, 204);
  doc.text("Kelin Stefani Blanco", firmaCentroX, yActual + 12, { align: "center" });
  doc.setTextColor(0, 0, 0);
  doc.text("Administración de Activos Fijos", firmaCentroX, yActual + 18, { align: "center" });

  // Carlos derecha
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(firmaTexto, firmaDerechaX, yActual, { align: "right" });

  const firmaCentroDerX = firmaDerechaX - (firmaAncho / 2);
  doc.setFontSize(8);
  doc.text("Entrega de Equipo:", firmaCentroDerX, yActual + 6, { align: "center" });
  doc.setTextColor(0, 102, 204);
  doc.text("Carlos Mazariegos", firmaCentroDerX, yActual + 12, { align: "center" });
  doc.setTextColor(0, 0, 0);
  doc.text("Gerente de Sistemas", firmaCentroDerX, yActual + 18, { align: "center" });

  yActual += 50;

  agregarFooter(doc, doc.internal.getNumberOfPages());

  doc.save('hoja_responsabilidad.pdf');
};

export default generarPDFHoja;