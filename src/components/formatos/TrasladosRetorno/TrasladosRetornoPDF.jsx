import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: "Helvetica",
    },

    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 25,
    },

    colLeft: {
        width: "25%",
        alignItems: "flex-start",
    },

    colCenter: {
        width: "50%",
        alignItems: "center",
        textAlign: "center",
    },

    colRight: {
        width: "25%",
        alignItems: "flex-end",
    },

    logo: {
        width: 80,
        height: 80,
    },

    companyName: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        color: "black",
    },

    registro: {
        fontSize: 12,
        textAlign: "center",
        fontWeight: "bold",
        color: "black",
    },

    paseSalida: {
        fontSize: 12,
        textAlign: "center",
        fontWeight: "bold",
        color: "black",
    },

    correlativo: {
        fontSize: 12,
        fontWeight: "bold",
        color: "red",
        textAlign: "right",
    },

    tableContainer: {
        width: "100%",
        border: "1px solid #000",
        marginBottom: 0,
    },

    tableRow: {
        flexDirection: "row",
    },

    tableCellLabel: {
        width: "40%",
        backgroundColor: "#e6e6e6",
        padding: 6,
        borderRight: "1px solid #000",
        fontWeight: "bold",
    },

    tableCellValue: {
        width: "60%",
        padding: 6,
    },

    tableHeaderFull: {
        width: "100%",
        backgroundColor: "black",
        padding: 6,
    },

    tableHeaderText: {
        color: "white",
        fontSize: 11,
        fontWeight: "bold",
        textAlign: "center",
    },

    tableGrid: {
        width: "100%",
        borderLeft: "1px solid #000",
        borderRight: "1px solid #000",
        borderBottom: "1px solid #000",
    },

    gridRow: {
        flexDirection: "row",
        width: "100%",
    },

    gridCell: {
        width: "22%",
        borderRight: "1px solid #000",
        borderTop: "1px solid #000",
        padding: 4,
        minHeight: 20,
    },

    gridCellWide: {
        width: "34%",
        borderTop: "1px solid #000",
        padding: 4,
        minHeight: 20,
    },

    smallText: {
        fontSize: 8,
    },

    autoCell: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        borderRight: "1px solid #000",
        borderTop: "1px solid #000",
        padding: 4,
    },
    fillCell: {
        flex: 1,
        borderTop: "1px solid #000",
        padding: 4,
    },
});

const formatSpanishDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const dias = [
        "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado",
    ];

    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ];

    const diaSemana = dias[date.getDay()];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();

    return `${capitalizeFirstWord(diaSemana)}, ${dia} de ${mes} del ${año}`;
};

const capitalizeFirstWord = (text = "") => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const PdfTraslados = ({ data = {} }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.headerContainer}>
                <View style={styles.colLeft}>
                    <Image src="/logo_guandy.png" style={styles.logo} />
                </View>

                <View style={styles.colCenter}>
                    <Text style={styles.companyName}>Guatemalan Candies, S.A</Text>
                    <Text style={styles.registro}>Registro</Text>
                    <Text style={styles.paseSalida}>Pase de Salida con Retorno</Text>
                </View>

                <View style={styles.colRight}>
                    <Text style={styles.correlativo}>
                        Correlativo Serie “B” No. {data?.no || ""}
                    </Text>
                </View>
            </View>
            <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellLabel}>Fecha de solicitud</Text>
                    <Text style={styles.tableCellValue}>
                        {formatSpanishDate(data?.fechaPase)}
                    </Text>
                </View>
            </View>
            <View style={styles.tableHeaderFull}>
                <Text style={styles.tableHeaderText}>
                    1) DATOS DE LA EMPRESA QUE RETIRA EQUIPO/COMPONENTE:
                </Text>
            </View>
            <View style={styles.tableGrid}>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridCell, styles.smallText]}>Codigo de proveedor: </Text>
                    <Text style={[styles.gridCell, styles.smallText]}></Text>
                    <Text style={[styles.gridCell, styles.smallText]}>Nombre de Proveedor:</Text>
                    <Text style={[styles.gridCellWide, styles.smallText]}></Text>
                </View>

                <View style={styles.gridRow}>
                    <Text style={[styles.gridCell, styles.smallText]}>Telefono de proveedor: </Text>
                    <Text style={[styles.gridCell, styles.smallText]}></Text>
                    <Text style={[styles.gridCell, styles.smallText]}>Nombre de contacto: </Text>
                    <Text style={[styles.gridCellWide, styles.smallText]}></Text>
                </View>

                <View style={styles.gridRow}>
                    <Text style={[styles.gridCell, styles.smallText]}>Persona que retira Equipo: </Text>
                    <Text style={[styles.gridCell, styles.smallText]}></Text>
                    <Text style={[styles.gridCell, styles.smallText]}>No. de DPI/Licencia: </Text>
                    <Text style={[styles.gridCellWide, styles.smallText]}></Text>
                </View>
            </View>
            <View style={styles.tableHeaderFull}>
                <Text style={styles.tableHeaderText}>
                    2) DETALLES DEL TRABAJO
                </Text>
            </View>

            <View style={styles.tableGrid}>
                <View style={styles.gridRow}>
                    <Text style={[styles.autoCell]}>
                        Descripción del trabajo a realizar:
                    </Text>
                    <Text style={[styles.fillCell]}>
                    </Text>
                </View>
            </View>
            <View style={styles.tableHeaderFull}>
                <Text style={styles.tableHeaderText}>
                    3) DETALLES DEL EQUIPO
                </Text>
            </View>

            <View style={styles.tableGrid}>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridCell, { width: "50%" }]}>
                    </Text>
                    <Text style={[styles.gridCellWide, { width: "50%" }]}>
                    </Text>
                </View>
            </View>
            <View style={styles.tableHeaderFull}>
                <Text style={styles.tableHeaderText}>
                    4) OBSERVACIONES
                </Text>
            </View>
            <View style={styles.tableGrid}>
                <View
                    style={{
                        width: "100%",
                        borderTop: "1px solid #000",
                        minHeight: 45,
                        padding: 6,
                    }}
                >
                    <Text></Text>
                </View>
            </View>

            <View style={styles.tableGrid}>
                <View style={[styles.gridRow, { borderTop: "1px solid #000" }]}>
                    <Text style={[styles.gridCell, {
                        width: "50%",
                        backgroundColor: "black",
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold"
                    }]}>
                        5) EGRESO
                    </Text>

                    <Text style={[styles.gridCell, {
                        width: "50%",
                        backgroundColor: "black",
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                        borderRight: "none"
                    }]}>
                        6) RETORNO TOTAL
                    </Text>
                </View>
                <View style={[styles.gridRow, { borderTop: "1px solid #000" }]}>
                    <View style={{ width: "50%", borderRight: "1px solid #000" }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <View
                                key={i}
                                style={{
                                    borderBottom: "1px solid #000",
                                    minHeight: 20,
                                    padding: 4
                                }}
                            >
                                <Text></Text>
                            </View>
                        ))}
                    </View>
                    <View style={{ width: "50%" }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <View
                                key={i}
                                style={{
                                    borderBottom: "1px solid #000",
                                    minHeight: 24,
                                    padding: 4
                                }}
                            >
                                <Text></Text>
                            </View>
                        ))}
                    </View>

                </View>
            </View>

        </Page>
    </Document>
);

export default PdfTraslados;
