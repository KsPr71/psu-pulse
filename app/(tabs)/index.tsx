import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  useAiOCoolers,
  useGPUs,
  useMotherboardTiers,
  useProcessors,
  useRamModules,
  useStorageTypes,
} from "@/hooks/use-components";
import { useConfig } from "@/lib/config-provider";
import {
  calculatePSUWithOverclock,
  validateConfiguration,
} from "@/lib/psu-calculator";
import { PCConfiguration, PSUCalculationWithOC } from "@/shared/types";
import { router } from "expo-router";
import { ComponentSelector } from "../../components/component-selector";
import { PSUResult } from "../../components/psu-result";
import { StorageManager } from "../../components/storage-manager";

export default function CalculatorScreen() {
  const colors = useColors();
  const scrollViewRef = useRef<ScrollView>(null);
  const { config, setConfig, setResult, setResultWithOC } = useConfig();
  const [resultWithOC, setLocalResult] = useState<PSUCalculationWithOC | null>(
    null,
  );

  const { data: processors, loading: loadingProcessors } = useProcessors();
  const { data: gpus, loading: loadingGPUs } = useGPUs();
  const { data: storageTypes, loading: loadingStorage } = useStorageTypes();
  const { data: motherboardTiers, loading: loadingMotherboards } =
    useMotherboardTiers();
  const { data: aioCoolers, loading: loadingCoolers } = useAiOCoolers();
  const { data: ramModules, loading: loadingRam } = useRamModules();

  const handleCalculate = () => {
    const validation = validateConfiguration(config);

    if (!validation.valid) {
      Alert.alert("Configuración incompleta", validation.errors.join("\n"));
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const calculation = calculatePSUWithOverclock(config);
    setLocalResult(calculation);
    setResultWithOC(calculation);
    setResult(calculation.normal);

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);

    // Navegar tras confirmar el estado para que Resumen muestre el resultado
    setTimeout(() => router.push("/resumen"), 50);
  };

  const handleReset = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setConfig({
      processor: null,
      gpu: null,
      motherboard: null,
      cooling: null,
      ramModule: null,
      ramModuleCount: 0,
      storage: [],
      pciExpress1x4: 0,
      pciExpress1x8: 0,
      pciExpress1x16: 0,
      opticalDrives: 0,
      fans: 0,
    });
    setLocalResult(null);
    setResultWithOC(null);
    setResult(null);
  };

  const isLoading =
    loadingProcessors ||
    loadingGPUs ||
    loadingStorage ||
    loadingMotherboards ||
    loadingCoolers ||
    loadingRam;

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-muted">Cargando componentes...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="p-4 gap-4">
          <View className="items-center gap-2 mb-2">
            <Text className="text-3xl font-bold text-foreground">
              Calculadora de PSU
            </Text>
            <Text className="text-base text-muted text-center">
              Selecciona los componentes de tu PC para calcular la fuente de
              energía requerida
            </Text>
          </View>

          {resultWithOC && <PSUResult result={resultWithOC} />}

          <ComponentSelector
            title="Procesador"
            items={processors}
            selectedItem={config.processor}
            onSelect={(processor) => setConfig({ ...config, processor })}
            renderItem={(p) => `${p.brand} ${p.model}`}
            groupBy="brand"
          />

          <View className="gap-2">
            <ComponentSelector
              title="Tarjeta Gráfica (GPU)"
              items={gpus}
              selectedItem={config.gpu}
              onSelect={(gpu) => setConfig({ ...config, gpu })}
              renderItem={(g) => `${g.brand} ${g.model}`}
              groupBy="brand"
            />
            <Pressable
              onPress={() => setConfig({ ...config, gpu: null })}
              className={`flex-row items-center justify-center py-2 px-3 rounded-xl border ${
                !config.gpu
                  ? "bg-primary/20 border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  !config.gpu ? "text-primary" : "text-muted"
                }`}
              >
                Usar gráfica integrada (~25W)
              </Text>
            </Pressable>
          </View>

          <ComponentSelector
            title="Placa Base"
            items={motherboardTiers}
            selectedItem={config.motherboard}
            onSelect={(mb) => setConfig({ ...config, motherboard: mb })}
            renderItem={(m) => `${m.tier} — ${m.chipsetExamples}`}
          />

          <ComponentSelector
            title="Refrigeración (AIO)"
            items={aioCoolers}
            selectedItem={config.cooling}
            onSelect={(c) => setConfig({ ...config, cooling: c })}
            renderItem={(c) => `${c.size} — ${c.description}`}
          />

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Memoria RAM
            </Text>
            <ComponentSelector
              title="Tipo de módulo"
              items={ramModules}
              selectedItem={config.ramModule}
              onSelect={(r) => setConfig({ ...config, ramModule: r })}
              renderItem={(r) =>
                `${r.type} ${r.speed} — ${r.powerPerModule}W/módulo`
              }
              groupBy="type"
            />
            {config.ramModule ? (
              <View>
                <Text className="text-sm text-muted mb-2 mt-2">
                  Número de módulos
                </Text>
                <View
                  className="flex-row items-center justify-center gap-4"
                  style={{ opacity: config.ramModule ? 1 : 0.5 }}
                  pointerEvents={config.ramModule ? "auto" : "none"}
                >
                  <Pressable
                    onPress={() =>
                      setConfig({
                        ...config,
                        ramModuleCount: Math.max(0, config.ramModuleCount - 1),
                      })
                    }
                    disabled={!config.ramModule}
                  >
                    <Text className="text-2xl font-bold text-primary px-4 py-2">
                      −
                    </Text>
                  </Pressable>
                  <Text className="text-3xl font-bold text-foreground w-12 text-center">
                    {config.ramModuleCount}
                  </Text>
                  <Pressable
                    onPress={() => {
                      if (config.ramModule && config.ramModuleCount < 8) {
                        setConfig({
                          ...config,
                          ramModuleCount: config.ramModuleCount + 1,
                        });
                      }
                    }}
                    disabled={!config.ramModule || config.ramModuleCount >= 8}
                  >
                    <Text className="text-2xl font-bold text-primary px-4 py-2 style={{ opacity: config.ramModuleCount >= 8 ? 0 : 1 }}">
                      +
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>

          <StorageManager
            storageTypes={storageTypes}
            storage={config.storage}
            onUpdate={(storage) => setConfig({ ...config, storage })}
          />

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Tarjetas Adicionales (PCI Express)
            </Text>

            {[
              { key: "pciExpress1x4", label: "PCI Express 1x4" },
              { key: "pciExpress1x8", label: "PCI Express 1x8" },
              { key: "pciExpress1x16", label: "PCI Express 1x16" },
            ].map(({ key, label }) => (
              <View
                key={key}
                className="flex-row items-center justify-between mb-3"
              >
                <Text className="text-sm text-muted">{label}</Text>
                <View className="flex-row items-center gap-2">
                  <Pressable
                    onPress={() =>
                      setConfig({
                        ...config,
                        [key]: Math.max(
                          0,
                          (config[key as keyof PCConfiguration] as number) - 1,
                        ),
                      })
                    }
                  >
                    <Text className="text-lg font-bold text-primary px-2 py-1">
                      −
                    </Text>
                  </Pressable>
                  <Text className="text-lg font-semibold text-foreground w-6 text-center">
                    {(
                      config[key as keyof PCConfiguration] as number
                    ).toString()}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setConfig({
                        ...config,
                        [key]:
                          (config[key as keyof PCConfiguration] as number) + 1,
                      })
                    }
                  >
                    <Text className="text-lg font-bold text-primary px-2 py-1">
                      +
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Otros Componentes
            </Text>

            {[
              { key: "opticalDrives", label: "Unidades Ópticas" },
              { key: "fans", label: "Ventiladores Adicionales" },
            ].map(({ key, label }) => (
              <View
                key={key}
                className="flex-row items-center justify-between mb-3"
              >
                <Text className="text-sm text-muted">{label}</Text>
                <View className="flex-row items-center gap-2">
                  <Pressable
                    onPress={() =>
                      setConfig({
                        ...config,
                        [key]: Math.max(
                          0,
                          (config[key as keyof PCConfiguration] as number) - 1,
                        ),
                      })
                    }
                  >
                    <Text className="text-lg font-bold text-primary px-2 py-1">
                      −
                    </Text>
                  </Pressable>
                  <Text className="text-lg font-semibold text-foreground w-6 text-center">
                    {(
                      config[key as keyof PCConfiguration] as number
                    ).toString()}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setConfig({
                        ...config,
                        [key]:
                          (config[key as keyof PCConfiguration] as number) + 1,
                      })
                    }
                  >
                    <Text className="text-lg font-bold text-primary px-2 py-1">
                      +
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-4 gap-3">
            <TouchableOpacity
              className="bg-primary rounded-xl py-4 px-6"
              onPress={handleCalculate}
            >
              <Text className="text-background font-semibold text-center text-lg">
                Calcular PSU Requerida
              </Text>
            </TouchableOpacity>

            {resultWithOC && (
              <TouchableOpacity
                className="bg-destructive/20 border border-destructive rounded-xl py-4 px-6"
                onPress={handleReset}
              >
                <Text className="text-destructive font-semibold text-center text-lg">
                  Nuevo Cálculo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
