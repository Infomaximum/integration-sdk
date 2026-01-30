import type { AnyRecord, ExecuteService } from "./common";

/**
 * Глобальные данные аутентификации, доступные во всех подключениях
 */
export type GlobalAuthData = {
  /** Базовый URL для API запросов */
  BASE_URL: string;
};

/**
 * Типы полей ввода для подключений
 */
export type ConnectionInputFieldTypes = "text" | "password" | "number" | "button";

/**
 * Набор данных для выполнения операций подключения
 * @template AuthData - Тип данных аутентификации
 */
export type ConnectionExecuteBundle<AuthData extends AnyRecord> = {
  /** Данные аутентификации, включая BASE_URL */
  authData: AuthData & GlobalAuthData;
};

/**
 * Поле ввода типа "кнопка" для подключений
 * Используется для OAuth авторизации или других интерактивных действий
 *
 * @template AuthData - Тип данных аутентификации
 * @template AdditionalAuthData - Дополнительные данные, получаемые после нажатия кнопки
 */
export type ButtonInputFieldConnection<
  AuthData extends AnyRecord,
  AdditionalAuthData extends AnyRecord = {},
> = CommonConnectionInputField<string> & {
  type: "button";
  typeOptions: {
    /** Функция перенаправления (например, для OAuth) */
    redirect?: (service: ExecuteService, bundle: ConnectionExecuteBundle<AuthData>) => void;
    /** Функция для сохранения дополнительных полей после авторизации */
    saveFields?: (
      service: ExecuteService,
      bundle: ConnectionExecuteBundle<AuthData>
    ) => Partial<AdditionalAuthData>;
    /** Сообщение или функция для отображения сообщения */
    message?: (
      service: ExecuteService,
      bundle: ConnectionExecuteBundle<AuthData & AdditionalAuthData>
    ) => void | string;
  };
};

/**
 * Обычное поле ввода для подключений (текст, пароль, число)
 * @template Key - Тип ключа поля
 */
export type OtherInputFieldConnection<Key = string> = CommonConnectionInputField<Key> & {
  type: Exclude<ConnectionInputFieldTypes, "button">;
};

/**
 * Базовое поле ввода для подключений
 * @template Key - Тип ключа поля
 */
export type CommonConnectionInputField<Key = string> = {
  /** Уникальный ключ поля */
  key: Key;
  /** Тип поля */
  type: ConnectionInputFieldTypes;
  /** Метка поля */
  label: string;
};

/**
 * Поле ввода для подключения (кнопка или обычное поле)
 * @template AuthData - Тип данных аутентификации
 * @template AdditionalAuthData - Дополнительные данные аутентификации
 */
export type ConnectionInputField<
  AuthData extends AnyRecord,
  AdditionalAuthData extends AnyRecord = {},
> =
  | ButtonInputFieldConnection<AuthData, AdditionalAuthData>
  | OtherInputFieldConnection<keyof AuthData>;

/**
 * Функция выполнения операции подключения
 * Используется для проверки подключения или обновления токенов
 *
 * @template AuthData - Тип данных аутентификации
 * @param service - Сервис для выполнения операций
 * @param bundle - Набор данных с информацией об аутентификации
 */
export type ConnectionExecute<AuthData extends AnyRecord> = (
  this: null,
  service: ExecuteService,
  bundle: ConnectionExecuteBundle<AuthData>
) => void;

/**
 * Функция для динамической генерации полей ввода подключения
 * @template AuthData - Тип данных аутентификации
 */
export type FunctionConnectionInputField<AuthData extends AnyRecord = {}> = (
  service: ExecuteService,
  bundle: ConnectionExecuteBundle<AuthData>
) => ConnectionInputField<AuthData>[];

/**
 * Подключение к внешнему сервису
 *
 * Определяет поля для аутентификации и методы для проверки и обновления подключения
 *
 * @template AuthData - Тип данных аутентификации
 * @template AdditionalAuthData - Дополнительные данные аутентификации
 *
 * @example
 * ```typescript
 * const apiConnection: IntegrationConnection = {
 *   label: 'API подключение',
 *   description: 'Подключение к внешнему API',
 *   inputFields: [
 *     {
 *       key: 'apiKey',
 *       type: 'password',
 *       label: 'API ключ',
 *       required: true
 *     }
 *   ],
 *   execute: (service, bundle) => {
 *     // Проверка подключения
 *   },
 *   refresh: (service, bundle) => {
 *     // Обновление токена
 *   }
 * };
 * ```
 */
export type IntegrationConnection<
  AuthData extends AnyRecord = {},
  AdditionalAuthData extends AnyRecord = {},
> = {
  /** Название подключения */
  label: string;
  /** Описание подключения */
  description: string;
  /** Поля ввода для аутентификации */
  inputFields: (
    | ConnectionInputField<AuthData, AdditionalAuthData>
    | FunctionConnectionInputField<AuthData>
  )[];
  /** Функция проверки подключения */
  execute: ConnectionExecute<AuthData & AdditionalAuthData>;
  /** Функция обновления подключения (например, обновление токена) */
  refresh: ConnectionExecute<AuthData & AdditionalAuthData>;
};
