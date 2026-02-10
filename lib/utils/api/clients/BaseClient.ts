import type { ExecuteService, RequestConfig, RequestResult } from "../../../common";
import type { IClientConfig, IRequestInterceptor } from "../types";

/**
 * Базовый класс для всех API клиентов с поддержкой interceptors.
 *
 * Предоставляет общую функциональность для HTTP, GraphQL и других типов клиентов:
 * - Управление конфигурацией (baseUrl, headers, timeout)
 * - Цепочка перехватчиков (interceptors) для обработки запросов/ответов
 * - Утилиты для формирования URL и объединения конфигураций
 *
 * @abstract
 * @class
 *
 * @example
 * // Создание собственного клиента
 * class MyCustomClient extends BaseClient {
 *    fetchData<T>(endpoint: string): Promise<T> {
 *     const response = this.executeRequest({
 *       url: this.buildUrl(endpoint),
 *       method: 'GET'
 *     });
 *     return JSON.parse(new TextDecoder().decode(response.response));
 *   }
 * }
 *
 * @example
 * // Использование встроенных методов
 * class ApiClient extends BaseClient {
 *   constructor(config: IClientConfig, service: ExecuteService) {
 *     super(config, service);
 *     this.setHeader('X-App-Version', '1.0.0');
 *   }
 * }
 *
 * @see {@link IRequestInterceptor} - Интерфейс для создания перехватчиков
 */
export abstract class BaseClient {
  /**
   * Полная конфигурация клиента с значениями по умолчанию.
   * Содержит baseUrl, headers, timeout и repeatMode.
   * @protected
   */
  protected config: Required<IClientConfig>;
  /**
   * Массив перехватчиков запросов и ответов.
   * Выполняются в порядке добавления (FIFO).
   * @protected
   * @see {@link use}
   */
  protected interceptors: IRequestInterceptor[] = [];
  protected readonly service: ExecuteService;

  /**
   * Создает экземпляр базового клиента.
   *
   * Инициализирует конфигурацию со значениями по умолчанию:
   * - baseUrl: пустая строка или переданное значение (обрезает trailing slash)
   * - headers: пустой объект или переданные заголовки
   * - timeout: 30000 мс (30 секунд) или переданное значение
   * - repeatMode: false или переданное значение
   *
   * @param config - Конфигурация клиента
   * @param service - Сервис выполнения запросов платформы
   *
   * @example
   * class MyClient extends BaseClient {
   *   constructor(config: IClientConfig, service: ExecuteService) {
   *     super(config, service);
   *     // Дополнительная инициализация
   *   }
   * }
   *
   * @see {@link IClientConfig}
   */
  constructor(config: IClientConfig, service: ExecuteService) {
    this.service = service;
    this.config = {
      baseUrl: config.baseUrl?.replace(/\/+$/, "") || "",
      headers: config.headers || {},
      timeout: config.timeout || 30000,
      repeatMode: config.repeatMode ?? false,
    };
  }

  /**
   * Добавляет перехватчик (interceptor) в цепочку обработки запросов и ответов.
   *
   * Перехватчики позволяют изменять запросы перед отправкой (onRequest),
   * обрабатывать ответы (onResponse) и ошибки (onError).
   *
   * @param interceptor - Объект перехватчика с методами onRequest/onResponse/onError
   * @returns Текущий экземпляр клиента для цепочки вызовов
   *
   * @example
   * // Добавление логирования
   * client.use({
   *   onRequest: (config) => {
   *     service.stringError('Sending request:', config.url);
   *     return config;
   *   },
   *   onResponse: (response) => {
   *     service.stringError('Received response:', response.status);
   *     return response;
   *   }
   * });
   *
   * @example
   * // Добавление обработки ошибок
   * client.use(new ErrorInterceptor({
   *   onHttpError: (status, body) => {
   *     if (status === 401) redirectToLogin();
   *   },
   *   onNetworkError: (error) => {
   *     showOfflineMessage();
   *   }
   * }));
   *
   * @example
   * // Цепочка перехватчиков
   * client
   *   .use(authInterceptor)
   *   .use(loggingInterceptor)
   *   .use(errorInterceptor);
   *
   * @remarks
   * - Перехватчики выполняются в порядке их добавления (FIFO)
   * - Обработчик ошибок ErrorInterceptor обычно добавляется последним
   * - При использовании ApiClientBuilder, ErrorInterceptor добавляется автоматически
   *
   * @see {@link IRequestInterceptor}
   * @see {@link ErrorInterceptor}
   */
  use(interceptor: IRequestInterceptor): this {
    this.interceptors.push(interceptor);
    return this;
  }

  /**
   * Устанавливает или обновляет HTTP заголовок.
   *
   * @param key - Название заголовка (например, 'Content-Type', 'Authorization')
   * @param value - Значение заголовка
   * @returns Текущий экземпляр клиента для цепочки вызовов
   *
   * @example
   * // Установка Content-Type
   * client.setHeader('Content-Type', 'application/json');
   *
   * @example
   * // Обновление токена авторизации
   * client.setHeader('Authorization', `Bearer ${newToken}`);
   *
   * @example
   * // Кастомные заголовки
   * client
   *   .setHeader('X-API-Key', 'secret-key')
   *   .setHeader('X-Request-ID', generateId());
   *
   * @see {@link removeHeader}
   */
  setHeader(key: string, value: string): this {
    this.config.headers[key] = value;
    return this;
  }

  /**
   * Удаляет HTTP заголовок из конфигурации клиента.
   *
   * @param key - Название заголовка для удаления
   * @returns Текущий экземпляр клиента для цепочки вызовов
   *
   * @example
   * // Удаление авторизации (logout)
   * client.removeHeader('Authorization');
   *
   * @example
   * // Удаление кастомного заголовка
   * client.removeHeader('X-API-Key');
   *
   * @example
   * // Цепочка операций
   * client
   *   .removeHeader('Authorization')
   *   .setHeader('X-Guest-Session', guestId);
   *
   * @see {@link setHeader}
   */
  removeHeader(key: string): this {
    delete this.config.headers[key];
    return this;
  }

  /**
   * Выполняет HTTP запрос с применением всех зарегистрированных interceptors.
   *
   * Процесс выполнения:
   * 1. Применение onRequest interceptors (модификация конфига)
   * 2. Выполнение запроса через ExecuteService
   * 3. Обработка сетевых ошибок через onError interceptors
   * 4. Применение onResponse interceptors (обработка ответа)
   *
   * @template T Тип ожидаемого ответа (по умолчанию ArrayBuffer)
   * @param config - Конфигурация запроса (url, method, headers и т.д.)
   * @returns Результат выполнения запроса
   * @throws {Error} При сетевых ошибках (DNS, timeout, connection refused)
   * @protected
   *
   * @example
   * // Внутреннее использование в наследнике
   * protected fetchData(endpoint: string) {
   *   const response = this.executeRequest({
   *     url: this.buildUrl(endpoint),
   *     method: 'GET',
   *     headers: { 'Accept': 'application/json' }
   *   });
   *   return response;
   * }
   *
   * @remarks
   * - Метод автоматически применяет все interceptors в порядке их добавления
   * - Сетевые ошибки пробрасываются после вызова onError interceptors
   * - HTTP ошибки (4xx, 5xx) обрабатываются в onResponse interceptors
   *
   * @see {@link RequestConfig}
   * @see {@link RequestResult}
   * @see {@link IRequestInterceptor}
   */
  protected executeRequest<T = ArrayBuffer>(config: RequestConfig): RequestResult<T> {
    // Применяем onRequest interceptors
    let finalConfig = { ...config };
    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        finalConfig = interceptor.onRequest(finalConfig);
      }
    }

    let response: RequestResult<T>;

    try {
      // 2. Выполняем сам запрос
      response = this.service.request<T>(finalConfig);
    } catch (error) {
      // Сюда попадаем, только если запросу "плохо" (DNS, Сеть, Таймаут)
      for (const interceptor of this.interceptors) {
        if (interceptor.onError) {
          interceptor.onError(error as Error);
        }
      }
      throw error; // Пробрасываем сетевую ошибку дальше
    }

    for (const interceptor of this.interceptors) {
      if (interceptor.onResponse) {
        // Здесь ErrorInterceptor увидит статус 400+ и вызовет onHttpError
        response = interceptor.onResponse(response);
      }
    }

    return response;
  }

  /**
   * Объединяет конфигурацию клиента с конфигурацией конкретного запроса.
   *
   * Приоритет настроек:
   * - headers: объединяются (запрос перезаписывает клиент)
   * - timeout: используется из запроса, если задан, иначе из клиента
   * - repeatMode: используется из запроса, если задан, иначе из клиента
   *
   * @param requestConfig - Конфигурация конкретного запроса
   * @returns Объединенная конфигурация
   * @protected
   * @see {@link RequestConfig}
   */
  protected mergeConfig(requestConfig: Partial<RequestConfig>): RequestConfig {
    return {
      ...requestConfig,
      headers: {
        ...this.config.headers,
        ...requestConfig.headers,
      },
      timeout: requestConfig.timeout ?? this.config.timeout,
      repeatMode: requestConfig.repeatMode ?? this.config.repeatMode,
    } as RequestConfig;
  }

  /**
   * Формирует полный URL из baseUrl клиента и переданного пути.
   *
   * Логика работы:
   * - Если путь уже полный URL (начинается с http:// или https://) - возвращает как есть
   * - Иначе объединяет baseUrl с путем, добавляя `/` между ними при необходимости
   *
   * @param path - Относительный путь или полный URL
   * @returns Полный URL для запроса
   * @protected
   *
   * @example
   * // С baseUrl = 'https://api.example.com'
   * this.buildUrl('/users'); // 'https://api.example.com/users'
   * this.buildUrl('users');  // 'https://api.example.com/users'
   * this.buildUrl('https://other-api.com/data'); // 'https://other-api.com/data'
   *
   * @example
   * // Без baseUrl (пустая строка)
   * this.buildUrl('/api/users'); // '/api/users'
   * this.buildUrl('https://api.example.com/users'); // 'https://api.example.com/users'
   *
   * @remarks
   * - Автоматически добавляет `/` между baseUrl и путем если его нет
   * - Не добавляет лишний `/` если путь уже начинается с него
   * - Полные URL (с протоколом) используются без изменений
   */
  protected buildUrl(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${this.config.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}
