import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        paddingTop: 20,
        paddingBottom: 18,
        paddingHorizontal: 24,
        fontSize: 10,
        fontFamily: "Helvetica",
    },

    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 14,
    },

    colLeft: {
        width: "22%",
        alignItems: "flex-start",
        justifyContent: "center",
    },

    colCenter: {
        width: "56%",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
    },

    colRight: {
        width: "22%",
        alignItems: "flex-end",
        justifyContent: "flex-start",
    },

    logo: {
        width: 92,
        height: 62,
    },

    companyName: {
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
        color: "black",
    },

    registro: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
        color: "black",
        marginTop: 1,
    },

    paseSalida: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
        color: "black",
        marginTop: 1,
    },

    correlativo: {
        fontSize: 10,
        fontWeight: "bold",
        color: "red",
        textAlign: "right",
        lineHeight: 1.2,
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
        width: "35%",
        backgroundColor: "#e6e6e6",
        padding: 4,
        borderRight: "1px solid #000",
        fontWeight: "bold",
        fontSize: 9,
    },

    tableCellValue: {
        width: "65%",
        padding: 4,
        fontSize: 9,
    },

    tableHeaderFull: {
        width: "100%",
        backgroundColor: "black",
        paddingVertical: 4,
        paddingHorizontal: 6,
    },

    tableHeaderText: {
        color: "white",
        fontSize: 9,
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
        padding: 3,
        minHeight: 18,
        justifyContent: "center",
    },

    gridCellWide: {
        width: "34%",
        borderTop: "1px solid #000",
        padding: 3,
        minHeight: 18,
        justifyContent: "center",
    },

    smallText: {
        fontSize: 7.5,
        lineHeight: 1.25,
    },

    autoCell: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        borderRight: "1px solid #000",
        borderTop: "1px solid #000",
        padding: 4,
        fontSize: 8,
    },

    fillCell: {
        flex: 1,
        borderTop: "1px solid #000",
        padding: 4,
        fontSize: 8,
    },

    multiLineCell: {
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: 3,
        paddingBottom: 3,
    },

    personLine: {
        fontSize: 7.3,
        marginBottom: 1,
        lineHeight: 1.2,
    },

    detailsHeaderCell: {
        backgroundColor: "#003366",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: 3,
        fontSize: 8,
    },

    detailsSubHeaderCell: {
        textAlign: "center",
        fontSize: 8,
        paddingVertical: 3,
        color: "white",
        fontWeight: "bold",
    },

    observationBox: {
        width: "100%",
        borderTop: "1px solid #000",
        minHeight: 32,
        padding: 5,
        justifyContent: "center",
    },

    observationText: {
        fontSize: 8,
        textAlign: "left",
        lineHeight: 1.25,
    },

    signatureHeader: {
        backgroundColor: "black",
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 9,
        paddingVertical: 4,
    },

    signatureColLeft: {
        width: "50%",
        borderRight: "1px solid #000",
    },

    signatureColRight: {
        width: "50%",
    },

    signatureBox: {
        borderBottom: "1px solid #000",
        minHeight: 30,
        paddingHorizontal: 6,
        paddingVertical: 4,
        justifyContent: "flex-start",
    },

    signatureBoxMedium: {
        borderBottom: "1px solid #000",
        minHeight: 40,
        paddingHorizontal: 6,
        paddingVertical: 4,
        justifyContent: "flex-start",
    },

    signatureBoxLarge: {
        borderBottom: "1px solid #000",
        minHeight: 50,
        paddingHorizontal: 6,
        paddingVertical: 4,
        justifyContent: "flex-start",
    },

    signatureTitle: {
        fontSize: 8,
        fontWeight: "bold",
        textDecoration: "underline",
        marginBottom: 2,
    },

    signatureText: {
        fontSize: 8,
        lineHeight: 1.2,
    },

    signatureDateRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
    },

    dateLabel: {
        fontSize: 8,
        fontWeight: "bold",
        textDecoration: "underline",
    },

    dateLine: {
        width: 55,
        borderBottom: "1px solid #000",
        marginLeft: 5,
        height: 10,
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

const PdfTrasladosRetorno = ({ data = {} }) => (
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
                        Correlativo Serie “IT” No. {data?.no || ""}
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
                    1) DATOS DE LA EMPRESA/PERSONA QUE RETIRA EQUIPO/COMPONENTE:
                </Text>
            </View>

            <View style={styles.tableGrid}>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridCell, styles.smallText]}>
                        Codigo de proveedor:
                    </Text>
                    <Text style={[styles.gridCell, styles.smallText]}>
                        {data.codigoProveedor || "-"}
                    </Text>

                    <Text style={[styles.gridCell, styles.smallText]}>
                        Nombre de Proveedor:
                    </Text>
                    <Text style={[styles.gridCellWide, styles.smallText]}>
                        {data.nombreProveedor || "-"}
                    </Text>
                </View>

                <View style={styles.gridRow}>
                    <Text style={[styles.gridCell, styles.smallText]}>
                        Telefono de proveedor:
                    </Text>
                    <Text style={[styles.gridCell, styles.smallText]}>
                        {data.telefonoProveedor || "-"}
                    </Text>

                    <Text style={[styles.gridCell, styles.smallText]}>
                        Nombre de contacto:
                    </Text>

                    <View
                        style={[
                            styles.gridCellWide,
                            styles.multiLineCell,
                            { minHeight: data.empleados?.length > 2 ? 34 : 22 },
                        ]}
                    >
                        {data.empleados?.length ? (
                            data.empleados.map((emp, i) => (
                                <Text key={i} style={styles.personLine}>
                                    - {emp.nombre}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.smallText}>-</Text>
                        )}
                    </View>
                </View>

                <View style={styles.gridRow}>
                    <Text style={[styles.gridCell, styles.smallText]}>
                        Persona que retira Equipo:
                    </Text>

                    <View
                        style={[
                            styles.gridCell,
                            styles.multiLineCell,
                            { minHeight: data.empleados?.length > 2 ? 34 : 22 },
                        ]}
                    >
                        {data.empleados?.length ? (
                            data.empleados.map((emp, i) => (
                                <Text key={i} style={styles.personLine}>
                                    - {emp.nombre}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.smallText}>-</Text>
                        )}
                    </View>

                    <Text style={[styles.gridCell, styles.smallText]}>
                        No. de DPI/Licencia:
                    </Text>

                    <Text
                        style={[
                            styles.gridCellWide,
                            styles.smallText,
                            { justifyContent: "center" },
                        ]}
                    >
                        {data.identificacion || "-"}
                    </Text>
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
                        {data.motivoSalida || "-"}
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
                    <Text
                        style={[
                            styles.gridCell,
                            {
                                width: "12.5%",
                                backgroundColor: "#003366",
                                color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                paddingVertical: 3,
                            },
                        ]}
                    >
                        #
                    </Text>
                    <View style={{ width: "62.5%", borderWidth: 1, borderColor: "#000" }}>
                        <Text
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                borderBottomWidth: 1,
                                paddingVertical: 3,
                                backgroundColor: "#003366",
                                color: "white",
                            }}
                        >
                            DESCRIPCIÓN
                        </Text>

                        <View style={{ flexDirection: "row", width: "100%" }}>
                            {["Código", "Equipo", "Marca", "Modelo", "Serie"].map((t, i) => (
                                <View
                                    key={i}
                                    style={{
                                        width: "20%",
                                        borderRightWidth: i === 4 ? 0 : 1,
                                        borderColor: "#000",
                                        backgroundColor: "#4A90E2",
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            fontSize: 9,
                                            paddingVertical: 3,
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {t}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <Text
                        style={[
                            styles.gridCell,
                            {
                                width: "12.5%",
                                backgroundColor: "#003366",
                                color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                paddingVertical: 3,
                            },
                        ]}
                    >
                        Fecha de retorno
                    </Text>
                    <Text
                        style={[
                            styles.gridCell,
                            {
                                width: "12.5%",
                                backgroundColor: "#003366",
                                color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                paddingVertical: 3,
                            },
                        ]}
                    >
                        Ubicación a retornar
                    </Text>
                </View>
                {(data.equipos && data.equipos.length > 0 ? data.equipos : [{}]).map((eq, index) => (
                    <View style={styles.gridRow} key={index}>
                        <Text
                            style={[
                                styles.gridCell,
                                {
                                    width: "12.5%",
                                    textAlign: "center",
                                    paddingVertical: 4,
                                },
                            ]}
                        >
                            {index + 1}
                        </Text>

                        <View
                            style={{
                                width: "62.5%",
                                borderWidth: 1,
                                borderColor: "#000",
                                flexDirection: "row",
                            }}
                        >
                            {[
                                eq.equipo,
                                eq.descripcionEquipo,
                                eq.marca,
                                eq.modelo,
                                eq.serie,
                            ].map((t, i) => (
                                <View
                                    key={i}
                                    style={{
                                        width: "20%",
                                        borderRightWidth: i === 4 ? 0 : 1,
                                        borderColor: "#000",
                                    }}
                                >
                                    <Text
                                        wrap
                                        style={{
                                            textAlign: "center",
                                            fontSize: 7,
                                            paddingVertical: 4,
                                        }}
                                    >
                                        {t || "-"}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text
                            style={[
                                styles.gridCell,
                                {
                                    width: "12.5%",
                                    textAlign: "center",
                                    paddingVertical: 4,
                                },
                            ]}
                        >
                            {data.fechaRetorno
                                ? new Date(data.fechaRetorno).toLocaleDateString("es-GT")
                                : "-"}
                        </Text>
                        <Text
                            wrap={false}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                                styles.gridCell,
                                {
                                    width: "12.5%",
                                    fontSize: 7,
                                    textAlign: "center",
                                    paddingVertical: 4,
                                },
                            ]}
                        >
                            {data.ubicacionRetorno || "-"}
                        </Text>
                    </View>
                ))}
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
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 9,
                            textAlign: "left",
                            lineHeight: 1.4,
                        }}
                    >
                        {data.observaciones?.trim() || "-"}
                    </Text>
                </View>
            </View>
            <View style={styles.tableGrid}>
                <View style={styles.tableGrid}>
                    <View style={styles.gridRow}>
                        <View style={[styles.signatureColLeft, { borderRight: "1px solid #000" }]}>
                            <Text style={styles.signatureHeader}>5) EGRESO</Text>

                            <View style={styles.signatureBoxMedium}>
                                <Text style={styles.signatureTitle}>AUTORIZADO POR:</Text>
                                <Text style={styles.signatureText}>° Gerardo Araneda</Text>
                                <Text style={styles.signatureText}>° Vanessa Santiago</Text>
                                <Text style={styles.signatureText}>° Rodrigo Araneda</Text>
                                <Text style={styles.signatureText}>° Julio Cajas</Text>
                            </View>

                            <View style={styles.signatureBox}>
                                <Text style={styles.signatureTitle}>SOLICITADO:</Text>
                            </View>

                            <View style={styles.signatureBox}>
                                <Text style={styles.signatureTitle}>PERSONA QUIEN RETIRA:</Text>
                            </View>

                            <View style={styles.signatureBox}>
                                <Text style={styles.signatureTitle}>ENTERADO:</Text>
                            </View>

                            <View style={styles.signatureBoxMedium}>
                                <View style={styles.signatureDateRow}>
                                    <Text style={styles.signatureTitle}>GUARDIA DE SEGURIDAD:</Text>
                                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                        <Text style={styles.dateLabel}>FECHA:</Text>
                                        <View style={styles.dateLine} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.signatureColRight}>
                            <Text style={styles.signatureHeader}>6) RETORNO TOTAL</Text>

                            <View style={styles.signatureBoxMedium}>
                                <View style={styles.signatureDateRow}>
                                    <Text style={styles.signatureTitle}>GUARDIA DE SEGURIDAD:</Text>
                                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                        <Text style={styles.dateLabel}>FECHA:</Text>
                                        <View style={styles.dateLine} />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.signatureBoxLarge}>
                                <Text style={styles.signatureTitle}>PERSONA QUE RECIBE CONFORME:</Text>
                            </View>

                            <View
                                style={{
                                    borderBottom: "1px solid #000",
                                    padding: 6,
                                    flexGrow: 1,
                                    justifyContent: "flex-start",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 9,
                                        textDecoration: "underline",
                                        fontWeight: "bold",
                                    }}
                                >
                                    ENTERADO:
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);

export default PdfTrasladosRetorno;
