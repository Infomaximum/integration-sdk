export type Meta = {
  key: string;
  name: string;
  description: string;
};

export type IntegrationMeta = Meta;
export type BlockMeta = Meta;
export type ConnectionMeta = Meta;

export type BlockInputFieldTypes = "switcher" | "text";

export type BlockInputField = {
  key: string;
  type: BlockInputFieldTypes;
  label: string;
  required: boolean;
};

type ExecuteService = any; // {}
type ExecuteBundle = any; // {}

type ExecuteResult = {
  output: () => any;
};

export type IntegrationBlockExecute = (
  service: ExecuteService,
  bundle: ExecuteBundle
) => ExecuteResult;

export type IntegrationBlock = {
  meta: BlockMeta;
  inputFields: BlockInputField[];
  execute: IntegrationBlockExecute;
};

export type IntegrationConnection = {
  meta: ConnectionMeta;
  inputFields: any;
  execute: any;
};

export type Integration = {
  schema: number;
  meta: IntegrationMeta;
  blocks: IntegrationBlock[];
  connections: IntegrationConnection[];
};

type ZObject = {};

declare global {
  var integration: Integration;

  var z: ZObject;
}
