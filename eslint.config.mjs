// import nextVitals from "eslint-config-next/core-web-vitals";
// import nextTs from "eslint-config-next/typescript";
// import prettier from "eslint-config-prettier/flat";
// import { defineConfig, globalIgnores } from "eslint/config";

// const eslintConfig = defineConfig([
//   ...nextVitals,
//   ...nextTs,
//   prettier,
//   // Override default ignores of eslint-config-next.
//   globalIgnores([
//     // Default ignores of eslint-config-next:
//     ".next/**",
//     "out/**",
//     "build/**",
//     "next-env.d.ts",
//     ".lintstagedrc.js",
//   ]),
// ]);

// export default eslintConfig;


// import nextVitals from "eslint-config-next/core-web-vitals";
// import nextTs from "eslint-config-next/typescript";
// import prettier from "eslint-config-prettier/flat";
// import { defineConfig, globalIgnores } from "eslint/config";

// export default defineConfig([
//   ...nextVitals,
//   ...nextTs,
//   prettier,

//   {
//     rules: {
//       "no-unused-vars": "error",
//       // "no-console": "warn",
//       "prefer-const": "error",
//       "eqeqeq": "error"
//     }
//   },

//   globalIgnores([
//     ".next/**",
//     "out/**",
//     "build/**",
//     "next-env.d.ts",
//     ".lintstagedrc.js"
//   ])
// ]);


import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },

    rules: {
      // ✅ Import sorting: auto-fix only, never block commit
      "simple-import-sort/imports": "off",
      "simple-import-sort/exports": "off",

      // ⚠ Unused imports: warning
      "unused-imports/no-unused-imports": "warn",
      "no-unused-vars": "error",
      // "unused-imports/no-unused-vars": [
      //   "warn",
      //   { vars: "all", varsIgnorePattern: "^_", args: "after-used" }
      // ],

      "no-console": "warn",
      "prefer-const": "error",
      "eqeqeq": "error",
      "@typescript-eslint/no-explicit-any": "warn"
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "baseline-browser-mapping/**"
  ]),
]);
