import type { AnyRecord, ExecuteService } from "./common";

export type GlobalAuthData = {
  BASE_URL: string;
};

export type ConnectionInputFieldTypes = "textPlain" | "password" | "button";

export type ConnectionExecuteBundle<AuthData extends AnyRecord> = {
  authData: AuthData & GlobalAuthData;
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
  ) => Partial<AdditionalAuthData>;
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
  label: string;
  description: string;
  inputFields: ConnectionInputField<AuthData, AdditionalAuthData>[];
  execute: ConnectionExecute<AuthData & AdditionalAuthData>;
};
