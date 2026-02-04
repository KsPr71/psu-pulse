import {
    PCConfiguration,
    PSUCalculation,
    PSUCalculationWithOC,
} from "@/shared/types";

// Consumos base cuando no hay datos específicos
const BASE_CONSUMPTION = {
  motherboardDefault: 40, // Fallback si no hay placa seleccionada
  integratedGPU: 25, // Gráfica integrada en CPU/placa base (~15-35W)
  ramDDR4PerModule: 3,
  ramDDR5PerModule: 5,
  pciExpress1x4: 10,
  pciExpress1x8: 15,
  pciExpress1x16: 25,
  opticalDrive: 25,
  fan: 5,
};

const SAFETY_MARGIN = 0.25;

/**
 * Calcula consumo base (placa, RAM, storage, PCIe, ópticas, ventiladores, refrigeración)
 * Excluye CPU y GPU para poder variar entre TDP normal y overclock
 */
function getBaseConsumption(config: PCConfiguration): number {
  let total = 0;

  // Motherboard - usa powerConsumption del tier seleccionado
  if (config.motherboard) {
    total += config.motherboard.powerConsumption;
  } else {
    total += BASE_CONSUMPTION.motherboardDefault;
  }

  // RAM
  if (config.ramType === "DDR4") {
    total += BASE_CONSUMPTION.ramDDR4PerModule * config.ramModules;
  } else if (config.ramType === "DDR5") {
    total += BASE_CONSUMPTION.ramDDR5PerModule * config.ramModules;
  }

  // Almacenamiento
  config.storage.forEach((s) => {
    total += s.wattsPerUnit * s.quantity;
  });

  // PCI Express
  total += BASE_CONSUMPTION.pciExpress1x4 * config.pciExpress1x4;
  total += BASE_CONSUMPTION.pciExpress1x8 * config.pciExpress1x8;
  total += BASE_CONSUMPTION.pciExpress1x16 * config.pciExpress1x16;
  total += BASE_CONSUMPTION.opticalDrive * config.opticalDrives;

  // Ventiladores adicionales
  total += BASE_CONSUMPTION.fan * config.fans;

  // Refrigeración AIO - consumo de bomba + ventiladores (NO maxTdpDissipation)
  if (config.cooling) {
    total += config.cooling.pumpPower + config.cooling.fanPower;
  }

  return total;
}

function buildPSUResult(totalWatts: number): PSUCalculation {
  const recommendedWatts = Math.ceil(totalWatts * (1 + SAFETY_MARGIN));
  const recommendedPSU = getStandardPSUWattage(recommendedWatts);
  const efficiency = getRecommendedEfficiency(recommendedPSU);
  return {
    totalWatts: Math.round(totalWatts),
    recommendedPSU,
    efficiency,
    safetyMargin: SAFETY_MARGIN,
  };
}

/**
 * Calcula el consumo total y recomienda PSU (modo normal)
 */
export function calculatePSU(config: PCConfiguration): PSUCalculation {
  let totalWatts = getBaseConsumption(config);

  if (config.processor) totalWatts += config.processor.watts;
  if (config.gpu) {
    totalWatts += config.gpu.watts;
  } else {
    totalWatts += BASE_CONSUMPTION.integratedGPU; // Gráfica integrada
  }

  return buildPSUResult(totalWatts);
}

/**
 * Calcula ambos resultados: normal y overclock (si la placa lo permite)
 */
export function calculatePSUWithOverclock(
  config: PCConfiguration
): PSUCalculationWithOC {
  const baseWatts = getBaseConsumption(config);

  const cpuWatts = config.processor?.watts ?? 0;
  const gpuWatts = config.gpu?.watts ?? BASE_CONSUMPTION.integratedGPU;
  const totalNormal = baseWatts + cpuWatts + gpuWatts;

  const supportsOverclock =
    config.motherboard?.supportsOverclock ?? false;
  const hasOverclockData =
    (config.processor?.maxPowerOc != null) ||
    (config.gpu != null && config.gpu.maxPowerOc != null);

  const overclockAvailable = supportsOverclock && hasOverclockData;

  let overclocked: PSUCalculation | undefined;

  if (overclockAvailable) {
    const cpuOc = config.processor?.maxPowerOc ?? config.processor?.watts ?? 0;
    const gpuOc = config.gpu
      ? (config.gpu.maxPowerOc ?? config.gpu.watts)
      : BASE_CONSUMPTION.integratedGPU; // iGPU sin overclock significativo
    const totalOc = baseWatts + cpuOc + gpuOc;
    overclocked = buildPSUResult(totalOc);
  }

  return {
    normal: buildPSUResult(totalNormal),
    overclocked,
    overclockAvailable,
  };
}

/**
 * Redondea al valor estándar de PSU más cercano
 */
function getStandardPSUWattage(watts: number): number {
  const standardWattages = [
    300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 1000, 1200, 1300, 1500, 1600,
    2000,
  ];

  for (const standard of standardWattages) {
    if (watts <= standard) {
      return standard;
    }
  }

  // Si excede el máximo, retornar el siguiente múltiplo de 500
  return Math.ceil(watts / 500) * 500;
}

/**
 * Determina la eficiencia recomendada según el wattaje
 */
function getRecommendedEfficiency(
  watts: number
): "80+ Bronze" | "80+ Silver" | "80+ Gold" | "80+ Platinum" | "80+ Titanium" {
  if (watts >= 1000) {
    return "80+ Platinum";
  } else if (watts >= 750) {
    return "80+ Gold";
  } else if (watts >= 550) {
    return "80+ Silver";
  } else {
    return "80+ Bronze";
  }
}

/**
 * Valida que la configuración tenga componentes mínimos
 */
export function validateConfiguration(config: PCConfiguration): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.processor) {
    errors.push("Debe seleccionar un procesador");
  }

  // GPU es opcional: null = gráfica integrada

  if (!config.ramType || config.ramModules === 0) {
    errors.push("Debe configurar la memoria RAM");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
