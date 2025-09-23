import type { AnyRecord, ExecuteService } from "./common";

export type GlobalAuthData = {
  BASE_URL: string;
};

export type ConnectionInputFieldTypes = "text" | "password" | "number" | "button";

export type ConnectionExecuteBundle<AuthData extends AnyRecord> = {
  authData: AuthData & GlobalAuthData;
};

export type ButtonInputFieldConnection<
  AuthData extends AnyRecord,
  AdditionalAuthData extends AnyRecord = {},
> = CommonConnectionInputField<string> & {
  type: "button";
  typeOptions: {
    redirect?: (service: ExecuteService, bundle: ConnectionExecuteBundle<AuthData>) => void;
    saveFields?: (
      service: ExecuteService,
      bundle: ConnectionExecuteBundle<AuthData>
    ) => Partial<AdditionalAuthData>;
    message?: (
      service: ExecuteService,
      bundle: ConnectionExecuteBundle<AuthData & AdditionalAuthData>
    ) => void | string;
  };
};

export type OtherInputFieldConnection<Key = string> = CommonConnectionInputField<Key> & {
  type: Exclude<ConnectionInputFieldTypes, "button">;
};

export type CommonConnectionInputField<Key = string> = {
  key: Key;
  type: ConnectionInputFieldTypes;
  label: string;
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

export type FunctionConnectionInputField<AuthData extends AnyRecord = {}> = (
  service: ExecuteService,
  bundle: ConnectionExecuteBundle<AuthData>
) => ConnectionInputField<AuthData>[];

export type IntegrationConnection<
  AuthData extends AnyRecord = {},
  AdditionalAuthData extends AnyRecord = {},
> = {
  label: string;
  description: string;
  inputFields: (
    | ConnectionInputField<AuthData, AdditionalAuthData>
    | FunctionConnectionInputField<AuthData>
  )[];
  execute: ConnectionExecute<AuthData & AdditionalAuthData>;
  refresh: ConnectionExecute<AuthData & AdditionalAuthData>;
};
