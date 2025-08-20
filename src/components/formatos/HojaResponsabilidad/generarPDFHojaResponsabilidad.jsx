import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generarPDFHojaResponsabilidad = (hoja) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Guatemalan Candies, S.A.", 105, 15, { align: "center" });
  doc.setFontSize(12);
  doc.text("Hoja de Responsabilidad - Equipo de cómputo", 105, 22, { align: "center" });

  autoTable(doc, {
    startY: 30,
    head: [["Código", "Nombre", "Puesto", "Departamento"]],
    body: [
      [
        hoja.codigoEmpleado,
        hoja.nombreEmpleado,
        hoja.puesto,
        hoja.departamento,
      ],
    ],
    styles: { fontSize: 8, halign: "center" },
    headStyles: { fillColor: [41, 128, 185] },
  });

  const fechaFormateada = hoja.fechaEquipo 
    ? new Date(hoja.fechaEquipo).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) 
    : "";

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Código", "Nombre", "Puesto", "Departamento"]],
    body: [
      [
        hoja.codigoEmpleado,
        hoja.nombreEmpleado,
        hoja.puesto,
        hoja.departamento,
      ],
    ],
    styles: { fontSize: 8, halign: "center" },
    headStyles: { fillColor: [41, 128, 185] },
  });

const texto = "Motivo de actualización";
const textWidth = doc.getTextWidth(texto) + 6;

autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 10,
  body: [
    [
      { 
        content: texto, 
        styles: { 
          fillColor: [41, 128, 185], 
          textColor: [255, 255, 255], 
          fontStyle: "bold", 
          halign: "left" 
        } 
      },
      { 
        content: hoja.motivoActualizacion || "", 
        styles: { halign: "left" } 
      }
    ],
  ],
  styles: { fontSize: 10, cellPadding: 2 },
  tableWidth: "100%",
  theme: "grid",
  columnStyles: {
    0: { cellWidth: textWidth },
    1: { cellWidth: "auto" }
  }
});

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Fecha", "Codigo", "Equipo", "Marca", "Modelo", "Serie", "Observaciones"]],
    body: [[
      fechaFormateada,
      hoja.codigoEquipo,
      hoja.equipo,
      hoja.marca,
      hoja.modelo,
      hoja.serie,
      hoja.observaciones,
    ]],
    styles: { fontSize: 8, halign: "center" },
    headStyles: { fillColor: [41, 128, 185] },
  });

const accesoriosLista = [
  "Maletín",
  "Adaptador",
  "Cable USB",
  "Cargador Cubo",
  "Audífonos",
  "Control Remoto",
  "Baterías",
  "Estuche",
  "Memoria SD",
  "Otros"
];

const accesoriosSeleccionados = Object.entries(hoja.accesoriosEntregados || {})
  .filter(([key, valor]) => valor)  // solo los que sean true
  .map(([key]) => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  });

const accesoriosFilas = [];
for (let i = 0; i < accesoriosLista.length; i += 5) {
  const fila = accesoriosLista.slice(i, i + 5).map(nombre => {
    const check = accesoriosSeleccionados.includes(nombre) ? "☑" : "☐";
    return `${check} ${nombre}`;
  });
  accesoriosFilas.push(fila);
}

autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 10,
  body: accesoriosFilas,
  theme: "plain",
  styles: { fontSize: 10, cellPadding: 3, halign: "left" },
  columnStyles: {
    0: { cellWidth: 40 },
    1: { cellWidth: 40 },
    2: { cellWidth: 40 },
    3: { cellWidth: 40 },
    4: { cellWidth: 40 },
  },
});


  doc.save(`HojaResponsabilidad_${hoja.hojaNo}.pdf`);
};

export default generarPDFHojaResponsabilidad;
