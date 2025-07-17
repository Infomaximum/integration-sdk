import type { AnyRecord, ExecuteService} from "../common";
import type { OutputBlockVariables } from "./output";


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
  keys?: string[];
};

export type OtherBlockInputField = CommonBlockInputField & {
  type: Exclude<BlockInputFieldTypes, "select" | "multiSelect" | "keyValue">;
};

export type BlockInputField<InputData extends AnyRecord = {}> = CommonBlockInputField<
  keyof InputData
> &
  (SelectBlockInputField | KeyValueBlockInputField | OtherBlockInputField);

export type BlockExecuteBundle<
  InputData extends AnyRecord = {},
  AuthData extends AnyRecord = {},
> = {
  inputData: InputData;
  authData: AuthData;
};

export type BlockContext = AnyRecord | string | number | undefined;

export type ExecuteResult<Context extends BlockContext = undefined> = {
  output_variables: OutputBlockVariables[];
  output: any[];
  state: Context;
  hasNext: boolean;
};

export type IntegrationBlockExecute<
  InputData extends AnyRecord = {},
  AuthData extends AnyRecord = {},
  Context extends BlockContext = undefined,
> = (
  this: null,
  service: ExecuteService,
  bundle: BlockExecuteBundle<InputData, AuthData>,
  context: Context | undefined
) => ExecuteResult<Context> | Promise<ExecuteResult<Context>>;

export type FunctionBlockInputField<
  InputData extends AnyRecord = {},
  AuthData extends AnyRecord = {},
> = (
  service: ExecuteService,
  bundle: BlockExecuteBundle<InputData, AuthData>
) => BlockInputField<InputData>[];

export type IntegrationBlock<
  InputData extends AnyRecord = {},
  AuthData extends AnyRecord = {},
  Context extends BlockContext = undefined,
> = {
  label: string;
  description: string;
  inputFields: (BlockInputField<InputData> | FunctionBlockInputField<InputData, AuthData>)[];
  executePagination: IntegrationBlockExecute<InputData, AuthData, Context>;
};
