import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { processors, gpus, storageTypes } from "../drizzle/schema";
import fs from "fs";
import path from "path";

async function exportData() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log("📊 Exportando datos de la base de datos...");

  const [processorsList, gpusList, storageList] = await Promise.all([
    db.select().from(processors),
    db.select().from(gpus),
    db.select().from(storageTypes),
  ]);

  const data = {
    processors: processorsList,
    gpus: gpusList,
    storageTypes: storageList,
  };

  const publicDir = path.join(process.cwd(), "public", "data");
  fs.mkdirSync(publicDir, { recursive: true });

  const outputPath = path.join(publicDir, "components.json");
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`✅ Datos exportados a ${outputPath}`);
  console.log(`   - ${processorsList.length} procesadores`);
  console.log(`   - ${gpusList.length} GPUs`);
  console.log(`   - ${storageList.length} tipos de almacenamiento`);

  await connection.end();
  process.exit(0);
}

exportData().catch((error) => {
  console.error("❌ Error exportando datos:", error);
  process.exit(1);
});
