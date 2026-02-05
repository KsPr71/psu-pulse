import { COMPONENTS_DATA_URL } from "@/constants/const";
import {
  AiOCooler,
  GPU,
  MotherboardTier,
  Processor,
  RamModule,
  StorageType,
} from "@/shared/types";

interface RawProcessor {
  id: number;
  brand: string;
  socket: string;
  model: string;
  series?: string;
  tdp?: number;
  watts?: number;
  max_power_oc?: number;
}

interface RawGPU {
  id: number;
  brand: string;
  model: string;
  series?: string | null;
  tdp?: number;
  watts?: number;
  max_power_oc?: number;
}

interface RawMotherboard {
  id: number;
  tier: string;
  chipsetExamples: string;
  powerConsumption: number;
  additionalRGBPower: number;
  cpuPowerLimit: number;
  description: string;
  [key: string]: unknown;
}

interface RawRamModule {
  id: number;
  type: string;
  speed: string;
  powerPerModule: number;
  maxPowerPerModule: number;
  description?: string | null;
}

let cachedData: {
  processors: Processor[];
  gpus: GPU[];
  storageTypes: StorageType[];
  motherboardTiers: MotherboardTier[];
  aioCoolers: AiOCooler[];
  ramModules: RamModule[];
} | null = null;

/** URL local para desarrollo cuando Supabase no está disponible */
const FALLBACK_URL = "/data/components.json";

function normalizeProcessor(p: RawProcessor): Processor {
  const watts = p.tdp ?? p.watts ?? 0;
  return {
    id: p.id,
    brand: p.brand,
    socket: p.socket,
    model: p.model,
    series: p.series,
    watts,
    maxPowerOc: p.max_power_oc,
  };
}

function normalizeGpu(g: RawGPU): GPU {
  const watts = g.tdp ?? g.watts ?? 0;
  return {
    id: g.id,
    brand: g.brand,
    model: g.model,
    series: g.series,
    watts,
    maxPowerOc: g.max_power_oc,
  };
}

function normalizeRamModule(r: RawRamModule): RamModule {
  return {
    id: r.id,
    type: (r.type === "DDR5" ? "DDR5" : "DDR4") as "DDR4" | "DDR5",
    speed: r.speed ?? "",
    powerPerModule: r.powerPerModule ?? 3,
    maxPowerPerModule: r.maxPowerPerModule ?? 5,
    description: r.description,
  };
}

function normalizeMotherboard(m: RawMotherboard): MotherboardTier {
  const tier = (m.tier ?? "").toLowerCase();
  const supportsOverclock =
    tier.includes("alta") || tier.includes("extrema");
  return {
    id: m.id,
    tier: m.tier,
    chipsetExamples: m.chipsetExamples,
    powerConsumption: m.powerConsumption,
    additionalRGBPower: m.additionalRGBPower,
    cpuPowerLimit: m.cpuPowerLimit,
    description: m.description,
    supportsOverclock,
  };
}

async function loadData() {
  if (cachedData) {
    return cachedData;
  }

  const url = COMPONENTS_DATA_URL;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (url !== FALLBACK_URL) {
        console.warn(
          `Supabase unreachable (${response.status}), trying local fallback`
        );
        const fallback = await fetch(FALLBACK_URL);
        if (fallback.ok) {
          const raw = await fallback.json();
          cachedData = transformData(raw);
          return cachedData;
        }
      }
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    const raw = await response.json();
    cachedData = transformData(raw);
    return cachedData;
  } catch (error) {
    if (url !== FALLBACK_URL) {
      try {
        const fallback = await fetch(FALLBACK_URL);
        if (fallback.ok) {
          const raw = await fallback.json();
          cachedData = transformData(raw);
          return cachedData;
        }
      } catch {
        // ignore
      }
    }
    console.error("Error loading data:", error);
    throw error;
  }
}

function transformData(raw: Record<string, unknown>) {
  const processors = ((raw.processors as RawProcessor[]) || []).map(normalizeProcessor);
  const gpus = ((raw.gpus as RawGPU[]) || []).map(normalizeGpu);
  const storageTypes = ((raw.storageTypes as StorageType[]) || []).map((s) => ({
    ...s,
    wattsPerUnit: s.wattsPerUnit ?? 0,
  }));
  const motherboardTiers = ((raw.motherboardTiers as RawMotherboard[]) || []).map(
    normalizeMotherboard
  );
  const aioCoolers = (raw.aioCoolers as AiOCooler[]) || [];
  const ramModules = ((raw.ramModules as RawRamModule[]) || []).map(normalizeRamModule);

  return {
    processors,
    gpus,
    storageTypes,
    motherboardTiers,
    aioCoolers,
    ramModules,
  };
}

export async function getProcessors(): Promise<Processor[]> {
  const data = await loadData();
  return data?.processors || [];
}

export async function getGPUs(): Promise<GPU[]> {
  const data = await loadData();
  return data?.gpus || [];
}

export async function getStorageTypes(): Promise<StorageType[]> {
  const data = await loadData();
  return data?.storageTypes || [];
}

export async function getMotherboardTiers(): Promise<MotherboardTier[]> {
  const data = await loadData();
  return data?.motherboardTiers || [];
}

export async function getAiOCoolers(): Promise<AiOCooler[]> {
  const data = await loadData();
  return data?.aioCoolers || [];
}

export async function getRamModules(): Promise<RamModule[]> {
  const data = await loadData();
  return data?.ramModules || [];
}

export async function getProcessorsByBrand(brand: string): Promise<Processor[]> {
  const processors = await getProcessors();
  return processors.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
}

export async function getGPUsByBrand(brand: string): Promise<GPU[]> {
  const gpus = await getGPUs();
  return gpus.filter((g) => g.brand.toLowerCase() === brand.toLowerCase());
}

export async function getProcessorBrands(): Promise<string[]> {
  const processors = await getProcessors();
  const brands = [...new Set(processors.map((p) => p.brand))];
  return brands.sort();
}

export async function getGPUBrands(): Promise<string[]> {
  const gpus = await getGPUs();
  const brands = [...new Set(gpus.map((g) => g.brand))];
  return brands.sort();
}
