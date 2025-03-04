export type Meta = {
  key: string;
  name: string;
  description: string;
};
export type IntegrationMeta = Meta;
export type BlockMeta = Meta;
export type ConnectionMeta = Meta;

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


export type ConnectionInputFieldTypes =
  | "textPlain"
  | "password"
  | "button";

export type BlockInputField = {
  key: string;
  type: BlockInputFieldTypes;
  label: string;
  description?: string
  required: boolean;
} & (
    | { type: "select" | "multiSelect"; choices: Record<string, string> | { label: string; value: string }[] | string[] }
    | { type: Exclude<BlockInputFieldTypes, "select" | "multiSelect"> }
  ) & (
    | { type: "keyValue"; label2: string; subFieldKeyType: string; subFieldValueType: string; keys: string[] }
    | { type: Exclude<BlockInputFieldTypes, "keyValue"> }
  );

export type ConnectionInputField = {
  key: string;
  type: ConnectionInputFieldTypes;
  label: string;
  required: "false" | "true";
} & (
    | {
      type: "button";
      executeWithRedirect?: () => void;
      executeWithSaveFields?: () => Record<string, any>;
      executeWithMessage?: () => void | string;
    }
    | {
      type: Exclude<ConnectionInputFieldTypes, "button">;
      executeWithRedirect?: never;
      executeWithSaveFields?: never;
      executeWithMessage?: never;
    }
  );

type ExecuteService = {
  base64Encode: (input: string) => string;
  base64Decode: (input: string) => string;
  request: (
    config:
      | {
        url: string;
        method: "GET";
        headers?: Record<string, string>;
        // jsonBody и multipartBody недоступны для GET
      }
      | {
        url: string;
        method: "POST" | "PATCH" | "PUT" | "DELETE";
        headers?: Record<string, string>;
        jsonBody?: any;
        multipartBody?: any;
      }
  ) => { status: number; response: any };
  error: {
    stringError: (message: string) => void;
    cause: (message: string) => void
  };
  console: (input: string) => void
};

type ExecuteBundle = {
  inputData: Record<string, any>;
  authData: Record<string, any>;
};

type BlockContext = {}

type ExecuteResult = {
  output_variables: any[],
  output: any[];
  state: Record<string, any>;
  hasNext: boolean
};


export type IntegrationBlockExecute = (service: ExecuteService, bundle: ExecuteBundle, context: BlockContext) => ExecuteResult;

export type IntegrationBlock = {
  meta: BlockMeta;
  inputFields: BlockInputField[];
  executePagination: IntegrationBlockExecute;
};

export type IntegrationConnection = {
  meta: ConnectionMeta;
  inputFields: ConnectionInputField[];
  execute: () => void;
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
export { };
