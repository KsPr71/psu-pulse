/** Supabase Storage - bucket público para datos de hardware (processors, gpus, storage) */
const SUPABASE_URL =
  (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_SUPABASE_URL) ||
  "https://zcnbqternopttcixibkw.supabase.co";
const HARDWARE_BUCKET = "hardware-data";

export const COMPONENTS_DATA_URL = `${SUPABASE_URL}/storage/v1/object/public/${HARDWARE_BUCKET}/components.json`;

export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = "Please login (10001)";
export const NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
