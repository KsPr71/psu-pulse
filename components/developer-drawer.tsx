import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";
import { router } from "expo-router";
import { useEffect } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { IconSymbol } from "./ui/icon-symbol";
import Logo from "./ui/logo";

const DRAWER_WIDTH_PERCENT = 0.8;
const ANIMATION_DURATION = 280;
const SWIPE_THRESHOLD = 0.25;

interface DeveloperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperDrawer({ isOpen, onClose }: DeveloperDrawerProps) {
  const colors = useColors();
  const { width: screenWidth } = useWindowDimensions();
  const drawerWidth = screenWidth * DRAWER_WIDTH_PERCENT;
  const { colorScheme, setColorScheme } = useThemeContext();

  const translateX = useSharedValue(-drawerWidth);
  const backdropOpacity = useSharedValue(0);

  const toggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const closeDrawer = () => {
    translateX.value = withTiming(
      -drawerWidth,
      { duration: ANIMATION_DURATION },
      () => {
        runOnJS(onClose)();
      }
    );
    backdropOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
  };

  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(0, { duration: ANIMATION_DURATION });
      backdropOpacity.value = withTiming(0.5, { duration: ANIMATION_DURATION });
    } else {
      translateX.value = -drawerWidth;
      backdropOpacity.value = 0;
    }
    // translateX/backdropOpacity son refs estables; drawerWidth no debe retriggear
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const panGesture = Gesture.Pan()
    .activeOffsetX(-15)
    .failOffsetY([-20, 20])
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = e.translationX;
        backdropOpacity.value = 0.5 * (1 + e.translationX / drawerWidth);
      }
    })
    .onEnd((e) => {
      const shouldClose =
        e.translationX < -drawerWidth * SWIPE_THRESHOLD ||
        e.velocityX < -300;
      if (shouldClose) {
        translateX.value = withTiming(
          -drawerWidth,
          { duration: ANIMATION_DURATION },
          () => {
            runOnJS(onClose)();
          }
        );
        backdropOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
      } else {
        translateX.value = withTiming(0, { duration: ANIMATION_DURATION });
        backdropOpacity.value = withTiming(0.5, { duration: ANIMATION_DURATION });
      }
    });

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={closeDrawer}
    >
      <View style={{ flex: 1 }}>
        {/* Fondo semitransparente - cubre toda la pantalla */}
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onPress={closeDrawer}
        >
          <Animated.View
            style={[
              {
                flex: 1,
                backgroundColor: "black",
              },
              backdropAnimatedStyle,
            ]}
          />
        </Pressable>

        {/* Drawer con gestos */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
                top: 0,
                width: drawerWidth,
                height: "100%",
                backgroundColor: colors.background,
                borderRightColor: colors.border,
                borderRightWidth: 1,
              },
              drawerAnimatedStyle,
            ]}
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={(e) => e.stopPropagation()}
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
                    onPress={() => {
                      router.push("/info");
                      closeDrawer();
                    }}
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
                    >
                      Información Completa
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>

            {/* Botón de Cerrar */}
            <Pressable
              onPress={closeDrawer}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderTopColor: colors.border,
                borderTopWidth: 1,
                backgroundColor: colors.surface,
                marginBottom: 30,
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
          </Pressable>
        </Animated.View>
      </GestureDetector>
      </View>
    </Modal>
  );
}
