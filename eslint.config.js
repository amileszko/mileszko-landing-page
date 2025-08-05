import eslintReact from "@eslint-react/eslint-plugin";
import eslint from "@eslint/js";
import eslintPluginStylistic from "@stylistic/eslint-plugin";
import eslintParserTypeScript from "@typescript-eslint/parser";
import {
  createTypeScriptImportResolver,
} from "eslint-import-resolver-typescript";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import i18next from "eslint-plugin-i18next";
import eslintPluginImportNewlines from "eslint-plugin-import-newlines";
import {
  createNodeResolver,
  flatConfigs as eslintPluginImportXConfigs,
} from "eslint-plugin-import-x";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginNewlineDestructuring from "eslint-plugin-newline-destructuring";
import perfectionist from "eslint-plugin-perfectionist";
import promise from "eslint-plugin-promise";
import reactPlugin from "eslint-plugin-react";
import { configs as reactHooksConfigs } from "eslint-plugin-react-hooks";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint, { configs as tseslintConfigs } from "typescript-eslint";

const ignoresConfig = {
  ignores: [
    "**/.git/**",
    "**/cdk.out/**",
    "**/dist/**",
    "**/public/**",
    "**/node_modules/**",
    "**/.yarn/**",
    "**/yarn.lock",
    "**/.turbo/**",
    "**/env/**",
    "**/*.css",
  ],
};

const tsScriptsExtensions = [
  "ts",
  "tsx",
  "cts",
];

const jsScriptsExtensions = [
  "js",
  "jsx",
  "cjs",
  "mjs",
];

const allScriptsExtensions = [
  ...tsScriptsExtensions,
  ...jsScriptsExtensions,
];

const jsoncConfig = [
  ...eslintPluginJsonc.configs["flat/recommended-with-jsonc"],
  {
    rules: {
      "jsonc/indent": [
        "error",
        2,
        {},
      ],
      "jsonc/key-spacing": "error",
    },
  },
];

const jsConfig = [
  {
    extends: [eslint.configs.recommended],
    files: [`**/*.{${allScriptsExtensions.join(",")}}`],
    rules: {
      curly: [
        "error",
        "all",
      ],
    },
  },
  {
    extends: [eslintPluginUnicorn.configs.recommended],
    files: [`**/*.{${allScriptsExtensions.join(",")}}`],
    rules: {
      "unicorn/filename-case": "off",
      "unicorn/no-anonymous-default-export": "off",
      "unicorn/no-array-reverse": "off",
      "unicorn/no-await-expression-member": "off",
      "unicorn/prefer-at": "off",
      "unicorn/prefer-export-from": [
        "error",
        { ignoreUsedVariables: true },
      ],
      "unicorn/prevent-abbreviations": "off",
      "unicorn/text-encoding-identifier-case": "off",
    },
  },
  {
    extends: [eslintPluginStylistic.configs.recommended],
    files: [`**/*.{${allScriptsExtensions.join(",")}}`],
    plugins: { "@stylistic": eslintPluginStylistic },
    rules: {
      "@stylistic/array-bracket-newline": [
        "error",
        {
          minItems: 2,
          multiline: true,
        },
      ],
      "@stylistic/array-element-newline": [
        "error",
        {
          minItems: 2,
          multiline: true,
        },
      ],
      "@stylistic/curly-newline": [
        "error",
        {
          minElements: 1,
          multiline: true,
        },
      ],
      "@stylistic/function-call-argument-newline": [
        "error",
        "always",
      ],
      "@stylistic/function-paren-newline": [
        "error",
        "multiline-arguments",
      ],
      "@stylistic/indent": [
        "error",
        2,
      ],
      "@stylistic/indent-binary-ops": [
        "error",
        2,
      ],
      "@stylistic/jsx-curly-newline": [
        "error",
        { multiline: "require" },
      ],
      "@stylistic/jsx-self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],
      "@stylistic/max-len": [
        "error",
        {
          code: 80,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          tabWidth: 2,
        },
      ],
      "@stylistic/newline-per-chained-call": [
        "error",
        { ignoreChainWithDepth: 1 },
      ],
      "@stylistic/no-multiple-empty-lines": [
        "error",
        { max: 1 },
      ],
      "@stylistic/object-curly-newline": [
        "error",
        {
          ObjectExpression: { multiline: true },
          ObjectPattern: { multiline: true },
        },
      ],
      "@stylistic/object-property-newline": "error",
      "@stylistic/operator-linebreak": [
        "error",
        "after",
      ],
      "@stylistic/quotes": [
        "error",
        "double",
        {
          allowTemplateLiterals: "never",
          avoidEscape: true,
        },
      ],
      "@stylistic/semi": [
        "error",
        "always",
      ],
    },
  },
  {
    extends: [perfectionist.configs["recommended-natural"]],
    files: [`**/*.{${allScriptsExtensions.join(",")}}`],
  },
  {
    files: [`**/*.{${allScriptsExtensions.join(",")}}`],
    plugins: { "newline-destructuring": eslintPluginNewlineDestructuring },
    rules: { "newline-destructuring/newline": "error" },
  },
  {
    extends: [promise.configs["flat/recommended"]],
    files: [`**/*.{${allScriptsExtensions.join(",")}}`],
  },
];

const importConfig = [
  {
    extends: [
      eslintPluginImportXConfigs.recommended,
      eslintPluginImportXConfigs.typescript,
      eslintPluginImportXConfigs.react,
    ],
    files: [`**/*.{${allScriptsExtensions.join(",")}}`],
    rules: {
      "import-x/consistent-type-specifier-style": [
        "error",
        "prefer-inline",
      ],
      "import-x/default": "off",
      "import-x/export": "error",
      "import-x/exports-last": "error",
      "import-x/first": "error",
      "import-x/group-exports": "error",
      "import-x/newline-after-import": [
        "error",
        { count: 1 },
      ],
      "import-x/no-cycle": "error",
      "import-x/no-duplicates": "error",
      "import-x/no-named-as-default": "error",
      "import-x/no-named-as-default-member": "off",
      "import-x/no-self-import": "error",
      "import-x/no-useless-path-segments": [
        "error",
        { noUselessIndex: false },
      ],
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          noWarnOnMultipleProjects: true,
          project: [
            "./website/tsconfig.json",
            "./api/tsconfig.json",
            "./cdk/tsconfig.json",
          ],
        }),
        createNodeResolver(),
      ],
    },
  },
  {
    files: [`**/*.{${allScriptsExtensions.join(",")}}`],
    plugins: { "import-newlines": eslintPluginImportNewlines },
    rules: {
      "import-newlines/enforce": [
        "error",
        { "max-len": 80 },
      ],
    },
  },
  {
    files: [`**/*.{${allScriptsExtensions.join(",")}}`],
    plugins: { "unused-imports": eslintPluginUnusedImports },
    rules: { "unused-imports/no-unused-imports": "error" },
  },
];

const tsConfig = [
  {
    extends: [
      tseslintConfigs.strictTypeChecked,
      tseslintConfigs.stylisticTypeChecked,
    ],
    files: [`**/*.{${tsScriptsExtensions.join(",")}}`],
    languageOptions: {
      parser: eslintParserTypeScript,
      parserOptions: { projectService: true },
    },
    rules: {
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: true,
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/restrict-template-expressions": "off",
    },
  },
];

const reactConfig = [
  {
    ...reactPlugin.configs.flat.recommended,
    files: [`./**/*.{${allScriptsExtensions.join(",")}}`],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: { ...globals.browser },
    },
    settings: { react: { version: "detect" } },
  },
  {
    extends: [reactPlugin.configs.flat["jsx-runtime"]],
    files: [`./**/*.{${allScriptsExtensions.join(",")}}`],
  },
  {
    extends: [reactHooksConfigs["recommended-latest"]],
    files: [`./**/*.{${allScriptsExtensions.join(",")}}`],
  },
  {
    extends: [eslintReact.configs["recommended-typescript"]],
    files: [`**/*.{${allScriptsExtensions.join(",")}}`],
  },
];

const internationalizationConfig = [
  {
    extends: [jsxA11y.flatConfigs.recommended],
    files: [`./website/**/*.{${allScriptsExtensions.join(",")}}`],
  },
  {
    extends: [i18next.configs["flat/recommended"]],
    files: [`./website/**/*.{${allScriptsExtensions.join(",")}}`],
  },
];

const tailwindConfig = [
  {
    files: [`./website/**/*.{${allScriptsExtensions.join(",")}}`],
    plugins: { "better-tailwindcss": eslintPluginBetterTailwindcss },
    rules: {
      ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,
      ...eslintPluginBetterTailwindcss.configs["recommended-error"].rules,
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "error",
        {
          classesPerLine: 5,
          printWidth: 0,
        },
      ],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "./website/src/styles.css",
        tsconfig: "./website/tsconfig.json",
      },
    },
  },
];

export default tseslint.config(
  ignoresConfig,
  ...jsoncConfig,
  ...jsConfig,
  ...tsConfig,
  ...importConfig,
  ...reactConfig,
  ...internationalizationConfig,
  ...tailwindConfig,
);
