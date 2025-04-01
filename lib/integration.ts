import type { IntegrationBlock } from "./block";
import type { Meta } from "./common";
import type { IntegrationConnection } from "./connection";

export type IntegrationMeta = Meta;

export type Integration = {
  schema: number;
  meta: IntegrationMeta;
  blocks: IntegrationBlock<any, any, any>[];
  connections: IntegrationConnection<any>[];
};
