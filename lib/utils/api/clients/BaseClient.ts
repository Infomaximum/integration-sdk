import type { ExecuteService, RequestConfig, RequestResult } from "../../../common";
import type { IClientConfig, IRequestInterceptor } from "../types";

/**
 * Базовый клиент с поддержкой interceptors
 *
 * Предоставляет общую функциональность для всех типов клиентов
 */
export abstract class BaseClient {
  protected config: Required<IClientConfig>;
  protected interceptors: IRequestInterceptor[] = [];
  protected readonly service: ExecuteService;
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
   * Добавляет перехватчик (interceptor) в цепочку обработки.
   * * @remarks
   * Перехватчики выполняются в порядке их добавления (FIFO).
   * Обработчик ошибок `ErrorInterceptor` всегда добавляется последним при использовании билдера.
   */
  use(interceptor: IRequestInterceptor): this {
    this.interceptors.push(interceptor);
    return this;
  }

  /**
   * Устанавливает заголовок
   */
  setHeader(key: string, value: string): this {
    this.config.headers[key] = value;
    return this;
  }

  /**
   * Удаляет заголовок
   */
  removeHeader(key: string): this {
    delete this.config.headers[key];
    return this;
  }

  /**
   * Выполняет запрос с применением interceptors
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
    // 3. Если мы дошли сюда, значит сервер ОТВЕТИЛ (даже если там 404 или 500)
    for (const interceptor of this.interceptors) {
      if (interceptor.onResponse) {
        // Здесь ErrorInterceptor увидит статус 400+ и вызовет onHttpError
        response = interceptor.onResponse(response);
      }
    }

    return response;
  }

  /**
   * Объединяет конфигурации
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
   * Формирует полный URL
   */
  protected buildUrl(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${this.config.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}
