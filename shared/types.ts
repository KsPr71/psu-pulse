/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// Tipos para componentes de PC
export interface PCComponent {
  id: number;
  watts: number;
}

export interface Processor {
  id: number;
  brand: string;
  socket: string;
  model: string;
  series?: string;
  watts: number;
  maxPowerOc?: number;
}

export interface GPU {
  id: number;
  brand: string;
  model: string;
  series?: string | null;
  watts: number;
  maxPowerOc?: number;
}

export interface MotherboardTier {
  id: number;
  tier: string;
  chipsetExamples: string;
  powerConsumption: number;
  additionalRGBPower: number;
  cpuPowerLimit: number;
  description: string;
  supportsOverclock: boolean;
}

export interface AiOCooler {
  id: number;
  size: string;
  fanCount: number;
  radiatorThickness: string;
  pumpPower: number;
  fanPower: number;
  totalPower: number;
  maxTdpDissipation: number;
  description: string;
}

export interface StorageItem {
  typeId: number;
  type: string;
  quantity: number;
  wattsPerUnit: number;
}

export interface StorageType {
  id: number;
  type: string;
  wattsPerUnit: number;
  maxPeakPower?: number;
  description?: string | null;
}

export interface PCConfiguration {
  processor: Processor | null;
  gpu: GPU | null;
  motherboard: MotherboardTier | null;
  cooling: AiOCooler | null;
  ramType: "DDR4" | "DDR5" | null;
  ramModules: number;
  storage: StorageItem[];
  pciExpress1x4: number;
  pciExpress1x8: number;
  pciExpress1x16: number;
  opticalDrives: number;
  fans: number;
}

export interface PSUCalculation {
  totalWatts: number;
  recommendedPSU: number;
  efficiency: "80+ Bronze" | "80+ Silver" | "80+ Gold" | "80+ Platinum" | "80+ Titanium";
  safetyMargin: number;
}

/** Resultado con cálculo overclock (cuando la placa lo permite) */
export interface PSUCalculationWithOC {
  normal: PSUCalculation;
  overclocked?: PSUCalculation;
  overclockAvailable: boolean;
}
