import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

type ComponentsRawData = Record<string, unknown>;

const DB_NAME = "components_cache.db";
const TABLE_NAME = "components_cache";
const CACHE_KEY = "components_json";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let tableReady = false;

function canUseSQLite() {
  return Platform.OS !== "web";
}

async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  const db = await dbPromise;

  if (!tableReady) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        cache_key TEXT PRIMARY KEY NOT NULL,
        payload TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
    tableReady = true;
  }

  return db;
}

export async function readComponentsFromSQLite(): Promise<ComponentsRawData | null> {
  if (!canUseSQLite()) return null;

  try {
    const db = await getDb();
    const row = await db.getFirstAsync<{ payload: string }>(
      `SELECT payload FROM ${TABLE_NAME} WHERE cache_key = ? LIMIT 1`,
      CACHE_KEY
    );

    if (!row?.payload) return null;
    const parsed = JSON.parse(row.payload);
    return parsed && typeof parsed === "object" ? (parsed as ComponentsRawData) : null;
  } catch (error) {
    console.warn("SQLite cache read failed:", error);
    return null;
  }
}

export async function writeComponentsToSQLite(raw: ComponentsRawData): Promise<void> {
  if (!canUseSQLite()) return;

  try {
    const db = await getDb();
    const payload = JSON.stringify(raw);
    await db.runAsync(
      `INSERT INTO ${TABLE_NAME} (cache_key, payload, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(cache_key) DO UPDATE SET
         payload = excluded.payload,
         updated_at = excluded.updated_at`,
      CACHE_KEY,
      payload,
      Date.now()
    );
  } catch (error) {
    console.warn("SQLite cache write failed:", error);
  }
}
