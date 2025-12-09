import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 25,
        fontSize: 10,
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
        position: "relative",
    },
    logo: {
        width: 80,
        height: 110,
    },
    headerCenter: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        textAlign: "center",
    },
    headerTitle: { fontSize: 12, fontWeight: "bold" },
    headerSubtitle: { fontSize: 9 },
    headerRight: { textAlign: "right", fontSize: 9 },

    blue: { color: "blue", fontSize: 10, fontWeight: "bold" }
});

const HojaSolvenciaPDF = ({ data }) => {

    const empleadoParts = data.empleados?.split(" - ") || [];

    data.codigoEmpleado = empleadoParts[0] || "";
    data.nombreEmpleado = empleadoParts[1] || "";
    data.puestoEmpleado = empleadoParts[2] || "";
    data.departamentoEmpleado = empleadoParts[3] || "";

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* HEADER */}
                <View style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    marginTop: -25,
                }}>
                    <Image
                        src="/logo_guandy.png"
                        style={{ width: 70, height: 110, objectFit: "contain" }}
                    />

                    <View style={{ flex: 1, alignItems: "center", marginTop: -10 }}>
                        <Text style={{ fontSize: 11, fontWeight: "bold", marginVertical: 2 }}>
                            Guatemalan Candies, S.A.
                        </Text>
                        <Text style={{ fontSize: 9, marginVertical: 1 }}>
                            Administración de Activos Fijos
                        </Text>
                        <Text style={{ fontSize: 9, marginVertical: 1 }}>
                            Solvencia de Equipo de Cómputo
                        </Text>
                    </View>

                    <View style={{ alignItems: "flex-end", marginTop: -10 }}>
                        <Text style={{ fontSize: 9 }}>Solvencia No:</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold", marginTop: 1, color: "red" }}>
                            {data.solvenciaNo}
                        </Text>
                    </View>
                </View>


                {/* FECHA */}
                <View style={{ marginTop: -5, marginBottom: 10 }}>
                    <Text style={{ textAlign: "center", fontSize: 9, marginBottom: 6 }}>
                        De acuerdo a controles internos el día{" "}
                        <Text style={styles.blue}>
                            {new Date(data.fechaSolvencia).getDate()}
                        </Text>{" "}
                        de{" "}
                        <Text style={styles.blue}>
                            {new Date(data.fechaSolvencia).toLocaleDateString("es-ES", { month: "long" })}
                        </Text>{" "}
                        del{" "}
                        <Text style={styles.blue}>
                            {new Date(data.fechaSolvencia).getFullYear()}
                        </Text>.
                    </Text>

                    <Text style={{
                        textAlign: "center",
                        fontSize: 9,
                        marginBottom: 4,
                        fontWeight: "bold"
                    }}>
                        El infrascrito encargado del departamento de Activos Fijos, Certifica que:
                    </Text>
                </View>
                <View style={{ width: "100%", alignItems: "center", marginBottom: 10 }}>
                    {[
                        { label: "Nombre del empleado:", value: data.nombreEmpleado },
                        { label: "Código del empleado:", value: data.codigoEmpleado },
                        {
                            label: "Quien se desempeñó como:",
                            value:
                                data.puestoEmpleado
                                    ? data.puestoEmpleado.charAt(0).toUpperCase() +
                                    data.puestoEmpleado.slice(1).toLowerCase()
                                    : ""
                        },
                        {
                            label: "En el departamento:",
                            value:
                                data.departamentoEmpleado
                                    ? data.departamentoEmpleado.charAt(0).toUpperCase() +
                                    data.departamentoEmpleado.slice(1).toLowerCase()
                                    : ""
                        }

                    ].map((item, i) => (
                        <View key={i} style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "90%",
                            marginBottom: 5,
                        }}>
                            <Text style={{
                                width: "35%",
                                textAlign: "right",
                                fontSize: 10,
                                fontWeight: "bold",
                                paddingRight: 3,
                            }}>
                                {item.label}
                            </Text>
                            <Text style={{
                                width: "45%",
                                marginLeft: 8,
                                fontSize: 10,
                                color: "blue",
                                fontWeight: "bold",
                                borderBottom: "1px dotted black",
                            }}>
                                {item.value}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* MOBILIARIO */}
                <View
                    style={{
                        backgroundColor: "#DFF3FF",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 4,
                        marginBottom: 10,
                        alignSelf: "center", // ⬅️ centra el bloque
                    }}
                >
                    <Text style={{ fontSize: 10, fontWeight: "bold", textAlign: "center" }}>
                        Quien tenía a cargo: Mobiliario y equipo, según hoja de responsabilidad:
                        <Text style={{ color: "red", fontWeight: "bold" }}> {data.hojaNo}</Text>
                    </Text>
                </View>

                {/* SOLVENTE */}
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -3,
                    marginBottom: 10,
                    gap: 10
                }}>
                    <View style={{
                        width: 30,
                        height: 20,
                        backgroundColor: "#FFD94A",
                        border: "1px solid #000",
                    }} />

                    <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>
                        Está solvente ante el departamento de activos fijos
                    </Text>
                </View>
                <View style={{ marginTop: 10, width: "100%", alignItems: "center" }}>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                            justifyContent: "center",
                            marginBottom: 4,
                        }}
                    >
                        <Text style={{ fontSize: 10, fontWeight: "bold", maxWidth: "80%", textAlign: "center" }}>
                            En este caso NO esté solvente, indique los motivos y cuantificación:
                        </Text>
                    </View>
                    <View style={{ borderBottom: "1px solid #000", height: 14, width: "90%", marginTop: 6 }} />
                    <View style={{ borderBottom: "1px solid #000", height: 14, width: "90%", marginTop: 6 }} />
                    <View style={{ borderBottom: "1px solid #000", height: 14, width: "90%", marginTop: 6 }} />
                </View>
                <View style={{
                    border: "1px solid #000",
                    marginTop: 15,
                    width: "100%",
                    flexDirection: "row",
                }}>
                    <View style={{ flex: 0.6, borderRight: "1px solid #000" }}>
                        <Text style={{
                            fontSize: 9,
                            fontWeight: "bold",
                            textAlign: "center",
                            padding: 3,
                            borderBottom: "1px solid #000",
                            color: "blue",
                            backgroundColor: "#E6F3FF",
                        }}>
                            Estado
                        </Text>

                        {["Bueno", "Regular", "Malo"].map((item, i) => (
                            <View key={i} style={{
                                flexDirection: "row",
                                alignItems: "center",
                                padding: 5,
                            }}>
                                <View style={{ width: 10, height: 10, border: "1px solid #000" }} />
                                <Text style={{ fontSize: 9, marginLeft: 5 }}>{item}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={{ flex: 0.6, borderRight: "1px solid #000" }}>
                        <Text style={{
                            fontSize: 9,
                            fontWeight: "bold",
                            textAlign: "center",
                            padding: 3,
                            borderBottom: "1px solid #000",
                            color: "blue",
                            backgroundColor: "#E6F3FF",
                        }}>
                            Accesorios
                        </Text>

                        {["Completo", "Incompleto", "Otro"].map((item, i) => (
                            <View key={i} style={{
                                flexDirection: "row",
                                alignItems: "center",
                                padding: 5,
                            }}>
                                <View style={{ width: 10, height: 10, border: "1px solid #000" }} />
                                <Text style={{ fontSize: 9, marginLeft: 5 }}>{item}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={{ flex: 1.8 }}>
                        <Text style={{
                            fontSize: 9,
                            fontWeight: "bold",
                            textAlign: "center",
                            padding: 3,
                            borderBottom: "1px solid #000",
                            color: "blue",
                            backgroundColor: "#E6F3FF",
                        }}>
                            Comentarios adicionales
                        </Text>
                    </View>
                </View>
                <View style={{ marginTop: 15, width: "100%" }}>
                    <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 5 }}>
                        Observaciones:
                    </Text>

                    <View style={{ borderBottom: "1px solid #000", height: 15 }} />
                    <View style={{ borderBottom: "1px solid #000", height: 15, marginTop: 5 }} />
                </View>
                <View
                    style={{
                        width: "100%",
                        marginTop: 25,
                        alignItems: "center",
                    }}
                >
                    {[1, 2, 3].map((row) => (
                        <View
                            key={row}
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "95%",
                                marginBottom: 25,
                            }}
                        >
                            {[1, 2].map((col) => {
                                if (row === 1 && col === 1) {
                                    return (
                                        <View key={col} style={{ width: "45%", alignItems: "center" }}>
                                            <View style={{ width: "100%", borderBottom: "1px dotted black", height: 20 }} />

                                            <Text style={{ fontSize: 9, marginTop: 4, textAlign: "center", fontWeight: "bold" }}>
                                                Responsable de quien entrega:
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center", color: "blue" }}>
                                                {data.nombreEmpleado}
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center" }}>
                                                {data.puestoEmpleado}
                                            </Text>
                                        </View>
                                    );
                                }
                                if (row === 1 && col === 2) {
                                    return (
                                        <View key={col} style={{ width: "45%", alignItems: "center" }}>
                                            <View style={{ width: "100%", borderBottom: "1px dotted black", height: 20 }} />

                                            <Text style={{ fontSize: 9, marginTop: 4, textAlign: "center", fontWeight: "bold" }}>
                                                Jefe Inmediato:
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center", color: "blue" }}>
                                                "no informacion"
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center" }}>
                                                "no informacion"
                                            </Text>
                                        </View>
                                    );
                                }
                                if (row === 2 && col === 1) {
                                    return (
                                        <View key={col} style={{ width: "45%", alignItems: "center" }}>
                                            <View style={{ width: "100%", borderBottom: "1px dotted black", height: 20 }} />

                                            <Text style={{ fontSize: 9, marginTop: 4, textAlign: "center", fontWeight: "bold" }}>
                                                Realizado por:
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center", color: "blue" }}>
                                                Kelin Stefani Blanco
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center" }}>
                                                Activos fijos
                                            </Text>
                                        </View>
                                    );
                                }
                                if (row === 2 && col === 2) {
                                    return (
                                        <View key={col} style={{ width: "45%", alignItems: "center" }}>
                                            <View style={{ width: "100%", borderBottom: "1px dotted black", height: 20 }} />

                                            <Text style={{ fontSize: 9, marginTop: 4, textAlign: "center", fontWeight: "bold" }}>
                                                Enterado:
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center", color: "blue" }}>
                                                Rodrigo Araneda
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center" }}>
                                                Recursos Humanos
                                            </Text>
                                        </View>
                                    );
                                }
                                if (row === 3 && col === 1) {
                                    return (
                                        <View key={col} style={{ width: "45%", alignItems: "center" }}>
                                            <View style={{ width: "100%", borderBottom: "1px dotted black", height: 20 }} />

                                            <Text style={{ fontSize: 9, marginTop: 4, textAlign: "center", fontWeight: "bold" }}>
                                                Responsable que revisa y recibe:
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center", color: "blue" }}>
                                                Edwin Giovanni Artiga
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center" }}>
                                                Asistente IT
                                            </Text>
                                        </View>
                                    );
                                }
                                if (row === 3 && col === 2) {
                                    return (
                                        <View key={col} style={{ width: "45%", alignItems: "center" }}>
                                            <View style={{ width: "100%", borderBottom: "1px dotted black", height: 20 }} />

                                            <Text style={{ fontSize: 9, marginTop: 4, textAlign: "center", fontWeight: "bold" }}>
                                                Enterado:
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center", color: "blue" }}>
                                                Carlos Mazariegos
                                            </Text>

                                            <Text style={{ fontSize: 9, textAlign: "center" }}>
                                                Gerente de Sistemas
                                            </Text>
                                        </View>
                                    );
                                }
                                return null;
                            })}
                        </View>
                    ))}
                </View>

            </Page>
        </Document>
    );
};

export default HojaSolvenciaPDF;
