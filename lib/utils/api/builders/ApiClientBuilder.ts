import type { ExecuteService } from "../../../common";
import { HttpClient, GraphQLClient, BaseClient } from "../clients";
import { ErrorInterceptor } from "../interceptors/";

import type { IClientConfig } from "../types";

type ClientConstructor<T extends BaseClient> = new (
  config: IClientConfig,
  service: ExecuteService
) => T;

/**
 * Builder для создания API клиента с fluent interface
 *
 * Позволяет гибко настраивать HTTP,GraphQL и кастомные клиенты,
 * добавлять interceptors и создавать удобный API
 *
 * @template T Тип итогового клиента (HttpClient | GraphQLClient | custom).
 *             Определяется методом setClient(). Обеспечивает type-safety
 *             для методов созданного клиента (.get(), .post(), .gql() и т.д.)
 *
 * @example
 * // Создание REST клиента
 * const api = ApiClientBuilder
 *   .create(executeService)
 *   .setClient(HttpClient)
 *   .withBaseUrl('https://api.example.com')
 *   .withAuth('Bearer token')
 *   .withTimeout(5000)
 *   .withErrorHandling({
 *     onHttpError: (status, body) => console.error(`HTTP Error ${status}: ${body}`),
 *     onNetworkError: (error) => console.error('Network Error:', error.message)
 *   })
 *   .build();
 *
 * // Использование REST клиента
 * const users = await api.get<User[]>('/users');
 * const user = await api.post<User>('/users', { jsonBody: { name: 'John' } });
 *
 * @example
 * // Создание GraphQL клиента
 * const gqlClient = ApiClientBuilder
 *   .create(executeService)
 *   .setClient(GraphQLClient)
 *   .withBaseUrl('https://api.example.com/graphql')
 *   .withHeaders({ 'X-API-Version': '2.0' })
 *   .withTimeout(10000)
 *   .withRepeatMode(true)
 *   .build();
 *
 * // Использование GraphQL клиента
 * const data = await gqlClient.query<{ users: User[] }>(`
 *   query { users { id name email } }
 * `);
 *
 * @example
 * // Создание custom клиента
 * class MyCustomClient extends BaseClient {
 *   async customMethod() {
 *     return this.execute({ url: '/custom', method: 'GET' });
 *   }
 * }
 *
 * const customClient = ApiClientBuilder
 *   .create(executeService)
 *   .setClient(MyCustomClient)
 *   .withBaseUrl('https://custom-api.com')
 *   .build();
 *
 * @see {@link HttpClient} - Клиент для REST API
 * @see {@link GraphQLClient} - Клиент для GraphQL API
 * @see {@link BaseClient} - Базовый класс для создания собственных клиентов
 * @see {@link IClientConfig} - Интерфейс конфигурации клиента
 *
 * @template T Тип клиента, расширяющий BaseClient
 */
export default class ApiClientBuilder<T extends BaseClient = BaseClient> {
  /**
   * Конфигурация клиента, накапливаемая в процессе построения.
   * Содержит baseUrl, headers, timeout и другие параметры.
   * @private
   */
  private config: IClientConfig = {};
  /**
   * Обработчики ошибок, применяемые через ErrorInterceptor при построении клиента.
   * @private
   */
  private errorHandlers?: {
    onHttpError?: (status: number, body: string) => void;
    onNetworkError?: (error: Error) => void;
  };
  /**
   * Ссылка на класс клиента, который будет создан методом build().
   * Устанавливается через метод
   * {@link setClient}
   * @private
   */
  private ClientClass?: ClientConstructor<T>;
  private readonly service: ExecuteService;

  private constructor(service: ExecuteService) {
    this.service = service;
  }
  /**
   * Инициализирует процесс сборки клиента.
   * Точка входа для создания билдера.
   *
   * @param service  - Сервис выполнения запросов платформы
   * @returns Новый экземпляр билдера
   *
   * @example
   * const builder = ApiClientBuilder.create(executeService);
   */
  static create(service: ExecuteService): ApiClientBuilder {
    return new ApiClientBuilder(service);
  }
  /**
   * Определяет тип клиента, который будет создан.
   * Метод изменяет generic-тип билдера для обеспечения type-safety.
   *
   * @template U Класс конкретного клиента (например, HttpClient или GraphQLClient).
   *            Должен расширять BaseClient.
   * @param clientClass - Ссылка на конструктор класса клиента
   * @returns Типизированный билдер для выбранного клиента
   *
   * @example
   * const httpBuilder = ApiClientBuilder
   *   .create(service)
   *   .setClient(HttpClient); // Теперь билдер типизирован как ApiClientBuilder<HttpClient>
   *
   * @example
   * const gqlBuilder = ApiClientBuilder
   *   .create(service)
   *   .setClient(GraphQLClient); // Типизирован как ApiClientBuilder<GraphQLClient>
   *
   * @see {@link HttpClient}
   * @see {@link GraphQLClient}
   */
  withClient<U extends BaseClient>(clientClass: ClientConstructor<U>) {
    const typedBuilder = this as unknown as ApiClientBuilder<U>;
    typedBuilder.ClientClass = clientClass;
    return typedBuilder;
  }
  /**
   * Устанавливает базовый URL API.
   * Все относительные пути в запросах будут добавляться к этому URL.
   *
   * @param baseUrl - Строка вида 'https://api.example.com' или 'https://api.example.com/v1'
   * @returns Текущий экземпляр билдера для цепочки вызовов
   *
   * @example
   * builder.withBaseUrl('https://api.example.com/v2');
   * // Теперь запрос к '/users' пойдет на 'https://api.example.com/v2/users'
   *
   * @see {@link IClientConfig.baseUrl}
   */
  withBaseUrl(baseUrl: string): this {
    this.config.baseUrl = baseUrl;
    return this;
  }
  /**
   * Добавляет набор стандартных HTTP-заголовков.
   * Новые заголовки объединяются с уже существующими (не заменяют их).
   *
   * @param headers - Объект типа "ключ-значение" с заголовками
   * @returns Текущий экземпляр билдера для цепочки вызовов
   *
   * @example
   * builder
   *   .withHeaders({ 'Content-Type': 'application/json' })
   *   .withHeaders({ 'X-API-Version': '2.0' });
   * // Результат: оба заголовка будут включены
   *
   * @example
   * // Кастомные заголовки для аналитики
   * builder.withHeaders({
   *   'X-Request-ID': generateRequestId(),
   *   'X-Client-Version': '1.2.3'
   * });
   *
   * @see {@link IClientConfig.headers}
   */
  withHeaders(headers: Record<string, string>): this {
    this.config.headers = { ...(this.config.headers || {}), ...headers };
    return this;
  }
  /**
   * Устанавливает максимальное время ожидания ответа от сервера.
   * При превышении таймаута запрос будет прерван с ошибкой.
   *
   * @param timeout - Время в миллисекундах
   * @returns Текущий экземпляр билдера для цепочки вызовов
   *
   * @default 30000 (30 секунд)
   *
   * @example
   * // Короткий таймаут для быстрых запросов
   * builder.withTimeout(3000); // 3 секунды
   *
   * @example
   * // Длинный таймаут для загрузки файлов
   * builder.withTimeout(120000); // 2 минуты
   *
   * @see {@link IClientConfig.timeout}
   */
  withTimeout(timeout: number): this {
    this.config.timeout = timeout;
    return this;
  }
  /**
   * Устанавливает заголовок авторизации 'Authorization'.
   * Упрощенный метод для добавления токена без необходимости использовать withHeaders.
   *
   * @param authHeader - Полная строка заголовка (например, 'Bearer YOUR_TOKEN' или 'Basic base64string')
   * @returns Текущий экземпляр билдера для цепочки вызовов
   *
   * @example
   * // JWT токен
   * builder.withAuth('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
   *
   * @example
   * // API ключ
   * builder.withAuth('ApiKey my-secret-key');
   *
   * @see {@link withHeaders}
   */
  withAuth(authHeader: string): this {
    this.config.headers = {
      ...(this.config.headers || {}),
      Authorization: authHeader,
    };
    return this;
  }
  /**
   * Включает или выключает режим автоматических повторных запросов при сбоях.
   * Полезно для нестабильных сетей или временных проблем на сервере.
   *
   * @param repeatMode - Если true, платформа попытается повторить запрос при ошибке
   * @returns Текущий экземпляр билдера для цепочки вызовов
   *
   * @default false
   *
   * @example
   * // Включить повторы для production окружения
   * builder.withRepeatMode(true);
   *
   * @example
   * // Отключить для локальной разработки
   * builder.withRepeatMode(false);
   *
   * @see {@link IClientConfig.repeatMode}
   */
  withRepeatMode(repeatMode: boolean): this {
    this.config.repeatMode = repeatMode;
    return this;
  }
  /**
   * Настраивает глобальный перехватчик ошибок для всех типов запросов (REST и GraphQL).
   * Позволяет централизованно обрабатывать HTTP ошибки и сетевые сбои.
   *
   * @param handlers - Объект с функциями обратного вызова
   * @param handlers.onHttpError - Функция, вызываемая при HTTP ошибках (4xx, 5xx).
   *                                Принимает HTTP статус код и тело ответа.
   * @param handlers.onNetworkError - Функция, вызываемая при сетевых сбоях
   *                                   (DNS ошибки, таймаут, отказ в соединении).
   *                                   Принимает объект Error.
   * @returns Текущий экземпляр билдера для цепочки вызовов
   *
   * @example
   * // Базовая обработка ошибок
   * builder.withErrorHandling({
   *   onHttpError: (status, body) => {
   *     console.error(`HTTP Error ${status}:`, body);
   *     if (status === 401) {
   *       // Перенаправление на логин
   *       router.push('/login');
   *     }
   *   },
   *   onNetworkError: (error) => {
   *     console.error('Network failed:', error.message);
   *     showToast('Проверьте подключение к интернету');
   *   }
   * });
   *
   * @example
   * // Продвинутая обработка с логированием
   * builder.withErrorHandling({
   *   onHttpError: (status, body) => {
   *     logger.error('API_HTTP_ERROR', { status, body });
   *
   *     switch (status) {
   *       case 401:
   *         refreshToken();
   *         break;
   *       case 403:
   *         showAccessDenied();
   *         break;
   *       case 500:
   *         showServerError();
   *         break;
   *     }
   *   },
   *   onNetworkError: (error) => {
   *     logger.error('API_NETWORK_ERROR', {
   *       message: error.message,
   *       stack: error.stack
   *     });
   *     offline.enable();
   *   }
   * });
   *
   * @see {@link ErrorInterceptor}
   */
  withErrorHandling(handlers: typeof this.errorHandlers): this {
    this.errorHandlers = handlers;
    return this;
  }
  /**
   * Финализирует настройку и создает экземпляр клиента.
   * Применяет все накопленные настройки и interceptors.
   *
   * @returns Экземпляр сконфигурированного клиента выбранного типа
   * @throws {Error} Если не был вызван метод setClient() перед build()
   *
   * @example
   * const client = ApiClientBuilder
   *   .create(service)
   *   .setClient(HttpClient)
   *   .withBaseUrl('https://api.example.com')
   *   .build();
   *
   * // Теперь можно использовать клиент
   * const data = await client.get('/endpoint');
   *
   * @example
   * // Обработка ошибки при отсутствии setClient
   * try {
   *   const client = ApiClientBuilder.create(service).build();
   * } catch (error) {
   *   service.stringError(error.message);
   *   // "Client class is not defined. Call .setClient(HttpClient) before .build()"
   * }
   */
  build(): T {
    if (!this.ClientClass) {
      throw new Error("Client class is not defined. Call .client(HttpClient) before .build()");
    }
    const client = new this.ClientClass(this.config, this.service);

    if (this.errorHandlers) {
      client.use(new ErrorInterceptor(this.errorHandlers));
    }
    return client as T;
  }
}
