import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";

export default [
  // Global ignores
  {
    ignores: [
      "artifacts/",
      "cache/",
      "dist/",
      "types/",
      "contracts.ts",
      "node_modules/",
    ],
  },

  // Base configuration
  js.configs.recommended,

  // TypeScript files configuration
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs"],

    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
    },

    rules: {
      // Prettier integration
      "prettier/prettier": "error",

      // TypeScript recommended rules
      ...typescriptEslint.configs.recommended.rules,

      // Rule for any type usage - disabled to allow any types
      "@typescript-eslint/no-explicit-any": "off",

      // Rules for unused variables - off for hardhat scripts
      "@typescript-eslint/no-unused-vars": "off",

      // Additional rules
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
