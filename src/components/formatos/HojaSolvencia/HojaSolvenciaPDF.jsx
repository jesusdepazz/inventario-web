import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: "Helvetica",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        position: "relative",
    },
    logo: {
        width: 100,
        height: 90,
    },
    headerCenter: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        textAlign: "center",
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: "bold",
    },
    headerSubtitle: {
        fontSize: 10,
    },
    headerRight: {
        textAlign: "right",
        fontSize: 10,
    },

    section: {
        marginBottom: 15,
    },
    label: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    box: {
        border: "1px solid #000",
        padding: 8,
        minHeight: 40,
    },

    employeeContainer: {
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
    },

    line: {
        fontSize: 11,
        marginBottom: 4,
    },

    blue: {
        color: "blue",
        fontSize: 11,
        fontWeight: "bold",
    },

});

const HojaSolvenciaPDF = ({ data }) => {

    const empleadoParts = data.empleados?.split(" - ") || [];

    const codigoEmpleado = empleadoParts[0] || "";
    const nombreEmpleado = empleadoParts[1] || "";
    const puesto = empleadoParts[2] || "";
    const departamento = empleadoParts[3] || "";

    data.nombreEmpleado = nombreEmpleado;
    data.codigoEmpleado = codigoEmpleado;
    data.puestoEmpleado = puesto;
    data.departamentoEmpleado = departamento;


    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>

                    <Image
                        src="/logo_guandy.png"
                        style={{
                            width: 55,
                            height: 75,
                            objectFit: "contain",
                            marginTop: -5
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: -5
                        }}
                    >
                        <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                            Guatemalan Candies, S.A.
                        </Text>
                        <Text style={{ fontSize: 10 }}>
                            Administración de Activos Fijos
                        </Text>
                        <Text style={{ fontSize: 10 }}>
                            Solvencia de Equipo de Cómputo
                        </Text>
                    </View>

                    <View
                        style={{
                            alignItems: "flex-end",
                            marginTop: -5
                        }}
                    >
                        <Text style={{ fontSize: 10 }}>Solvencia No:</Text>
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "bold"
                            }}
                        >
                            {data.solvenciaNo}
                        </Text>
                    </View>

                </View>
                <View style={styles.section}>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 10,
                            marginBottom: 10
                        }}
                    >
                        De acuerdo a controles internos el día{" "}
                        <Text style={{ color: "blue", fontWeight: "bold" }}>
                            {new Date(data.fechaSolvencia).getDate()}
                        </Text>{" "}
                        del mes de{" "}
                        <Text style={{ color: "blue", fontWeight: "bold" }}>
                            {new Date(data.fechaSolvencia).toLocaleDateString("es-ES", { month: "long" })}
                        </Text>{" "}
                        del año{" "}
                        <Text style={{ color: "blue", fontWeight: "bold" }}>
                            {new Date(data.fechaSolvencia).getFullYear()}
                        </Text>.
                    </Text>

                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 10,
                            marginBottom: 5,
                            fontWeight: "bold"
                        }}
                    >
                        El infrascrito encargado del departamento de Activos Fijos, Certifica que:
                    </Text>
                </View>
                <View
                    style={{
                        width: "100%",
                        alignItems: "center",
                        marginTop: 20,
                        marginBottom: 20,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "90%",
                            marginBottom: 8,
                        }}
                    >
                        <Text
                            style={{
                                width: "40%",
                                textAlign: "right",
                                fontSize: 11,
                                fontWeight: "bold",
                            }}
                        >
                            Nombre del empleado:
                        </Text>

                        <Text
                            style={{
                                width: "45%",
                                marginLeft: 10,
                                fontSize: 11,
                                color: "blue",
                                fontWeight: "bold",
                                borderBottom: "1px solid blue",
                            }}
                        >
                            {data.nombreEmpleado}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "90%",
                            marginBottom: 8,
                        }}
                    >
                        <Text
                            style={{
                                width: "40%",
                                textAlign: "right",
                                fontSize: 11,
                                fontWeight: "bold",
                            }}
                        >
                            Código del empleado:
                        </Text>

                        <Text
                            style={{
                                width: "45%",
                                marginLeft: 10,
                                fontSize: 11,
                                color: "blue",
                                fontWeight: "bold",
                                borderBottom: "1px solid blue",
                            }}
                        >
                            {data.codigoEmpleado}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "90%",
                            marginBottom: 8,
                        }}
                    >
                        <Text
                            style={{
                                width: "40%",
                                textAlign: "right",
                                fontSize: 11,
                                fontWeight: "bold",
                            }}
                        >
                            Quien se desempeñó como:
                        </Text>

                        <Text
                            style={{
                                width: "45%",
                                marginLeft: 10,
                                fontSize: 11,
                                color: "blue",
                                fontWeight: "bold",
                                borderBottom: "1px solid blue",
                            }}
                        >
                            {data.puestoEmpleado}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "90%",
                            marginBottom: 8,
                        }}
                    >
                        <Text
                            style={{
                                width: "40%",
                                textAlign: "right",
                                fontSize: 11,
                                fontWeight: "bold",
                            }}
                        >
                            En el departamento:
                        </Text>

                        <Text
                            style={{
                                width: "45%",
                                marginLeft: 10,
                                fontSize: 11,
                                color: "blue",
                                fontWeight: "bold",
                                borderBottom: "1px solid blue",
                            }}
                        >
                            {data.departamentoEmpleado}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: "#DFF3FF",
                        padding: 10,
                        borderRadius: 5,
                        marginBottom: 15,
                    }}
                >
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                        Quien tenía a cargo: Mobiliario y equipo, según hoja de responsabilidad:
                        <Text style={{ color: "red", fontWeight: "bold" }}>  {data.hojaNo}</Text>
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 15,
                        marginBottom: 15,
                        gap: 12
                    }}
                >
                    <View
                        style={{
                            width: 40,
                            height: 25,
                            backgroundColor: "#FFD94A",
                            border: "1px solid #000",
                        }}
                    />

                    <Text style={{ fontSize: 13, fontWeight: "bold", textAlign: "center" }}>
                        Está solvente ante el departamento de activos fijos
                    </Text>

                </View>
                <View
                    style={{
                        marginTop: 15,
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                    <Text style={{ fontSize: 11, fontWeight: "bold", marginBottom: 10 }}>
                        En este caso NO esté solvente, indique los motivos y cuantificación:
                    </Text>

                    <Text style={{ width: "80%", textAlign: "center", marginBottom: 6 }}>
                        ________________________________________________
                    </Text>

                    <Text style={{ width: "80%", textAlign: "center", marginBottom: 6 }}>
                        ________________________________________________
                    </Text>

                    <Text style={{ width: "80%", textAlign: "center" }}>
                        ________________________________________________
                    </Text>
                </View>
                <View
                    style={{
                        border: "1px solid #000",
                        marginTop: 25,
                        width: "100%",
                        flexDirection: "row",
                    }}
                >
                    <View style={{ flex: 1, borderRight: "1px solid #000" }}>
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "bold",
                                textAlign: "center",
                                padding: 4,
                                borderBottom: "1px solid #000",
                            }}
                        >
                            Estado
                        </Text>
                        {["Bueno", "Regular", "Malo"].map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    padding: 6,
                                    gap: 8,
                                }}
                            >
                                <View
                                    style={{
                                        width: 14,
                                        height: 14,
                                        border: "1px solid #000",
                                    }}
                                />
                                <Text style={{ fontSize: 11 }}>{item}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={{ flex: 1, borderRight: "1px solid #000" }}>
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "bold",
                                textAlign: "center",
                                padding: 4,
                                borderBottom: "1px solid #000",
                            }}
                        >
                            Accesorios
                        </Text>

                        {["Completo", "Incompleto", "Otro"].map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    padding: 6,
                                    gap: 8,
                                }}
                            >
                                <View
                                    style={{
                                        width: 14,
                                        height: 14,
                                        border: "1px solid #000",
                                    }}
                                />
                                <Text style={{ fontSize: 11 }}>{item}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={{ flex: 1.2 }}>
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "bold",
                                textAlign: "center",
                                padding: 4,
                                borderBottom: "1px solid #000",
                            }}
                        >
                            Comentarios adicionales de recepción de equipos
                        </Text>

                        {[1, 2, 3].map((line) => (
                            <Text
                                key={line}
                                style={{
                                    padding: 10,
                                    fontSize: 11,
                                    textAlign: "left",
                                    borderBottom: line !== 3 ? "1px solid #ccc" : "none",
                                    minHeight: 22,
                                }}
                            >
                            </Text>
                        ))}
                    </View>
                </View>
                <View style={{ marginTop: 25, width: "100%" }}>
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "bold",
                            marginBottom: 8,
                        }}
                    >
                        Observaciones:
                    </Text>

                    <View
                        style={{
                            borderBottom: "1px solid #000",
                            height: 18,
                        }}
                    />
                </View>
            </Page>
        </Document>
    );
};

export default HojaSolvenciaPDF;

