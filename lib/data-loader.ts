import { Processor, GPU, StorageType } from "@/shared/types";

let cachedData: {
  processors: Processor[];
  gpus: GPU[];
  storageTypes: StorageType[];
} | null = null;

async function loadData() {
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch("/data/components.json");
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    cachedData = await response.json();
    return cachedData;
  } catch (error) {
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
