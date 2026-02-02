import { useState, useRef } from "react";
import { ScrollView, View, Text, ActivityIndicator, Alert, Platform, TouchableOpacity, Pressable } from "react-native";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { PCConfiguration, PSUCalculation } from "@/shared/types";
import { calculatePSU, validateConfiguration } from "@/lib/psu-calculator";
import { ComponentSelector } from "../../components/component-selector";
import { StorageManager } from "../../components/storage-manager";
import { PSUResult } from "../../components/psu-result";
import { useColors } from "@/hooks/use-colors";
import { useProcessors, useGPUs, useStorageTypes } from "@/hooks/use-components";

export default function CalculatorScreen() {
  const colors = useColors();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [config, setConfig] = useState<PCConfiguration>({
    processor: null,
    gpu: null,
    ramType: null,
    ramModules: 0,
    storage: [],
    pciExpress1x4: 0,
    pciExpress1x8: 0,
    pciExpress1x16: 0,
    opticalDrives: 0,
    fans: 0,
  });

  const [result, setResult] = useState<PSUCalculation | null>(null);

  const { data: processors, loading: loadingProcessors } = useProcessors();
  const { data: gpus, loading: loadingGPUs } = useGPUs();
  const { data: storageTypes, loading: loadingStorage } = useStorageTypes();

  const handleCalculate = () => {
    const validation = validateConfiguration(config);
    
    if (!validation.valid) {
      Alert.alert("Configuración incompleta", validation.errors.join("\n"));
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const calculation = calculatePSU(config);
    setResult(calculation);
    
    // Desplazar al resultado después de un pequeño delay
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const handleReset = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setConfig({
      processor: null,
      gpu: null,
      ramType: null,
      ramModules: 0,
      storage: [],
      pciExpress1x4: 0,
      pciExpress1x8: 0,
      pciExpress1x16: 0,
      opticalDrives: 0,
      fans: 0,
    });
    setResult(null);
  };

  const isLoading = loadingProcessors || loadingGPUs || loadingStorage;

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
      <ScrollView ref={scrollViewRef} className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4 gap-4">
          <View className="items-center gap-2 mb-2">
            <Text className="text-3xl font-bold text-foreground">Calculadora de PSU</Text>
            <Text className="text-base text-muted text-center">
              Selecciona los componentes de tu PC para calcular la fuente de energía requerida
            </Text>
          </View>

          {result && <PSUResult result={result} />}

          <ComponentSelector
            title="Procesador"
            items={processors}
            selectedItem={config.processor}
            onSelect={(processor) => setConfig({ ...config, processor })}
            renderItem={(p) => `${p.brand} ${p.model}`}
            groupBy="brand"
          />

          <ComponentSelector
            title="Tarjeta Gráfica (GPU)"
            items={gpus}
            selectedItem={config.gpu}
            onSelect={(gpu) => setConfig({ ...config, gpu })}
            renderItem={(g) => `${g.brand} ${g.model}`}
            groupBy="brand"
          />

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">Memoria RAM</Text>
            <Text className="text-sm text-muted mb-2">Tipo de RAM</Text>
            <View className="flex-row gap-2 mb-4">
              {["DDR4", "DDR5"].map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setConfig({ ...config, ramType: type as any })}
                  className={`flex-1 py-2 px-3 rounded-lg border ${
                    config.ramType === type
                      ? "bg-primary border-primary"
                      : "bg-background border-border"
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      config.ramType === type ? "text-background" : "text-foreground"
                    }`}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="text-sm text-muted mb-2">Número de módulos</Text>
            <View className="flex-row items-center justify-center gap-4">
              <Pressable
                onPress={() =>
                  setConfig({
                    ...config,
                    ramModules: Math.max(0, config.ramModules - 1),
                  })
                }
              >
                <Text className="text-2xl font-bold text-primary px-4 py-2">−</Text>
              </Pressable>
              <Text className="text-3xl font-bold text-foreground w-12 text-center">{config.ramModules}</Text>
              <Pressable
                onPress={() => setConfig({ ...config, ramModules: config.ramModules + 1 })}
              >
                <Text className="text-2xl font-bold text-primary px-4 py-2">+</Text>
              </Pressable>
            </View>
          </View>

          <StorageManager
            storageTypes={storageTypes}
            storage={config.storage}
            onUpdate={(storage) => setConfig({ ...config, storage })}
          />

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">Tarjetas Adicionales (PCI Express)</Text>

            {[
              { key: "pciExpress1x4", label: "PCI Express 1x4" },
              { key: "pciExpress1x8", label: "PCI Express 1x8" },
              { key: "pciExpress1x16", label: "PCI Express 1x16" },
            ].map(({ key, label }) => (
              <View key={key} className="flex-row items-center justify-between mb-3">
                <Text className="text-sm text-muted">{label}</Text>
                <View className="flex-row items-center gap-2">
                  <Pressable
                    onPress={() =>
                      setConfig({
                        ...config,
                        [key]: Math.max(0, (config[key as keyof PCConfiguration] as number) - 1),
                      })
                    }
                  >
                    <Text className="text-lg font-bold text-primary px-2 py-1">−</Text>
                  </Pressable>
                  <Text className="text-lg font-semibold text-foreground w-6 text-center">
                    {(config[key as keyof PCConfiguration] as number).toString()}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setConfig({
                        ...config,
                        [key]: (config[key as keyof PCConfiguration] as number) + 1,
                      })
                    }
                  >
                    <Text className="text-lg font-bold text-primary px-2 py-1">+</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">Otros Componentes</Text>

            {[
              { key: "opticalDrives", label: "Unidades Ópticas" },
              { key: "fans", label: "Ventiladores Adicionales" },
            ].map(({ key, label }) => (
              <View key={key} className="flex-row items-center justify-between mb-3">
                <Text className="text-sm text-muted">{label}</Text>
                <View className="flex-row items-center gap-2">
                  <Pressable
                    onPress={() =>
                      setConfig({
                        ...config,
                        [key]: Math.max(0, (config[key as keyof PCConfiguration] as number) - 1),
                      })
                    }
                  >
                    <Text className="text-lg font-bold text-primary px-2 py-1">−</Text>
                  </Pressable>
                  <Text className="text-lg font-semibold text-foreground w-6 text-center">
                    {(config[key as keyof PCConfiguration] as number).toString()}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setConfig({
                        ...config,
                        [key]: (config[key as keyof PCConfiguration] as number) + 1,
                      })
                    }
                  >
                    <Text className="text-lg font-bold text-primary px-2 py-1">+</Text>
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
            
            {result && (
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
