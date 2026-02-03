/**
 * Sube components.json al bucket público de Supabase Storage.
 *
 * Uso:
 *   1. Añade a .env: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 *   2. Asegúrate de que el bucket "hardware-data" existe y es público
 *   3. pnpm tsx scripts/upload-components-to-supabase.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BUCKET = "hardware-data";
const FILE_NAME = "components.json";

async function upload() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "SUPABASE_URL o EXPO_PUBLIC_SUPABASE_URL requerido en .env"
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY requerido en .env para subir archivos"
    );
  }

  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    FILE_NAME
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`No existe ${filePath}. Ejecuta export-to-json primero.`);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const url = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${BUCKET}/${FILE_NAME}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      "x-upsert": "true",
    },
    body: content,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Supabase Storage error (${response.status}): ${err}`);
  }

  const result = await response.json();
  console.log(`✅ ${FILE_NAME} subido al bucket "${BUCKET}"`);
  console.log(`   URL pública: ${supabaseUrl}/storage/v1/object/public/${BUCKET}/${FILE_NAME}`);
}

upload().catch((e) => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
