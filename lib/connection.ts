import type { AnyRecord, ExecuteService, Meta } from "./common";

export type ConnectionMeta = Meta;

export type ConnectionInputFieldTypes = "textPlain" | "password" | "button";

export type ConnectionExecuteBundle<AuthData extends AnyRecord> = {
  authData: AuthData;
};

export type ButtonInputFieldConnection<
  AuthData extends AnyRecord,
  AdditionalAuthData extends AnyRecord = {},
> = CommonConnectionInputField<string> & {
  type: "button";
  executeWithRedirect?: (
    service: ExecuteService,
    bundle: ConnectionExecuteBundle<AuthData>
  ) => void;
  executeWithSaveFields?: (
    service: ExecuteService,
    bundle: ConnectionExecuteBundle<AuthData>
  ) => AdditionalAuthData;
  executeWithMessage?: (
    service: ExecuteService,
    bundle: ConnectionExecuteBundle<AuthData & AdditionalAuthData>
  ) => void | string;
};

export type OtherInputFieldConnection<Key = string> = CommonConnectionInputField<Key> & {
  type: Exclude<ConnectionInputFieldTypes, "button">;
};

export type CommonConnectionInputField<Key = string> = {
  key: Key;
  type: ConnectionInputFieldTypes;
  label: string;
  required: boolean;
};

export type ConnectionInputField<
  AuthData extends AnyRecord,
  AdditionalAuthData extends AnyRecord = {},
> =
  | ButtonInputFieldConnection<AuthData, AdditionalAuthData>
  | OtherInputFieldConnection<keyof AuthData>;

export type ConnectionExecute<AuthData extends AnyRecord> = (
  this: null,
  service: ExecuteService,
  bundle: ConnectionExecuteBundle<AuthData>
) => void;

export type IntegrationConnection<
  AuthData extends AnyRecord = {},
  AdditionalAuthData extends AnyRecord = {},
> = {
  meta: ConnectionMeta;
  inputFields: ConnectionInputField<AuthData, AdditionalAuthData>[];
  execute: ConnectionExecute<AuthData & AdditionalAuthData>;
};
