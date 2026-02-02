import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabla de procesadores
export const processors = mysqlTable("processors", {
  id: int("id").autoincrement().primaryKey(),
  brand: varchar("brand", { length: 64 }).notNull(), // Intel, AMD
  socket: varchar("socket", { length: 64 }).notNull(), // LGA1700, AM5, etc.
  model: varchar("model", { length: 255 }).notNull(), // Core i9-13900K, Ryzen 9 7950X
  watts: int("watts").notNull(), // Consumo en watts (TDP)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Tabla de GPUs
export const gpus = mysqlTable("gpus", {
  id: int("id").autoincrement().primaryKey(),
  brand: varchar("brand", { length: 64 }).notNull(), // NVIDIA, AMD
  model: varchar("model", { length: 255 }).notNull(), // RTX 4090, RX 7900 XTX
  series: varchar("series", { length: 64 }), // GeForce, Radeon
  watts: int("watts").notNull(), // Consumo en watts (TDP)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Tabla de tipos de almacenamiento
export const storageTypes = mysqlTable("storage_types", {
  id: int("id").autoincrement().primaryKey(),
  type: varchar("type", { length: 64 }).notNull().unique(), // HDD, SSD_SATA, SSD_NVME, SSD_M2
  wattsPerUnit: int("wattsPerUnit").notNull(), // Consumo promedio por unidad
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Tabla de configuraciones guardadas (opcional, para historial local)
export const configurations = mysqlTable("configurations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Opcional, null si no hay auth
  name: varchar("name", { length: 255 }).notNull(),
  processorId: int("processorId"),
  gpuId: int("gpuId"),
  ramType: varchar("ramType", { length: 64 }), // DDR4, DDR5
  ramModules: int("ramModules").default(0),
  storageConfig: text("storageConfig"), // JSON con array de {typeId, quantity}
  pciExpress1x4: int("pciExpress1x4").default(0),
  pciExpress1x8: int("pciExpress1x8").default(0),
  pciExpress1x16: int("pciExpress1x16").default(0),
  opticalDrives: int("opticalDrives").default(0),
  fans: int("fans").default(0),
  totalWatts: int("totalWatts").notNull(),
  recommendedPSU: int("recommendedPSU").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Processor = typeof processors.$inferSelect;
export type InsertProcessor = typeof processors.$inferInsert;
export type GPU = typeof gpus.$inferSelect;
export type InsertGPU = typeof gpus.$inferInsert;
export type StorageType = typeof storageTypes.$inferSelect;
export type InsertStorageType = typeof storageTypes.$inferInsert;
export type Configuration = typeof configurations.$inferSelect;
export type InsertConfiguration = typeof configurations.$inferInsert;
