import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, processors, gpus, storageTypes, configurations, InsertConfiguration } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Queries para componentes de PC

// Procesadores
export async function getAllProcessors() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(processors).orderBy(processors.brand, processors.model);
}

export async function getProcessorsByBrand(brand: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(processors).where(eq(processors.brand, brand)).orderBy(processors.model);
}

export async function getProcessorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(processors).where(eq(processors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// GPUs
export async function getAllGPUs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gpus).orderBy(gpus.brand, gpus.model);
}

export async function getGPUsByBrand(brand: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gpus).where(eq(gpus.brand, brand)).orderBy(gpus.model);
}

export async function getGPUById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gpus).where(eq(gpus.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Tipos de almacenamiento
export async function getAllStorageTypes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(storageTypes).orderBy(storageTypes.type);
}

export async function getStorageTypeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(storageTypes).where(eq(storageTypes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Configuraciones
export async function saveConfiguration(config: InsertConfiguration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(configurations).values(config);
  return Number(result[0].insertId);
}

export async function getUserConfigurations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(configurations).where(eq(configurations.userId, userId)).orderBy(configurations.createdAt);
}

export async function deleteConfiguration(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(configurations).where(eq(configurations.id, id));
}
