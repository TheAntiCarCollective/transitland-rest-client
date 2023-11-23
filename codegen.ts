import type { CodegenConfig } from "@graphql-codegen/cli";
import type { TypeScriptPluginConfig } from "@graphql-codegen/typescript";

const schema = (name: string) =>
  `github:interline-io/transitland-server#main:schema/${name}.graphqls`;

const typescriptConfig: TypeScriptPluginConfig = {
  avoidOptionals: true,
};

const codegenConfig: CodegenConfig = {
  generates: {
    [`${__dirname}/src/__generated__/schema.ts`]: {
      config: typescriptConfig,
      plugins: ["typescript"],
    },
  },
  schema: [
    schema("directions"),
    schema("gbfs"),
    schema("input"),
    schema("schema"),
  ],
};

export default codegenConfig;
