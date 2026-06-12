import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      next: {
        rootDir: "web/",
      },
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "web/.next/**",
    "out/**",
    "web/out/**",
    "build/**",
    "web/build/**",
    "next-env.d.ts",
    "web/next-env.d.ts",
  ]),
]);

export default eslintConfig;
