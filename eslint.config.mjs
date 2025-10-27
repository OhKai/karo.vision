import { defineConfig } from "eslint/config";
import nextTs from "eslint-config-next/typescript";

/**
 * Root ESLint configuration for all packages that do not overwrite it with their own config (e.g.
 * Next and Electron apps).
 */
const eslintConfig = defineConfig([...nextTs]);

export default eslintConfig;
