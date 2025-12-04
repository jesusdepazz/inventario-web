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
        marginBottom: 10,
        position: "relative",
    },
    logo: {
        width: 125,
        height: 125,
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
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 20,
                        marginTop: -35,
                    }}
                >
                    <Image
                        src="/logo_guandy.png"
                        style={{
                            width: 90,
                            height: 135,
                            objectFit: "contain",
                            marginTop: -10,
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: -15,
                        }}
                    >
                        <Text style={{ fontSize: 12, fontWeight: "bold", marginVertical: 3 }}>
                            Guatemalan Candies, S.A.
                        </Text>

                        <Text style={{ fontSize: 10, marginVertical: 2 }}>
                            Administración de Activos Fijos
                        </Text>

                        <Text style={{ fontSize: 10, marginVertical: 2 }}>
                            Solvencia de Equipo de Cómputo
                        </Text>

                    </View>

                    <View
                        style={{
                            alignItems: "flex-end",
                            marginTop: -15,
                        }}
                    >
                        <Text style={{ fontSize: 10 }}>Solvencia No:</Text>

                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "bold",
                                marginTop: 2,
                                color: "red"
                            }}
                        >
                            {data.solvenciaNo}
                        </Text>
                    </View>
                </View>
                <View style={[styles.section, { marginTop: -15 }]}>
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
                        marginTop: -10,
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
                                width: "35%",
                                textAlign: "right",
                                fontSize: 11,
                                fontWeight: "bold",
                                paddingRight: 4,
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
                                borderBottom: "1px dotted black",
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
                                width: "35%",
                                textAlign: "right",
                                fontSize: 11,
                                fontWeight: "bold",
                                paddingRight: 4,
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
                                borderBottom: "1px dotted black",
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
                                width: "35%",
                                textAlign: "right",
                                fontSize: 11,
                                fontWeight: "bold",
                                paddingRight: 4,
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
                                borderBottom: "1px dotted black",
                            }}
                        >
                            {
                                data.puestoEmpleado
                                    ? data.puestoEmpleado.charAt(0).toUpperCase() +
                                    data.puestoEmpleado.slice(1).toLowerCase()
                                    : ""
                            }
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
                                width: "35%",
                                textAlign: "right",
                                fontSize: 11,
                                fontWeight: "bold",
                                paddingRight: 4,
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
                                borderBottom: "1px dotted black",
                            }}
                        >
                            {
                                data.departamentoEmpleado
                                    ? data.departamentoEmpleado.charAt(0).toUpperCase() +
                                    data.departamentoEmpleado.slice(1).toLowerCase()
                                    : ""
                            }
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
                        marginTop: -5,
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
                        width: "100%",
                        alignItems: "center"
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                            justifyContent: "center",
                            marginBottom: 6
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: "bold",
                                maxWidth: "80%"
                            }}
                        >
                            En este caso NO esté solvente, indique los motivos y cuantificación:
                        </Text>

                        <Text
                            style={{
                                marginLeft: 6
                            }}
                        >
                            _______________________
                        </Text>
                    </View>
                    <Text
                        style={{
                            width: "90%",
                            marginBottom: 6,
                            alignSelf: "flex-start"
                        }}
                    >
                        ________________________________________________________________________________
                    </Text>

                    <Text
                        style={{
                            width: "90%",
                            alignSelf: "flex-start"
                        }}
                    >
                        ________________________________________________________________________________
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
                    <View style={{ flex: 0.6, borderRight: "1px solid #000" }}>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: "bold",
                                textAlign: "center",
                                padding: 4,
                                borderBottom: "1px solid #000",
                                color: "blue",
                                backgroundColor: "#E6F3FF",
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
                                        width: 12,
                                        height: 12,
                                        border: "1px solid #000",
                                    }}
                                />
                                <Text style={{ fontSize: 10 }}>{item}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={{ flex: 0.6, borderRight: "1px solid #000" }}>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: "bold",
                                textAlign: "center",
                                padding: 4,
                                borderBottom: "1px solid #000",
                                color: "blue",
                                backgroundColor: "#E6F3FF",
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
                                        width: 12,
                                        height: 12,
                                        border: "1px solid #000",
                                    }}
                                />
                                <Text style={{ fontSize: 10 }}>{item}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={{ flex: 1.8 }}>
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: "bold",
                                textAlign: "center",
                                padding: 4,
                                borderBottom: "1px solid #000",
                                color: "blue",
                                backgroundColor: "#E6F3FF",
                            }}
                        >
                            Comentarios adicionales de recepción de equipos
                        </Text>

                        {[1, 2, 3].map((line) => (
                            <Text
                                key={line}
                                style={{
                                    padding: 10,
                                    fontSize: 10,
                                    textAlign: "left",
                                    borderBottom: line !== 3 ? "1px solid #ccc" : "none",
                                    minHeight: 20,
                                }}
                            ></Text>
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

