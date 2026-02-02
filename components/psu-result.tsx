import { View, Text } from "react-native";
import { PSUCalculation } from "@/shared/types";

interface PSUResultProps {
  result: PSUCalculation;
}

export function PSUResult({ result }: PSUResultProps) {
  const getStatusColor = () => {
    const margin = result.safetyMargin;
    if (margin >= 0.25) return "text-success";
    if (margin >= 0.15) return "text-warning";
    return "text-error";
  };

  return (
    <View className="bg-success/10 rounded-2xl p-6 border-2 border-success">
      <Text className="text-center text-sm text-muted mb-2">PSU Recomendado</Text>
      <Text className="text-center text-5xl font-bold text-success mb-1">
        {result.recommendedPSU}W
      </Text>
      <Text className="text-center text-base text-muted mb-4">
        {result.efficiency}
      </Text>

      <View className="bg-background/50 rounded-xl p-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-muted">Consumo total:</Text>
          <Text className="text-sm font-semibold text-foreground">{result.totalWatts}W</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">Margen de seguridad:</Text>
          <Text className={`text-sm font-semibold ${getStatusColor()}`}>
            {Math.round(result.safetyMargin * 100)}%
          </Text>
        </View>
      </View>

      <Text className="text-center text-xs text-muted mt-4">
        Se recomienda una fuente con certificación {result.efficiency} o superior
      </Text>
    </View>
  );
}
