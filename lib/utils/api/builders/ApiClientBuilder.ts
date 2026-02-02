import type { ExecuteService } from "../../../common";
import { HttpClient, GraphQLClient } from "../clients";
import { ErrorInterceptor } from "../interceptors/";

import type { IClientConfig, IRequestOptions, IRequestBody } from "../types";

/**
 * Builder для создания API клиента с fluent interface
 *
 * Позволяет гибко настраивать HTTP и GraphQL клиенты,
 * добавлять interceptors и создавать удобный API
 *
 * @example
 * ```typescript
 * const api = ApiClientBuilder
 *   .create(executeService)
 *   .withBaseUrl('https://api.example.com')
 *   .withAuth('Bearer token')
 *   .withTimeout(5000)
 *   .withErrorHandling({
 *     onHttpError: (status) => console.error(`Error: ${status}`)
 *   })
 *   .build();
 *
 * // Использование
 * const users = api.get<User[]>('/users');
 * const user = api.post<User>('/users', { jsonBody: { name: 'John' } });
 * const gqlData = api.gql<{ users: User[] }>('query { users { id name } }');
 * ```
 */
export default class ApiClientBuilder {
  private config: IClientConfig = {};
  private errorHandlers?: {
    onHttpError?: (status: number, body: string) => void;
    onNetworkError?: (error: Error) => void;
  };
  //TODO: Подумать как лучше реализовать ретраи
  //   private retryConfig?: {
  //     maxRetries: number;
  //     retryDelay: number;
  //     retryCondition?: (error: Error) => boolean;
  //   };
  private readonly service: ExecuteService;
  private constructor(executeService: ExecuteService) {
    this.service = executeService;
  }
  /**
   * Приватный конструктор. Используйте статический метод {@link ApiClientBuilder.create}
   * @param executeService - Сервис выполнения запросов платформы
   */
  static create(executeService: ExecuteService): ApiClientBuilder {
    return new ApiClientBuilder(executeService);
  }
  /**
   * Устанавливает базовый URL для всех последующих запросов.
   * * @remarks
   * Если базовый URL не указан, во всех вызываемых методах (get, post и т.д.)
   * необходимо будет указывать абсолютный путь, начинающийся с http:// или https://.
   * * @param baseUrl - Корневой URL API (например, 'https://api.site.com/v1').
   */
  withBaseUrl(baseUrl: string) {
    this.config.baseUrl = baseUrl;
    return this;
  }
  /**
   * Добавляет набор стандартных HTTP-заголовков.
   * Новые заголовки объединяются с уже существующими.
   * @param headers - Объект типа "ключ-значение" с заголовками.
   * @returns Текущий экземпляр билдера.
   */
  withHeaders(headers: Record<string, string>) {
    this.config.headers = { ...(this.config.headers || {}), ...headers };
    return this;
  }
  /**
   * Устанавливает максимальное время ожидания ответа.
   * @param timeout - Время в миллисекундах (по умолчанию обычно 30000).
   * @default timeout 30000
   * @returns Текущий экземпляр билдера.
   */
  withTimeout(timeout: number) {
    this.config.timeout = timeout;
    return this;
  }
  /**
   * Устанавливает заголовок авторизации 'Authorization'.
   * @param authHeader - Полная строка заголовка (например, 'Bearer YOUR_TOKEN').
   * @returns Текущий экземпляр билдера.
   */
  withAuth(authHeader: string) {
    this.config.headers = {
      ...(this.config.headers || {}),
      Authorization: authHeader,
    };
    return this;
  }
  /**
   * Включает или выключает режим повторных запросов платформы при сбоях.
   * @param repeatMode - Если true, платформа попытается повторить запрос при ошибке.
   * @returns Текущий экземпляр билдера.
   */
  withRepeatMode(repeatMode: boolean) {
    this.config.repeatMode = repeatMode;
    return this;
  }
  /**
   * Настраивает глобальный перехватчик ошибок для всех типов запросов (REST и GraphQL).
   * @param handlers - Объект с функциями обратного вызова.
   * @param handlers.onHttpError - Вызывается при получении HTTP статуса 4xx или 5xx.
   * @param handlers.onNetworkError - Вызывается при сетевых сбоях (DNS, таймаут, отказ в соединении).
   * @returns Текущий экземпляр билдера.
   */
  withErrorHandling(handlers: {
    onHttpError?: (status: number, body: string) => void;
    onNetworkError?: (error: Error) => void;
  }) {
    this.errorHandlers = handlers;
    return this;
  }
  /**
   * Финализирует настройку и создает скомпонованный объект клиента.
   * В процессе сборки автоматически подключает интерцепторы и настраивает прокси-методы.
   * * @returns Объект, содержащий методы для выполнения запросов:
   * - `get`, `post`, `put`, `patch`, `delete`: REST-методы.
   * - `gql`: Метод для работы с GraphQL.
   * - `http`, `graphql`: Прямой доступ к инстансам соответствующих клиентов.
   */
  build() {
    const http = new HttpClient(this.config, this.service);
    const graphql = new GraphQLClient(this.config, this.service);

    // Добавляем перехватчик ошибок, если указаны обработчики
    if (this.errorHandlers) {
      const errorInterceptor = new ErrorInterceptor(this.errorHandlers);
      http.use(errorInterceptor);
      graphql.use(errorInterceptor);
    }
    return {
      /**
       * Выполняет GET-запрос.
       * @remarks
       * Если сервер возвращает статус 204 (No Content), метод вернет `undefined`.
       * Если ответ не является валидным JSON, он будет возвращен как обычная строка.
       * * @param path - Относительный путь (при наличии baseUrl) или полный URL.
       * @returns Декодированный JSON объект, строка или undefined.
       */
      get: <T>(url: string, options?: IRequestOptions) => http.get<T>(url, options),
      /**
       * Загружает файл и возвращает его содержимое в виде ArrayBuffer.
       * * @example
       * ```typescript
       * const buffer = api.getFile('/reports/1.pdf');
       * if (buffer) {
       * // Дальнейшая обработка
       * }
       * ```
       */
      getFile: (url: string, options?: IRequestOptions) => http.getFile(url, options),
      post: <T>(url: string, body?: IRequestBody, options?: IRequestOptions) =>
        http.post<T>(url, body, options),
      put: <T>(url: string, body?: IRequestBody, options?: IRequestOptions) =>
        http.put<T>(url, body, options),
      patch: <T>(url: string, body?: IRequestBody, options?: IRequestOptions) =>
        http.patch<T>(url, body, options),
      delete: <T>(url: string, options?: IRequestOptions) => http.delete<T>(url, options),
      gql: <T>(query: string, variables?: Record<string, any>, options?: IRequestOptions) =>
        graphql.request<T>(query, variables, options),

      http: http,
      graphql: graphql,
    };
  }
}
