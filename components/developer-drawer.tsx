import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";
import { router } from "expo-router";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import Logo from "./ui/logo";

interface DeveloperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperDrawer({ isOpen, onClose }: DeveloperDrawerProps) {
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();

  const toggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Fondo semitransparente */}
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        onPress={onClose}
      >
        {/* Drawer */}
        <Pressable
          style={{
            flex: 1,
            justifyContent: "flex-start",
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={{
              width: "80%",
              height: "100%",
              backgroundColor: colors.background,
              borderRightColor: colors.border,
              borderRightWidth: 1,
            }}
          >
            <ScrollView
              style={{
                flex: 1,
              }}
              contentContainerStyle={{
                paddingTop: 20,
              }}
            >
              {/* Header */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingBottom: 20,
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                  flexDirection: "row",
                }}
              >
                <Logo width={60} height={60} />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    // marginLeft: 12,

                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: colors.foreground,
                      marginBottom: 4,
                    }}
                  >
                    PSU Pulse
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                    }}
                  >
                    v1.0.0
                  </Text>
                </View>
              </View>

              {/* Modo Oscuro/Claro */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 20,
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 12,
                  }}
                >
                  Apariencia
                </Text>

                <Pressable
                  onPress={toggleTheme}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 12,
                    borderColor: colors.border,
                    borderWidth: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <IconSymbol
                      size={20}
                      name={
                        colorScheme === "dark" ? "moon.fill" : "sun.max.fill"
                      }
                      color={colors.primary}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: colors.foreground,
                      }}
                    >
                      {colorScheme === "dark" ? "Modo Oscuro" : "Modo Claro"}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 50,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor:
                        colorScheme === "dark" ? colors.primary : colors.border,
                      justifyContent: "center",
                      paddingHorizontal: 2,
                    }}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: colors.background,
                        marginLeft: colorScheme === "dark" ? 22 : 0,
                      }}
                    />
                  </View>
                </Pressable>
              </View>
              {/* Información del Desarrollador */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 20,
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 12,
                  }}
                >
                  Desarrollador
                </Text>

                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 12,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.foreground,
                      marginBottom: 4,
                    }}
                  >
                    Jorge A. Casares Delgado
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                      marginBottom: 8,
                    }}
                  >
                    Full Stack Developer
                  </Text>

                  {/* Contacto */}
                  <View
                    style={{
                      gap: 8,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTopColor: colors.border,
                      borderTopWidth: 1,
                    }}
                  >
                    <Pressable
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <IconSymbol
                        size={16}
                        name="envelope.fill"
                        color={colors.primary}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.primary,
                        }}
                      >
                        jorgealejandrocasaresdelgado@gmail.com
                      </Text>
                    </Pressable>

                    <Pressable
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <IconSymbol
                        size={16}
                        name="phone.fill"
                        color={colors.primary}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.primary,
                        }}
                      >
                        +5352708602
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Acerca de */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 12,
                  }}
                >
                  Acerca de
                </Text>

                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 12,
                    borderColor: colors.border,
                    borderWidth: 1,
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.foreground,
                      lineHeight: 18,
                    }}
                  >
                    PSU Pulse es una aplicación para calcular la fuente de
                    alimentación (PSU) requerida para tu PC.
                  </Text>

                  <Pressable
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: colors.primary,
                      borderRadius: 8,
                      marginTop: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: colors.background,
                        textAlign: "center",
                      }}
                      onPress={() => {
                        router.push("/info");
                        onClose();
                      }}
                    >
                      Información Completa
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>

            {/* Botón de Cerrar */}
            <Pressable
              onPress={onClose}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderTopColor: colors.border,
                borderTopWidth: 1,
                backgroundColor: colors.surface,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                Cerrar
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
