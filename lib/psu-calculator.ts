import { PCConfiguration, PSUCalculation } from "@/shared/types";

// Consumos base de componentes en watts
const BASE_CONSUMPTION = {
  motherboard: 80, // Placa base
  ramDDR4PerModule: 3, // RAM DDR4 por módulo
  ramDDR5PerModule: 5, // RAM DDR5 por módulo
  pciExpress1x4: 10, // Tarjeta PCI Express 1x4
  pciExpress1x8: 15, // Tarjeta PCI Express 1x8
  pciExpress1x16: 25, // Tarjeta PCI Express 1x16 (sin GPU)
  opticalDrive: 25, // Unidad óptica
  fan: 5, // Ventilador estándar
};

// Margen de seguridad recomendado (20-30%)
const SAFETY_MARGIN = 0.25; // 25%

/**
 * Calcula el consumo total de energía y recomienda una PSU adecuada
 */
export function calculatePSU(config: PCConfiguration): PSUCalculation {
  let totalWatts = 0;

  // Consumo base de la placa base
  totalWatts += BASE_CONSUMPTION.motherboard;

  // Procesador
  if (config.processor) {
    totalWatts += config.processor.watts;
  }

  // GPU
  if (config.gpu) {
    totalWatts += config.gpu.watts;
  }

  // RAM
  if (config.ramType === "DDR4") {
    totalWatts += BASE_CONSUMPTION.ramDDR4PerModule * config.ramModules;
  } else if (config.ramType === "DDR5") {
    totalWatts += BASE_CONSUMPTION.ramDDR5PerModule * config.ramModules;
  }

  // Almacenamiento
  config.storage.forEach((storage) => {
    totalWatts += storage.wattsPerUnit * storage.quantity;
  });

  // Tarjetas PCI Express
  totalWatts += BASE_CONSUMPTION.pciExpress1x4 * config.pciExpress1x4;
  totalWatts += BASE_CONSUMPTION.pciExpress1x8 * config.pciExpress1x8;
  totalWatts += BASE_CONSUMPTION.pciExpress1x16 * config.pciExpress1x16;

  // Unidades ópticas
  totalWatts += BASE_CONSUMPTION.opticalDrive * config.opticalDrives;

  // Ventiladores
  totalWatts += BASE_CONSUMPTION.fan * config.fans;

  // Calcular PSU recomendado con margen de seguridad
  const recommendedWatts = Math.ceil(totalWatts * (1 + SAFETY_MARGIN));

  // Redondear al valor estándar de PSU más cercano
  const recommendedPSU = getStandardPSUWattage(recommendedWatts);

  // Determinar eficiencia recomendada
  const efficiency = getRecommendedEfficiency(recommendedPSU);

  return {
    totalWatts: Math.round(totalWatts),
    recommendedPSU,
    efficiency,
    safetyMargin: SAFETY_MARGIN,
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

  if (!config.gpu) {
    errors.push("Debe seleccionar una GPU");
  }

  if (!config.ramType || config.ramModules === 0) {
    errors.push("Debe configurar la memoria RAM");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
