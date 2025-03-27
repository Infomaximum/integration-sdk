import type { ExecuteService, Meta } from "./common";

export type BlockMeta = Meta;

export type BlockInputFieldTypes =
  | "switcher"
  | "text"
  | "textPlain"
  | "textArea"
  | "sqlArea"
  | "jsArea"
  | "jsonArea"
  | "numberPlain"
  | "select"
  | "multiSelect"
  | "keyValue";

export type CommonBlockInputField = {
  key: string;
  type: BlockInputFieldTypes;
  label: string;
  description?: string;
  required: boolean;
};

export type SelectBlockInputField = CommonBlockInputField & {
  type: "select" | "multiSelect";
  choices: Record<string, string> | { label: string; value: string }[] | string[];
};

export type KeyValueBlockInputField = CommonBlockInputField & {
  type: "keyValue";
  label2: string;
  subFieldKeyType: string;
  subFieldValueType: string;
  keys: string[];
};

export type OtherBlockInputField = CommonBlockInputField & {
  type: Exclude<BlockInputFieldTypes, "select" | "multiSelect" | "keyValue">;
};

export type BlockInputField =
  | SelectBlockInputField
  | KeyValueBlockInputField
  | OtherBlockInputField;

export type BlockExecuteBundle = {
  inputData: Record<string, any>;
  authData: Record<string, any>;
};

export type BlockContext = Record<string, any> | undefined

export type ExecuteResult = {
  output_variables: any[];
  output: any[];
  state: Record<string, any>;
  hasNext: boolean;
};

export type IntegrationBlockExecute = (
  this: null,
  service: ExecuteService,
  bundle: BlockExecuteBundle,
  context: BlockContext
) => ExecuteResult;

export type FunctionBlockInputField = (
  service: ExecuteService,
  bundle: BlockExecuteBundle
) => BlockInputField[];

export type IntegrationBlock = {
  meta: BlockMeta;
  inputFields: (BlockInputField | FunctionBlockInputField)[];
  executePagination: IntegrationBlockExecute;
};
