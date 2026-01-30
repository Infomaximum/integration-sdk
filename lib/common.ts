/**
 * Общий тип для объекта с произвольными ключами и значениями
 */
export type AnyRecord = Record<string, any>;

/**
 * Базовая конфигурация HTTP-запроса
 */
export type BaseRequestConfig = {
  /** URL для запроса */
  url: string;
  /** HTTP заголовки */
  headers?: Record<string, string>;
  /** Режим повторных попыток */
  repeatMode?: boolean;
  /** Таймаут запроса в миллисекундах */
  timeout?: number;
};

/**
 * Конфигурация GET-запроса
 */
export type GetRequestConfig = BaseRequestConfig & {
  method: "GET";
};

/**
 * Конфигурация для загрузки файлов через multipart/form-data
 */
export type MultipartBodyConfig = {
  /** Ключ поля формы */
  key: string;
  /** Имя файла */
  fileName: string;
  /** Содержимое файла в виде ArrayBuffer */
  fileValue: ArrayBuffer;
  /** MIME-тип файла */
  contentType: string;
};

/**
 * Конфигурация для запросов с изменением данных (POST, PATCH, PUT, DELETE)
 */
export type MutatingRequestConfig = BaseRequestConfig & {
  method: "POST" | "PATCH" | "PUT" | "DELETE";
  /** Тело запроса в формате JSON */
  jsonBody?: any;
  /** Тело запроса в формате multipart/form-data */
  multipartBody?: MultipartBodyConfig[];
};

/**
 * Общая конфигурация HTTP-запроса
 */
export type RequestConfig = GetRequestConfig | MutatingRequestConfig;

/**
 * Результат выполнения HTTP-запроса
 * @template Response - Тип ответа (по умолчанию ArrayBuffer)
 */
export type RequestResult<Response = ArrayBuffer> = {
  /** HTTP статус код */
  status: number;
  /** Тело ответа */
  response: Readonly<Response> | undefined;
};

/**
 * Сервис аутентификации для выполнения операций
 */
export type ExecuteServiceAuth = {
  /**
   * Хук для обработки аутентификации
   * @param fn - Функция для генерации URL с аутентификацией
   * @param guid - Уникальный идентификатор
   * @param timeout - Таймаут операции
   * @returns URL с аутентификацией или undefined
   */
  hook: (
    fn: (url: string, headers: Record<string, string>) => string,
    guid: string,
    timeout: number
  ) => string | undefined;
};

/**
 * Утилиты для работы с данными
 */
export type ExecuteServiceUtils = {
  /**
   * Кодирование строки в Base64
   * @param input - Входная строка
   * @returns Закодированная строка
   */
  base64Encode: (input: string) => string;
  
  /**
   * Декодирование строки из Base64
   * @param input - Закодированная строка
   * @returns Декодированная строка
   */
  base64Decode: (input: string) => string;
  
  /**
   * Генерация ошибки с сообщением
   * @param message - Текст ошибки
   * @throws Всегда выбрасывает исключение
   */
  stringError(message: string): never;
};

/**
 * Сервис для выполнения сетевых запросов
 */
export type ExecuteServiceNetwork = {
  /**
   * Выполнение HTTP-запроса
   * @template Response - Тип ответа
   * @param config - Конфигурация запроса
   * @returns Результат запроса
   */
  request: <Response>(config: RequestConfig) => RequestResult<Response>;
};

/**
 * Основной сервис для выполнения операций в блоках и подключениях
 * Предоставляет методы для HTTP-запросов, аутентификации и работы с данными
 */
export type ExecuteService = ExecuteServiceAuth & ExecuteServiceNetwork & ExecuteServiceUtils;
