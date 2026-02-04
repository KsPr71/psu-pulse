import { ScreenContainer } from "@/components/screen-container";
import { useConfig } from "@/lib/config-provider";
import { ScrollView, Text, View } from "react-native";

const BASE_CONSUMPTION = {
  motherboardDefault: 40,
  integratedGPU: 25,
  ramDDR4PerModule: 3,
  ramDDR5PerModule: 5,
  pciExpress1x4: 10,
  pciExpress1x8: 15,
  pciExpress1x16: 25,
  opticalDrive: 25,
  fan: 5,
};

export default function ResumenScreen() {
  const { config, result, resultWithOC } = useConfig();

  const calculateTotalTDP = () => {
    let total = 0;

    total += config.motherboard?.powerConsumption ?? BASE_CONSUMPTION.motherboardDefault;

    if (config.cooling) {
      total += config.cooling.pumpPower + config.cooling.fanPower;
    }

    // Processor
    if (config.processor) {
      total += config.processor.watts;
    }

    // GPU (dedicada o integrada)
    total += config.gpu ? config.gpu.watts : BASE_CONSUMPTION.integratedGPU;

    // RAM
    if (config.ramType === "DDR4") {
      total += BASE_CONSUMPTION.ramDDR4PerModule * config.ramModules;
    } else if (config.ramType === "DDR5") {
      total += BASE_CONSUMPTION.ramDDR5PerModule * config.ramModules;
    }

    // Storage
    config.storage.forEach((storage) => {
      total += storage.wattsPerUnit * storage.quantity;
    });

    // PCI Express
    total += BASE_CONSUMPTION.pciExpress1x4 * config.pciExpress1x4;
    total += BASE_CONSUMPTION.pciExpress1x8 * config.pciExpress1x8;
    total += BASE_CONSUMPTION.pciExpress1x16 * config.pciExpress1x16;

    // Optical Drives
    total += BASE_CONSUMPTION.opticalDrive * config.opticalDrives;

    // Fans
    total += BASE_CONSUMPTION.fan * config.fans;

    return total;
  };

  const hasConfiguration =
    config.processor ||
    config.gpu ||
    config.motherboard ||
    config.cooling ||
    config.ramModules > 0 ||
    config.storage.length > 0 ||
    config.opticalDrives > 0 ||
    config.pciExpress1x4 > 0 ||
    config.pciExpress1x8 > 0 ||
    config.pciExpress1x16 > 0 ||
    config.fans > 0;

  const displayResult =
    resultWithOC ??
    (result
      ? { normal: result, overclockAvailable: false, overclocked: undefined }
      : null);

  const totalTDP = calculateTotalTDP();

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1 p-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Resumen</Text>
            <Text className="text-base text-muted text-center">
              Vista general de tu configuración
            </Text>
          </View>

          {!hasConfiguration ? (
            <View className="bg-surface rounded-2xl p-6 border border-border items-center justify-center">
              <Text className="text-lg font-semibold text-foreground text-center">
                No hay configuración
              </Text>
              <Text className="text-base text-muted text-center mt-2">
                Selecciona componentes en la pestaña Calculadora para ver el
                resumen
              </Text>
            </View>
          ) : (
            <>
              {/* Componentes */}
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-xl font-bold text-foreground mb-4">
                  Componentes Seleccionados
                </Text>

                <View className="gap-3">
                  {/* Motherboard */}
                  <View className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg">
                    <View className="flex-1">
                      <Text className="text-base text-foreground">
                        Placa Base
                      </Text>
                      <Text className="text-sm text-muted">
                        {config.motherboard?.tier ?? "Por defecto"}
                      </Text>
                    </View>
                    <Text className="font-semibold text-primary">
                      {config.motherboard?.powerConsumption ?? BASE_CONSUMPTION.motherboardDefault}W
                    </Text>
                  </View>

                  {/* Cooling */}
                  {config.cooling && (
                    <View className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg">
                      <View className="flex-1">
                        <Text className="text-base text-foreground">
                          Refrigeración AIO {config.cooling.size}
                        </Text>
                        <Text className="text-sm text-muted">
                          Bomba + ventiladores
                        </Text>
                      </View>
                      <Text className="font-semibold text-primary">
                        {config.cooling.pumpPower + config.cooling.fanPower}W
                      </Text>
                    </View>
                  )}

                  {/* Processor */}
                  {config.processor && (
                    <View className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          {config.processor.brand} {config.processor.model}
                        </Text>
                        <Text className="text-sm text-muted">
                          {config.processor.socket}
                        </Text>
                      </View>
                      <Text className="font-semibold text-primary">
                        {config.processor.watts}W
                      </Text>
                    </View>
                  )}

                  {/* GPU */}
                  <View className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg">
                    <View className="flex-1">
                      {config.gpu ? (
                        <>
                          <Text className="text-base font-semibold text-foreground">
                            {config.gpu.brand} {config.gpu.model}
                          </Text>
                          {config.gpu.series && (
                            <Text className="text-sm text-muted">
                              {config.gpu.series}
                            </Text>
                          )}
                        </>
                      ) : (
                        <>
                          <Text className="text-base font-semibold text-foreground">
                            Gráfica integrada
                          </Text>
                          <Text className="text-sm text-muted">
                            GPU integrada en CPU/placa base
                          </Text>
                        </>
                      )}
                    </View>
                    <Text className="font-semibold text-primary">
                      {config.gpu ? `${config.gpu.watts}W` : "~25W"}
                    </Text>
                  </View>

                  {/* RAM */}
                  {config.ramModules > 0 && (
                    <View className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          RAM {config.ramType} ({config.ramModules} módulos)
                        </Text>
                        <Text className="text-sm text-muted">
                          {config.ramType === "DDR4"
                            ? `${BASE_CONSUMPTION.ramDDR4PerModule}W por módulo`
                            : `${BASE_CONSUMPTION.ramDDR5PerModule}W por módulo`}
                        </Text>
                      </View>
                      <Text className="font-semibold text-primary">
                        {(config.ramType === "DDR4"
                          ? BASE_CONSUMPTION.ramDDR4PerModule
                          : BASE_CONSUMPTION.ramDDR5PerModule) *
                          config.ramModules}
                        W
                      </Text>
                    </View>
                  )}

                  {/* Storage */}
                  {config.storage.map((item, idx) => (
                    <View
                      key={idx}
                      className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg"
                    >
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          {item.type} ({item.quantity}x)
                        </Text>
                        <Text className="text-sm text-muted">
                          {item.wattsPerUnit}W por unidad
                        </Text>
                      </View>
                      <Text className="font-semibold text-primary">
                        {item.wattsPerUnit * item.quantity}W
                      </Text>
                    </View>
                  ))}

                  {/* PCI Express */}
                  {config.pciExpress1x4 > 0 && (
                    <View className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          PCI Express 1x4 ({config.pciExpress1x4}x)
                        </Text>
                      </View>
                      <Text className="font-semibold text-primary">
                        {BASE_CONSUMPTION.pciExpress1x4 * config.pciExpress1x4}W
                      </Text>
                    </View>
                  )}

                  {config.pciExpress1x8 > 0 && (
                    <View className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          PCI Express 1x8 ({config.pciExpress1x8}x)
                        </Text>
                      </View>
                      <Text className="font-semibold text-primary">
                        {BASE_CONSUMPTION.pciExpress1x8 * config.pciExpress1x8}W
                      </Text>
                    </View>
                  )}

                  {config.pciExpress1x16 > 0 && (
                    <View className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          PCI Express 1x16 ({config.pciExpress1x16}x)
                        </Text>
                      </View>
                      <Text className="font-semibold text-primary">
                        {BASE_CONSUMPTION.pciExpress1x16 *
                          config.pciExpress1x16}
                        W
                      </Text>
                    </View>
                  )}

                  {/* Optical Drives */}
                  {config.opticalDrives > 0 && (
                    <View className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          Unidades Ópticas ({config.opticalDrives}x)
                        </Text>
                      </View>
                      <Text className="font-semibold text-primary">
                        {BASE_CONSUMPTION.opticalDrive * config.opticalDrives}W
                      </Text>
                    </View>
                  )}

                  {/* Fans */}
                  {config.fans > 0 && (
                    <View className="flex-row justify-between items-center py-2 px-3 bg-background rounded-lg">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          Ventiladores ({config.fans}x)
                        </Text>
                      </View>
                      <Text className="font-semibold text-primary">
                        {BASE_CONSUMPTION.fan * config.fans}W
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Total TDP */}
              <View className="bg-primary rounded-2xl p-6 border border-primary">
                <Text className="text-center text-sm font-semibold text-background opacity-80 mb-2">
                  CONSUMO TOTAL
                </Text>
                <Text className="text-center text-5xl font-bold text-background">
                  {totalTDP}W
                </Text>
              </View>

              {/* Recommended PSU */}
              {displayResult && (
                <View className="gap-4">
                  <View className="bg-success rounded-2xl p-4 border-2 border-success">
                    <Text className="text-sm font-semibold text-white opacity-90 mb-1">
                      PSU Recomendado (TDP normal)
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-3xl font-bold text-white">
                          {displayResult.normal.recommendedPSU}W
                        </Text>
                        <Text className="text-sm text-white opacity-80 mt-1">
                          {displayResult.normal.efficiency}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-sm text-white opacity-80">
                          Consumo: {displayResult.normal.totalWatts}W
                        </Text>
                        <Text className="text-lg font-semibold text-white">
                          Margen {Math.round(displayResult.normal.safetyMargin * 100)}%
                        </Text>
                      </View>
                    </View>
                  </View>
                  {displayResult.overclockAvailable &&
                    displayResult.overclocked && (
                    <View className="bg-primary rounded-2xl p-4 border-2 border-primary">
                      <Text className="text-sm font-semibold text-white opacity-90 mb-1">
                        PSU con Overclock (máx. CPU/GPU)
                      </Text>
                      <View className="flex-row justify-between items-center">
                        <View>
                          <Text className="text-3xl font-bold text-white">
                            {displayResult.overclocked.recommendedPSU}W
                          </Text>
                          <Text className="text-sm text-white opacity-80 mt-1">
                            {displayResult.overclocked.efficiency}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-sm text-white opacity-80">
                            Consumo: {displayResult.overclocked.totalWatts}W
                          </Text>
                          <Text className="text-lg font-semibold text-white">
                            Margen {Math.round(displayResult.overclocked.safetyMargin * 100)}%
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
