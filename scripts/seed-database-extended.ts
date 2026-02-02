import { drizzle } from "drizzle-orm/mysql2";
import { processors, gpus, storageTypes } from "../drizzle/schema";

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return drizzle(process.env.DATABASE_URL);
}

async function seedDatabaseExtended() {
  const db = getDb();

  console.log("🌱 Seeding extended database with 10 years of components...");

  // Seed Processors - Intel (2016-2026)
  console.log("Adding Intel processors...");
  const intelProcessors = [
    // 10th Gen (Comet Lake) - 2020
    { brand: "Intel", socket: "LGA1200", model: "Core i9-10900K", watts: 125 },
    { brand: "Intel", socket: "LGA1200", model: "Core i7-10700K", watts: 125 },
    { brand: "Intel", socket: "LGA1200", model: "Core i5-10600K", watts: 95 },
    { brand: "Intel", socket: "LGA1200", model: "Core i5-10400", watts: 65 },
    
    // 9th Gen (Coffee Lake Refresh) - 2018-2019
    { brand: "Intel", socket: "LGA1151", model: "Core i9-9900K", watts: 95 },
    { brand: "Intel", socket: "LGA1151", model: "Core i7-9700K", watts: 95 },
    { brand: "Intel", socket: "LGA1151", model: "Core i5-9600K", watts: 95 },
    { brand: "Intel", socket: "LGA1151", model: "Core i5-9400", watts: 65 },
    
    // 8th Gen (Coffee Lake) - 2017-2018
    { brand: "Intel", socket: "LGA1151", model: "Core i9-8900K", watts: 95 },
    { brand: "Intel", socket: "LGA1151", model: "Core i7-8700K", watts: 95 },
    { brand: "Intel", socket: "LGA1151", model: "Core i5-8600K", watts: 95 },
    { brand: "Intel", socket: "LGA1151", model: "Core i5-8400", watts: 65 },
    
    // 7th Gen (Kaby Lake) - 2017
    { brand: "Intel", socket: "LGA1151", model: "Core i7-7700K", watts: 91 },
    { brand: "Intel", socket: "LGA1151", model: "Core i5-7600K", watts: 91 },
    { brand: "Intel", socket: "LGA1151", model: "Core i5-7400", watts: 65 },
    
    // 6th Gen (Skylake) - 2015-2016
    { brand: "Intel", socket: "LGA1151", model: "Core i7-6700K", watts: 91 },
    { brand: "Intel", socket: "LGA1151", model: "Core i5-6600K", watts: 91 },
    { brand: "Intel", socket: "LGA1151", model: "Core i5-6400", watts: 65 },
    
    // 11th Gen (Rocket Lake) - 2021
    { brand: "Intel", socket: "LGA1200", model: "Core i9-11900K", watts: 125 },
    { brand: "Intel", socket: "LGA1200", model: "Core i7-11700K", watts: 125 },
    { brand: "Intel", socket: "LGA1200", model: "Core i5-11600K", watts: 95 },
    
    // 12th Gen (Alder Lake) - 2021-2022
    { brand: "Intel", socket: "LGA1700", model: "Core i9-12900K", watts: 125 },
    { brand: "Intel", socket: "LGA1700", model: "Core i7-12700K", watts: 125 },
    { brand: "Intel", socket: "LGA1700", model: "Core i5-12600K", watts: 125 },
    { brand: "Intel", socket: "LGA1700", model: "Core i5-12400", watts: 65 },
    
    // 13th Gen (Raptor Lake) - 2022-2023
    { brand: "Intel", socket: "LGA1700", model: "Core i9-13900K", watts: 253 },
    { brand: "Intel", socket: "LGA1700", model: "Core i9-13900KS", watts: 253 },
    { brand: "Intel", socket: "LGA1700", model: "Core i7-13700K", watts: 253 },
    { brand: "Intel", socket: "LGA1700", model: "Core i5-13600K", watts: 181 },
    
    // 14th Gen (Raptor Lake Refresh) - 2023-2024
    { brand: "Intel", socket: "LGA1700", model: "Core i9-14900K", watts: 253 },
    { brand: "Intel", socket: "LGA1700", model: "Core i9-14900KS", watts: 253 },
    { brand: "Intel", socket: "LGA1700", model: "Core i7-14700K", watts: 253 },
    { brand: "Intel", socket: "LGA1700", model: "Core i5-14600K", watts: 181 },
  ];

  // Seed Processors - AMD (2016-2026)
  console.log("Adding AMD processors...");
  const amdProcessors = [
    // Ryzen 1000 (Zen) - 2017
    { brand: "AMD", socket: "AM4", model: "Ryzen 7 1800X", watts: 95 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 5 1600X", watts: 95 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 5 1600", watts: 65 },
    
    // Ryzen 2000 (Zen+) - 2018
    { brand: "AMD", socket: "AM4", model: "Ryzen 7 2700X", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 5 2600X", watts: 95 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 5 2600", watts: 65 },
    
    // Ryzen 3000 (Zen 2) - 2019
    { brand: "AMD", socket: "AM4", model: "Ryzen 9 3900X", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 7 3700X", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 5 3600X", watts: 95 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 5 3600", watts: 65 },
    
    // Ryzen 5000 (Zen 3) - 2020-2021
    { brand: "AMD", socket: "AM4", model: "Ryzen 9 5950X", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 9 5900X", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 7 5800X3D", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 7 5800X", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 5 5600X", watts: 65 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 5 5600", watts: 65 },
    
    // Ryzen 7000 (Zen 4) - 2022-2023
    { brand: "AMD", socket: "AM5", model: "Ryzen 9 7950X", watts: 170 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 9 7900X", watts: 170 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 7 7800X3D", watts: 120 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 7 7700X", watts: 105 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 5 7600X", watts: 105 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 5 7600", watts: 65 },
    
    // Ryzen 9000 (Zen 5) - 2024
    { brand: "AMD", socket: "AM5", model: "Ryzen 9 9950X", watts: 170 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 9 9900X", watts: 170 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 7 9700X", watts: 105 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 5 9600X", watts: 65 },
  ];

  await db.insert(processors).values([...intelProcessors, ...amdProcessors]);
  console.log(`✓ Added ${intelProcessors.length + amdProcessors.length} processors`);

  // Seed GPUs - NVIDIA (2016-2026)
  console.log("Adding NVIDIA GPUs...");
  const nvidiaGPUs = [
    // GTX 10 Series (Pascal) - 2016-2017
    { brand: "NVIDIA", series: "GeForce GTX 10", model: "GTX 1080 Ti", watts: 250 },
    { brand: "NVIDIA", series: "GeForce GTX 10", model: "GTX 1080", watts: 180 },
    { brand: "NVIDIA", series: "GeForce GTX 10", model: "GTX 1070", watts: 150 },
    { brand: "NVIDIA", series: "GeForce GTX 10", model: "GTX 1060", watts: 120 },
    
    // RTX 20 Series (Turing) - 2018-2019
    { brand: "NVIDIA", series: "GeForce RTX 20", model: "RTX 2080 Ti", watts: 250 },
    { brand: "NVIDIA", series: "GeForce RTX 20", model: "RTX 2080", watts: 215 },
    { brand: "NVIDIA", series: "GeForce RTX 20", model: "RTX 2070", watts: 175 },
    { brand: "NVIDIA", series: "GeForce RTX 20", model: "RTX 2060", watts: 160 },
    
    // RTX 30 Series (Ampere) - 2020-2021
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3090 Ti", watts: 450 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3090", watts: 350 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3080 Ti", watts: 350 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3080", watts: 320 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3070 Ti", watts: 290 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3070", watts: 220 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3060 Ti", watts: 200 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3060", watts: 170 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3050", watts: 130 },
    
    // RTX 40 Series (Ada) - 2022-2023
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4090", watts: 450 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4080 Super", watts: 320 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4080", watts: 320 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4070 Ti Super", watts: 285 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4070 Ti", watts: 285 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4070 Super", watts: 220 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4070", watts: 200 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4060 Ti", watts: 160 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4060", watts: 115 },
    
    // RTX 50 Series (Blackwell) - 2024-2025
    { brand: "NVIDIA", series: "GeForce RTX 50", model: "RTX 5090", watts: 575 },
    { brand: "NVIDIA", series: "GeForce RTX 50", model: "RTX 5080", watts: 320 },
    { brand: "NVIDIA", series: "GeForce RTX 50", model: "RTX 5070 Ti", watts: 285 },
    { brand: "NVIDIA", series: "GeForce RTX 50", model: "RTX 5070", watts: 250 },
  ];

  // Seed GPUs - AMD (2016-2026)
  console.log("Adding AMD GPUs...");
  const amdGPUs = [
    // RX 400 Series (Polaris) - 2016
    { brand: "AMD", series: "Radeon RX 400", model: "RX 480", watts: 150 },
    { brand: "AMD", series: "Radeon RX 400", model: "RX 470", watts: 120 },
    
    // RX 500 Series (Polaris refresh) - 2017
    { brand: "AMD", series: "Radeon RX 500", model: "RX 580", watts: 185 },
    { brand: "AMD", series: "Radeon RX 500", model: "RX 570", watts: 150 },
    
    // RX Vega Series - 2017-2018
    { brand: "AMD", series: "Radeon RX Vega", model: "RX Vega 64", watts: 295 },
    { brand: "AMD", series: "Radeon RX Vega", model: "RX Vega 56", watts: 210 },
    
    // RX 5000 Series (RDNA) - 2019-2020
    { brand: "AMD", series: "Radeon RX 5000", model: "RX 5700 XT", watts: 225 },
    { brand: "AMD", series: "Radeon RX 5000", model: "RX 5700", watts: 180 },
    { brand: "AMD", series: "Radeon RX 5000", model: "RX 5600 XT", watts: 160 },
    
    // RX 6000 Series (RDNA 2) - 2020-2021
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6950 XT", watts: 335 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6900 XT", watts: 300 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6800 XT", watts: 300 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6800", watts: 250 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6750 XT", watts: 250 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6700 XT", watts: 230 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6650 XT", watts: 180 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6600 XT", watts: 160 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6600", watts: 132 },
    
    // RX 7000 Series (RDNA 3) - 2022-2023
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7900 XTX", watts: 355 },
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7900 XT", watts: 315 },
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7800 XT", watts: 263 },
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7700 XT", watts: 245 },
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7600 XT", watts: 190 },
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7600", watts: 165 },
    
    // RX 8000 Series (RDNA 4) - 2024-2025
    { brand: "AMD", series: "Radeon RX 8000", model: "RX 8900 XT", watts: 420 },
    { brand: "AMD", series: "Radeon RX 8000", model: "RX 8800 XT", watts: 360 },
    { brand: "AMD", series: "Radeon RX 8000", model: "RX 8700 XT", watts: 310 },
  ];

  await db.insert(gpus).values([...nvidiaGPUs, ...amdGPUs]);
  console.log(`✓ Added ${nvidiaGPUs.length + amdGPUs.length} GPUs`);

  // Storage types (no cambios, ya están completos)
  console.log("Storage types already populated from previous seed");

  console.log("✅ Extended database seeded successfully!");
  process.exit(0);
}

seedDatabaseExtended().catch((error) => {
  console.error("❌ Error seeding extended database:", error);
  process.exit(1);
});
