import type { AnyRecord } from "../common";

export type BlockInputFieldTypes =
  | "text"
  | "number"
  | "integer"
  | "select"
  | "keyValue"
  | "boolean"
  | "code"
  | "group"
  | "date"
  | "datetime"
  | "stream"
  | "array";

export type SqlDialect =
  | "cassandra"
  | "clickhouse"
  | "greenplum"
  | "hive"
  | "mariadb"
  | "mssql"
  | "mysql"
  | "plsql"
  | "postgresql"
  | "sqlite"
  | "standard";

export type CodeBlockEditorType = "python" | "sql" | "html" | "yaml" | "javascript";

export type CommonBlockInputField<Key extends keyof any = string> = {
  key: Key;
  type: BlockInputFieldTypes;
  label: string;
  hint?: string;
  readOnly?: boolean;
  required?: boolean;
  default?: any;
  placeholder?: string;
  mappable?: boolean;
};

export type TextBlockInputField = CommonBlockInputField & {
  type: "text";
  typeOptions?: {
    enableFullscreen?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    errorMessage?: string;
  };
};

export type NumberBlockInputField = CommonBlockInputField & {
  type: "number";
  typeOptions?: {
    min?: number;
    max?: number;
  };
};

export type IntegerBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "integer";
  typeOptions?: {
    min?: number;
    max?: number;
  };
};
export type DateBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "date";
  typeOptions?: {
    min?: number;
    max?: number;
    disabledDate: number[];
  };
};

export type DateTimeBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "datetime";
  typeOptions?: {
    min?: number;
    max?: number;
    disabledDate: number[];
  };
};

export type SelectPrimitiveOption = string | { label: string; value: string };
export type SelectOptGroup = {
  label: string;
  options: SelectPrimitiveOption[];
};
export type SelectOptions = Record<string, string> | SelectPrimitiveOption[] | SelectOptGroup[];

export type SelectBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "select";
  options: SelectOptions;
};

export type KeyValueBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "keyValue";
  typeOptions?: {
    sortable?: boolean;
  };
};

export type BooleanBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "boolean";
};

export type CodeBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "code";
} & (
    | {
        editor: "sql";
        sqlDialect?: SqlDialect;
        default?: string;
        typeOptions?: {
          minLength?: number;
          maxLength?: number;
          pattern?: string;
          errorMessage?: string;
        };
      }
    | {
        editor: Exclude<CodeBlockEditorType, "sql">;
        default?: string;
        typeOptions?: {
          minLength?: number;
          maxLength?: number;
          pattern?: string;
          errorMessage?: string;
        };
      }
  );

export type StreamBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "stream";
};

export type GroupBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "group";
  properties: (
    | TextBlockInputField
    | NumberBlockInputField
    | SelectBlockInputField
    | KeyValueBlockInputField
    | BooleanBlockInputField
    | CodeBlockInputField
    | DateBlockInputField
    | DateTimeBlockInputField
  )[];
};

export type ArrayBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "array";
  properties: (
    | TextBlockInputField
    | NumberBlockInputField
    | SelectBlockInputField
    | KeyValueBlockInputField
    | BooleanBlockInputField
    | CodeBlockInputField
    | DateBlockInputField
    | DateTimeBlockInputField
    | StreamBlockInputField
    | IntegerBlockInputField
  )[];
};

export type BlockInputField<InputData extends AnyRecord = {}> = CommonBlockInputField<
  keyof InputData
> &
  (
    | TextBlockInputField
    | NumberBlockInputField
    | SelectBlockInputField
    | KeyValueBlockInputField
    | BooleanBlockInputField
    | CodeBlockInputField
    | GroupBlockInputField
    | DateBlockInputField
    | DateTimeBlockInputField
    | IntegerBlockInputField
    | StreamBlockInputField
    | ArrayBlockInputField
  );
