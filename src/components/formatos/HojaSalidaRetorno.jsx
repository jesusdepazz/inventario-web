import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HojaSalidaRetorno = () => {
  const datosTabla3 = [
    ['Fila 1 col 1', 'Fila 1 col 2', 'Fila 1 col 3', 'Fila 1 col 4', 'Fila 1 col 5'],
    ['Fila 2 col 1', 'Fila 2 col 2', 'Fila 2 col 3', 'Fila 2 col 4', 'Fila 2 col 5'],
  ];

  const datosTabla4 = [
    ['Fila 1 col 1', 'Fila 1 col 2', 'Fila 1 col 3', 'Fila 1 col 4', 'Fila 1 col 5'],
  ];

  const handleGenerarPDF = () => {
    const doc = new jsPDF();

    let y = 10;

    autoTable(doc, {
      startY: y,
      head: [['Columna 1', 'Columna 2']],
      body: [
        ['Fila 1, Col 1', 'Fila 1, Col 2'],
        ['Fila 2, Col 1', 'Fila 2, Col 2'],
        ['Fila 3, Col 1', 'Fila 3, Col 2'],
      ],
      theme: 'grid',
      margin: { left: 10, right: 10 },
      styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: y,
      head: [['Columna 1', 'Columna 2']],
      body: [
        ['Fila 1, Col 1', 'Fila 1, Col 2'],
        ['Fila 2, Col 1', 'Fila 2, Col 2'],
      ],
      theme: 'grid',
      margin: { left: 10, right: 10 },
      styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: y,
      head: [['C1', 'C2', 'C3', 'C4', 'C5']],
      body: datosTabla3,
      theme: 'grid',
      margin: { left: 10, right: 10 },
      styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: y,
      head: [['C1', 'C2', 'C3', 'C4', 'C5']],
      body: datosTabla4,
      theme: 'grid',
      margin: { left: 10, right: 10 },
      styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: y,
      head: [['Columna única']],
      body: [
        ['Fila 1'],
        ['Fila 2'],
        ['Fila 3'],
        ['Fila 4'],
      ],
      theme: 'grid',
      margin: { left: 10, right: 10 },
      styles: { fontSize: 10 },
    });

    doc.save('pdf_con_5_tablas.pdf');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Hoja de salida con retorno</h2>
      <button
        onClick={handleGenerarPDF}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        Generar PDF
      </button>
    </div>
  );
};

export default HojaSalidaRetorno;
