import type { ExecuteService, Meta } from "./common";

export type ConnectionMeta = Meta;

export type ConnectionInputFieldTypes = "textPlain" | "password" | "button";

export type ConnectionExecuteBundle<AuthData extends Record<string, string>> = {
  authData: AuthData;
};

export type ButtonInputFieldConnection<
  AuthData extends Record<string, string>,
  AdditionalAuthData extends Record<string, string> = Record<string, string>,
> = {
  key: string;
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

export type OtherInputFieldConnection = {
  type: Exclude<ConnectionInputFieldTypes, "button">;
};

export type CommonConnectionInputField = {
  key: string;
  type: ConnectionInputFieldTypes;
  label: string;
  required: boolean;
};

export type ConnectionInputField<
  AuthData extends Record<string, string>,
  AdditionalAuthData extends Record<string, string> = Record<string, string>,
> = CommonConnectionInputField &
  (ButtonInputFieldConnection<AuthData, AdditionalAuthData> | OtherInputFieldConnection);

export type ConnectionExecute<AuthData extends Record<string, string>> = (
  this: null,
  service: ExecuteService,
  bundle: ConnectionExecuteBundle<AuthData>
) => void;

export type IntegrationConnection<
  AuthData extends Record<string, string> = Record<string, string>,
  AdditionalAuthData extends Record<string, string> = Record<string, string>,
> = {
  meta: ConnectionMeta;
  inputFields: ConnectionInputField<AuthData, AdditionalAuthData>[];
  execute: ConnectionExecute<AuthData & AdditionalAuthData>;
};
