import { ScreenContainer } from "@/components/screen-container";
import { ScrollView, Text, View } from "react-native";

export default function InfoScreen() {
  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1 p-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="gap-6">
          {/* Header */}
          <View className="items-center gap-2 ">
            <Text className="text-3xl font-bold text-foreground">
              Calculadora de PSU
            </Text>
            <Text className="text-base text-muted text-center">
              Guía de uso y recomendaciones
            </Text>
          </View>

          {/* Cómo usar */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-xl font-bold text-foreground mb-3">
              ¿Cómo usar?
            </Text>
            <Text className="text-base text-foreground leading-relaxed mb-2">
              Esta aplicación te ayuda a calcular la fuente de poder (PSU)
              necesaria para tu PC basándose en los componentes que selecciones.
            </Text>
            <Text className="text-base text-foreground leading-relaxed">
              Simplemente selecciona cada componente de tu configuración y la
              app calculará automáticamente el consumo total y te recomendará
              una PSU adecuada.
            </Text>
          </View>

          {/* Componentes requeridos */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-xl font-bold text-foreground mb-3">
              Componentes Requeridos
            </Text>
            <View className="gap-2">
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">Procesador:</Text> Selecciona
                  la marca y modelo de tu CPU
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">GPU:</Text> Elige tu tarjeta
                  gráfica
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">RAM:</Text> Indica el tipo
                  (DDR4/DDR5) y número de módulos
                </Text>
              </View>
            </View>
          </View>

          {/* Componentes opcionales */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-xl font-bold text-foreground mb-3">
              Componentes Opcionales
            </Text>
            <View className="gap-2">
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">Almacenamiento:</Text> Agrega
                  todos tus discos (HDD, SSD, NVMe)
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">Tarjetas PCI Express:</Text>{" "}
                  Tarjetas de sonido, captura, etc.
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">Unidades ópticas:</Text>{" "}
                  Lectores de CD/DVD/Blu-ray
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">Ventiladores:</Text> Cantidad
                  de ventiladores adicionales
                </Text>
              </View>
            </View>
          </View>

          {/* Margen de seguridad */}
          <View className="bg-success/10 rounded-2xl p-4 border border-success">
            <Text className="text-xl font-bold text-success mb-3">
              Margen de Seguridad
            </Text>
            <Text className="text-base text-foreground leading-relaxed">
              La aplicación añade automáticamente un margen de seguridad del 25%
              sobre el consumo calculado. Esto asegura que tu PSU no trabaje al
              límite de su capacidad, lo cual mejora la eficiencia, reduce el
              ruido y prolonga la vida útil del componente.
            </Text>
          </View>

          {/* Certificaciones */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-xl font-bold text-foreground mb-3">
              Certificaciones 80 Plus
            </Text>
            <Text className="text-base text-foreground leading-relaxed mb-3">
              La aplicación recomienda una certificación de eficiencia según el
              wattaje de tu PSU:
            </Text>
            <View className="gap-2">
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">80+ Bronze:</Text> Para
                  sistemas básicos (hasta 550W)
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">80+ Silver:</Text> Para
                  sistemas medios (550-750W)
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">80+ Gold:</Text> Para sistemas
                  potentes (750-1000W)
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  <Text className="font-semibold">80+ Platinum:</Text> Para
                  sistemas de alto rendimiento (1000W+)
                </Text>
              </View>
            </View>
          </View>

          {/* Consejos */}
          <View className="bg-warning/10 rounded-2xl p-4 border border-warning">
            <Text className="text-xl font-bold text-warning mb-3">
              Consejos Importantes
            </Text>
            <View className="gap-2">
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  No compres una PSU justa al límite del consumo calculado
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  Invierte en una PSU de calidad con buena certificación
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  Considera futuras actualizaciones al elegir el wattaje
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-base text-foreground">•</Text>
                <Text className="text-base text-foreground flex-1">
                  Una PSU de mayor wattaje no consume más energía si no es
                  necesaria
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center py-8">
            <Text className="text-sm text-muted text-center">
              Calculadora de PSU para PC v1.0
            </Text>
            <Text className="text-xs text-muted text-center mt-1">
              Los valores de consumo son aproximados y pueden variar según el
              fabricante
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
