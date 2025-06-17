import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "indent": ["error", 2],
      "react/jsx-uses-react": 0,
      "react/react-in-jsx-scope": 0,
      "@typescript-eslint/no-explicit-any": "off",
      "semi": 2,
      "no-unused-vars": 1,
      "@typescript-eslint/no-unused-vars": 1,
      "@typescript-eslint/no-unsafe-function-type": 0
    }
  }
]);