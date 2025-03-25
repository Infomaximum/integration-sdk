import type { ExecuteService, Meta } from "./common";

export type ConnectionMeta = Meta;

export type ConnectionInputFieldTypes = "textPlain" | "password" | "button";

export type ConnectionExecuteBundle = {
  authData: Record<string, any>;
};

export type ButtonInputFieldConnection = {
  type: "button";
  executeWithRedirect?: (service: ExecuteService, bundle: ConnectionExecuteBundle) => void;
  executeWithSaveFields?: (
    service: ExecuteService,
    bundle: ConnectionExecuteBundle
  ) => Record<string, any>;
  executeWithMessage?: (service: ExecuteService, bundle: ConnectionExecuteBundle) => void | string;
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

export type ConnectionInputField = CommonConnectionInputField &
  (ButtonInputFieldConnection | OtherInputFieldConnection);

export type ConnectionExecute = (
  this: null,
  service: ExecuteService,
  bundle: ConnectionExecuteBundle
) => void;

export type IntegrationConnection = {
  meta: ConnectionMeta;
  inputFields: ConnectionInputField[];
  execute: ConnectionExecute;
};
