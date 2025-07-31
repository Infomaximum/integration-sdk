import type { AnyRecord, ExecuteService } from "../common";
import type { OutputBlockVariables } from "./output";
import type { BlockInputField } from "./input";
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
