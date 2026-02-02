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

export interface StorageItem {
  typeId: number;
  type: string;
  quantity: number;
  wattsPerUnit: number;
}

export interface PCConfiguration {
  processor: { id: number; brand: string; socket: string; model: string; watts: number } | null;
  gpu: { id: number; brand: string; series: string | null; model: string; watts: number } | null;
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
