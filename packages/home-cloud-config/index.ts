/**
 * PUBLIC!
 * Shared home-cloud config that ends up in client-side bundles.
 */

/** SQLite database file name */
export const DB_FILE_NAME = "database.db";
export const PORT = "52776";
export const INFINITE_SCROLL_PAGE_SIZE = 50;
export const WEB_API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3005/home-cloud/v1"
    : "https://api.karo.vision/home-cloud/v1";
