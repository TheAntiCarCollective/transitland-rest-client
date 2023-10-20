module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:perfectionist/recommended-natural",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
  ],
  ignorePatterns: ["/build/*"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: true,
    tsConfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint",
    "jest",
    "perfectionist",
    "sonarjs",
    "unicorn",
  ],
  root: true,
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-imports": "error",
    "no-console": "error",
    "unicorn/no-array-callback-reference": "off",
    "unicorn/number-literal-case": "off",
    "unicorn/prefer-module": "off",
  },
};
