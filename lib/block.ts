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

export type CommonBlockInputField<Key extends keyof any = string> = {
  key: Key;
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

export type BlockInputField<InputData extends Record<string, string>> = CommonBlockInputField<
  keyof InputData
> &
  (SelectBlockInputField | KeyValueBlockInputField | OtherBlockInputField);

export type BlockExecuteBundle<
  InputData extends Record<string, string>,
  AuthData extends Record<string, string>,
> = {
  inputData: InputData;
  authData: AuthData;
};

export type BlockContext = Record<string, any> | undefined;

export type ExecuteResult<Context extends BlockContext = undefined> = {
  output_variables: any[];
  output: any[];
  state: Context;
  hasNext: boolean;
};

export type IntegrationBlockExecute<
  InputData extends Record<string, string>,
  AuthData extends Record<string, string>,
  Context extends BlockContext = undefined,
> = (
  this: null,
  service: ExecuteService,
  bundle: BlockExecuteBundle<InputData, AuthData>,
  context: Context
) => ExecuteResult<Context>;

export type FunctionBlockInputField<
  InputData extends Record<string, string>,
  AuthData extends Record<string, string>,
> = (
  service: ExecuteService,
  bundle: BlockExecuteBundle<InputData, AuthData>
) => BlockInputField<InputData>[];

export type IntegrationBlock<
  InputData extends Record<string, string> = Record<string, string>,
  AuthData extends Record<string, string> = Record<string, string>,
  Context extends BlockContext = undefined,
> = {
  meta: BlockMeta;
  inputFields: (BlockInputField<InputData> | FunctionBlockInputField<InputData, AuthData>)[];
  executePagination: IntegrationBlockExecute<InputData, AuthData, Context>;
};
