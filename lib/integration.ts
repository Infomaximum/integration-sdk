import type { IntegrationBlock } from "./block/block";
import type { IntegrationConnection } from "./connection";


export type Integration = {
  schema: number;
  version:string;
  label:string;
  description:string
  blocks: Record<string,IntegrationBlock<any, any, any>>;
  connections: Record<string,IntegrationConnection<any>>;
};
