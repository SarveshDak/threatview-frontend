import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends,
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion,
      globals,
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport,
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
