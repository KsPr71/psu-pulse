import { drizzle } from "drizzle-orm/mysql2";
import { processors, gpus, storageTypes } from "../drizzle/schema";

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return drizzle(process.env.DATABASE_URL);
}

async function seedDatabase() {
  const db = getDb();

  console.log("🌱 Seeding database...");

  // Seed Processors
  console.log("Adding processors...");
  const processorData = [
    // Intel
    { brand: "Intel", socket: "LGA1700", model: "Core i9-14900K", watts: 253 },
    { brand: "Intel", socket: "LGA1700", model: "Core i9-13900K", watts: 253 },
    { brand: "Intel", socket: "LGA1700", model: "Core i7-14700K", watts: 253 },
    { brand: "Intel", socket: "LGA1700", model: "Core i7-13700K", watts: 253 },
    { brand: "Intel", socket: "LGA1700", model: "Core i5-14600K", watts: 181 },
    { brand: "Intel", socket: "LGA1700", model: "Core i5-13600K", watts: 181 },
    { brand: "Intel", socket: "LGA1700", model: "Core i5-14400", watts: 148 },
    { brand: "Intel", socket: "LGA1700", model: "Core i3-14100", watts: 110 },
    { brand: "Intel", socket: "LGA1200", model: "Core i9-11900K", watts: 251 },
    { brand: "Intel", socket: "LGA1200", model: "Core i7-11700K", watts: 251 },
    { brand: "Intel", socket: "LGA1200", model: "Core i5-11600K", watts: 251 },
    
    // AMD
    { brand: "AMD", socket: "AM5", model: "Ryzen 9 7950X", watts: 170 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 9 7900X", watts: 170 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 7 7800X3D", watts: 120 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 7 7700X", watts: 105 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 5 7600X", watts: 105 },
    { brand: "AMD", socket: "AM5", model: "Ryzen 5 7600", watts: 65 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 9 5950X", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 9 5900X", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 7 5800X3D", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 7 5800X", watts: 105 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 5 5600X", watts: 65 },
    { brand: "AMD", socket: "AM4", model: "Ryzen 5 5600", watts: 65 },
  ];

  await db.insert(processors).values(processorData);
  console.log(`✓ Added ${processorData.length} processors`);

  // Seed GPUs
  console.log("Adding GPUs...");
  const gpuData = [
    // NVIDIA RTX 40 Series
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4090", watts: 450 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4080 Super", watts: 320 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4080", watts: 320 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4070 Ti Super", watts: 285 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4070 Ti", watts: 285 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4070 Super", watts: 220 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4070", watts: 200 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4060 Ti", watts: 160 },
    { brand: "NVIDIA", series: "GeForce RTX 40", model: "RTX 4060", watts: 115 },
    
    // NVIDIA RTX 30 Series
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3090 Ti", watts: 450 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3090", watts: 350 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3080 Ti", watts: 350 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3080", watts: 320 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3070 Ti", watts: 290 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3070", watts: 220 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3060 Ti", watts: 200 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3060", watts: 170 },
    { brand: "NVIDIA", series: "GeForce RTX 30", model: "RTX 3050", watts: 130 },
    
    // AMD Radeon RX 7000 Series
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7900 XTX", watts: 355 },
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7900 XT", watts: 315 },
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7800 XT", watts: 263 },
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7700 XT", watts: 245 },
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7600 XT", watts: 190 },
    { brand: "AMD", series: "Radeon RX 7000", model: "RX 7600", watts: 165 },
    
    // AMD Radeon RX 6000 Series
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6950 XT", watts: 335 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6900 XT", watts: 300 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6800 XT", watts: 300 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6800", watts: 250 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6750 XT", watts: 250 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6700 XT", watts: 230 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6650 XT", watts: 180 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6600 XT", watts: 160 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6600", watts: 132 },
    { brand: "AMD", series: "Radeon RX 6000", model: "RX 6500 XT", watts: 107 },
  ];

  await db.insert(gpus).values(gpuData);
  console.log(`✓ Added ${gpuData.length} GPUs`);

  // Seed Storage Types
  console.log("Adding storage types...");
  const storageData = [
    { 
      type: "HDD_3.5", 
      wattsPerUnit: 8, 
      description: "Disco duro mecánico 3.5 pulgadas (7200 RPM)" 
    },
    { 
      type: "HDD_2.5", 
      wattsPerUnit: 3, 
      description: "Disco duro mecánico 2.5 pulgadas (5400 RPM)" 
    },
    { 
      type: "SSD_SATA", 
      wattsPerUnit: 3, 
      description: "SSD SATA 2.5 pulgadas" 
    },
    { 
      type: "SSD_M2_SATA", 
      wattsPerUnit: 3, 
      description: "SSD M.2 SATA" 
    },
    { 
      type: "SSD_M2_NVME", 
      wattsPerUnit: 5, 
      description: "SSD M.2 NVMe PCIe 3.0" 
    },
    { 
      type: "SSD_M2_NVME_GEN4", 
      wattsPerUnit: 8, 
      description: "SSD M.2 NVMe PCIe 4.0" 
    },
    { 
      type: "SSD_M2_NVME_GEN5", 
      wattsPerUnit: 12, 
      description: "SSD M.2 NVMe PCIe 5.0" 
    },
  ];

  await db.insert(storageTypes).values(storageData);
  console.log(`✓ Added ${storageData.length} storage types`);

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
