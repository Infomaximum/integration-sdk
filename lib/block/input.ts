import type { AnyRecord } from "../common";

/**
 * Типы полей ввода для блоков
 */
export type BlockInputFieldTypes =
  | "text"
  | "number"
  | "integer"
  | "select"
  | "multiselect"
  | "keyValue"
  | "boolean"
  | "code"
  | "group"
  | "date"
  | "datetime"
  | "stream"
  | "array";

/**
 * Поддерживаемые SQL диалекты для редактора кода
 */
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

/**
 * Типы редакторов кода
 */
export type CodeBlockEditorType = "python" | "sql" | "html" | "yaml" | "javascript" | "json";

/**
 * Базовое поле ввода для блока
 * @template Key - Тип ключа поля
 */
export type CommonBlockInputField<Key extends keyof any = string> = {
  /** Уникальный ключ поля */
  key: Key;
  /** Тип поля */
  type: BlockInputFieldTypes;
  /** Метка поля */
  label: string;
  /** Подсказка для пользователя */
  hint?: string;
  /** Поле только для чтения */
  readOnly?: boolean;
  /** Обязательное поле */
  required?: boolean;
  /** Значение по умолчанию */
  default?: any;
  /** Текст-заполнитель */
  placeholder?: string;
  /** Можно ли использовать маппинг переменных */
  mappable?: boolean;
};

/**
 * Текстовое поле ввода
 */
export type TextBlockInputField = CommonBlockInputField & {
  type: "text";
  typeOptions?: {
    /** Включить полноэкранный режим */
    enableFullscreen?: boolean;
    /** Минимальная длина текста */
    minLength?: number;
    /** Максимальная длина текста */
    maxLength?: number;
    /** Регулярное выражение для валидации */
    pattern?: string;
    /** Сообщение об ошибке валидации */
    errorMessage?: string;
  };
};

/**
 * Числовое поле ввода (с плавающей точкой)
 */
export type NumberBlockInputField = CommonBlockInputField & {
  type: "number";
  typeOptions?: {
    /** Минимальное значение */
    min?: number;
    /** Максимальное значение */
    max?: number;
  };
};

/**
 * Целочисленное поле ввода
 * @template Key - Тип ключа поля
 */
export type IntegerBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "integer";
  typeOptions?: {
    /** Минимальное значение */
    min?: number;
    /** Максимальное значение */
    max?: number;
  };
};

/**
 * Поле ввода даты
 * @template Key - Тип ключа поля
 */
export type DateBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "date";
  typeOptions?: {
    /** Минимальная дата (timestamp) */
    min?: number;
    /** Максимальная дата (timestamp) */
    max?: number;
    /** Отключенные даты (timestamp) */
    disabledDate: number[];
  };
};

/**
 * Поле ввода даты и времени
 * @template Key - Тип ключа поля
 */
export type DateTimeBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "datetime";
  typeOptions?: {
    /** Минимальная дата и время (timestamp) */
    min?: number;
    /** Максимальная дата и время (timestamp) */
    max?: number;
    /** Отключенные даты (timestamp) */
    disabledDate: number[];
  };
};

export type SelectPrimitiveOption = string | { label: string; value: string };

/**
 * Группа опций для выпадающего списка
 */
export type SelectOptGroup = {
  label: string;
  options: SelectPrimitiveOption[];
};

/**
 * Опции для выпадающего списка
 */
export type SelectOptions = Record<string, string> | SelectPrimitiveOption[] | SelectOptGroup[];

/**
 * Выпадающий список (одиночный выбор)
 * @template Key - Тип ключа поля
 */
export type SelectBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "select";
  /** Опции для выбора */
  options: SelectOptions;
};

/**
 * Выпадающий список (множественный выбор)
 * @template Key - Тип ключа поля
 */
export type MultiSelectBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "multiselect";
  /** Опции для выбора */
  options: SelectOptions;
  typeOptions?: {
    /** Минимальное количество выбранных элементов */
    minItems?: number;
    /** Максимальное количество выбранных элементов */
    maxItems?: number;
    /** Разделитель для строкового представления */
    delimiter?: string;
  };
};

/**
 * Поле ввода пар ключ-значение
 * @template Key - Тип ключа поля
 */
export type KeyValueBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "keyValue";
  typeOptions?: {
    /** Можно ли сортировать элементы */
    sortable?: boolean;
  };
};

/**
 * Логическое поле (чекбокс)
 * @template Key - Тип ключа поля
 */
export type BooleanBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "boolean";
};

/**
 * Редактор кода с подсветкой синтаксиса
 * @template Key - Тип ключа поля
 */
export type CodeBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "code";
} & (
    | {
        /** Тип редактора - SQL */
        editor: "sql";
        /** SQL диалект для подсветки синтаксиса */
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
        /** Тип редактора (не SQL) */
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

/**
 * Поле для работы с потоками данных
 * @template Key - Тип ключа поля
 */
export type StreamBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "stream";
};

/**
 * Группа полей (вложенные поля)
 * @template Key - Тип ключа поля
 */
export type GroupBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "group";
  /** Вложенные поля */
  properties: (
    | TextBlockInputField
    | NumberBlockInputField
    | SelectBlockInputField
    | MultiSelectBlockInputField
    | KeyValueBlockInputField
    | BooleanBlockInputField
    | CodeBlockInputField
    | DateBlockInputField
    | DateTimeBlockInputField
    | StreamBlockInputField
    | IntegerBlockInputField
  )[];
};

/**
 * Массив полей (повторяющиеся группы полей)
 * @template Key - Тип ключа поля
 */
export type ArrayBlockInputField<Key extends string = string> = CommonBlockInputField<Key> & {
  type: "array";
  /** Поля для каждого элемента массива */
  properties: (
    | TextBlockInputField
    | NumberBlockInputField
    | SelectBlockInputField
    | MultiSelectBlockInputField
    | KeyValueBlockInputField
    | BooleanBlockInputField
    | CodeBlockInputField
    | DateBlockInputField
    | DateTimeBlockInputField
    | StreamBlockInputField
    | IntegerBlockInputField
  )[];
  typeOptions?: {
    /** Минимальное количество элементов */
    minItems?: number;
    /** Максимальное количество элементов */
    maxItems?: number;
  };
};

/**
 * Общий тип поля ввода для блока
 * @template InputData - Тип входных данных блока
 */
export type BlockInputField<InputData extends AnyRecord = {}> = CommonBlockInputField<
  keyof InputData
> &
  (
    | TextBlockInputField
    | NumberBlockInputField
    | SelectBlockInputField
    | MultiSelectBlockInputField
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
