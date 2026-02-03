import { Processor, GPU, StorageType } from "@/shared/types";
import { COMPONENTS_DATA_URL } from "@/constants/const";

let cachedData: {
  processors: Processor[];
  gpus: GPU[];
  storageTypes: StorageType[];
} | null = null;

/** URL local para desarrollo cuando Supabase no está disponible */
const FALLBACK_URL = "/data/components.json";

async function loadData() {
  if (cachedData) {
    return cachedData;
  }

  const url = COMPONENTS_DATA_URL;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Fallback a JSON local si Supabase falla (ej. archivo no subido aún)
      if (url !== FALLBACK_URL) {
        console.warn(
          `Supabase unreachable (${response.status}), trying local fallback`
        );
        const fallback = await fetch(FALLBACK_URL);
        if (fallback.ok) {
          cachedData = await fallback.json();
          return cachedData;
        }
      }
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    cachedData = await response.json();
    return cachedData;
  } catch (error) {
    // Fallback si fetch a Supabase falla por red/CORS
    if (url !== FALLBACK_URL) {
      try {
        const fallback = await fetch(FALLBACK_URL);
        if (fallback.ok) {
          cachedData = await fallback.json();
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
  return data?.storageTypes || []
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
