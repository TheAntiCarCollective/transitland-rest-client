import * as assert from "node:assert";

const { env: environmentVariables } = process;
const environmentVariable = (key: string, defaultValue?: string) => {
  const value = environmentVariables[key];
  if (value !== undefined) return value;
  if (defaultValue !== undefined) return defaultValue;
  assert.fail(`Missing ${key}`);
};

export default {
  PinoLevel: environmentVariable("PINO_LEVEL", "info"),
  TransitlandApiKey: environmentVariable("TRANSITLAND_API_KEY"),
} as const;
