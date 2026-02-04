import {
    PSUCalculation,
    PSUCalculationWithOC,
} from "@/shared/types";
import { Text, View } from "react-native";

interface PSUResultProps {
  result: PSUCalculationWithOC | PSUCalculation | null;
}

function SingleResult({
  result,
  label,
  variant = "primary",
}: {
  result: PSUCalculation;
  label?: string;
  variant?: "primary" | "secondary";
}) {
  const getStatusColor = () => {
    const margin = result.safetyMargin;
    if (margin >= 0.25) return "text-success";
    if (margin >= 0.15) return "text-warning";
    return "text-error";
  };

  const isPrimary = variant === "primary";
  const borderColor = isPrimary ? "border-success" : "border-primary/50";
  const bgColor = isPrimary ? "bg-success/10" : "bg-primary/5";

  return (
    <View className={`${bgColor} rounded-2xl p-5 border-2 ${borderColor} mb-4`}>
      {label && (
        <Text className="text-center text-xs font-semibold text-muted mb-2 uppercase">
          {label}
        </Text>
      )}
      <Text className="text-center text-sm text-muted mb-1">PSU Recomendado</Text>
      <Text className="text-center text-4xl font-bold text-success mb-1">
        {result.recommendedPSU}W
      </Text>
      <Text className="text-center text-sm text-muted mb-3">{result.efficiency}</Text>

      <View className="bg-background/50 rounded-xl p-3">
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-muted">Consumo total:</Text>
          <Text className="text-sm font-semibold text-foreground">
            {result.totalWatts}W
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-muted">Margen de seguridad:</Text>
          <Text className={`text-sm font-semibold ${getStatusColor()}`}>
            {Math.round(result.safetyMargin * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

export function PSUResult({ result }: PSUResultProps) {
  if (!result) return null;

  const withOC = "normal" in result && result.overclockAvailable;
  const displayResult = "normal" in result ? result.normal : result;

  return (
    <View>
      <SingleResult result={displayResult} label={withOC ? "Cálculo normal (TDP)" : undefined} />

      {withOC && result.overclocked && (
        <SingleResult
          result={result.overclocked}
          label="Con overclock (máx. CPU/GPU)"
          variant="secondary"
        />
      )}

      <Text className="text-center text-xs text-muted mt-2">
        Se recomienda una fuente con certificación {displayResult.efficiency} o superior
      </Text>
    </View>
  );
}
