import type { IntegrationBlock } from "./block";
import type { Meta } from "./common";
import type { IntegrationConnection } from "./connection";

export type IntegrationMeta = Meta;

export type Integration<
  InputData extends Record<string, string>,
  AuthData extends Record<string, string>,
> = {
  schema: number;
  meta: IntegrationMeta;
  blocks: IntegrationBlock<InputData, AuthData>[];
  connections: IntegrationConnection<AuthData>[];
};
