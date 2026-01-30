import type {
  RequestConfig,
  ExecuteService,
  MutatingRequestConfig,
  MultipartBodyConfig,
  AnyRecord,
} from "../../common";

import { URLSearchParams } from "./URL";

/**
 * Интерфейс HTTP-клиента
 */
interface IHttpClient {
  /** HTTP заголовки по умолчанию */
  headers: Record<string, string>;
  /** Выполнение HTTP-запроса */
  request<T>(config: RequestConfig): T | ArrayBuffer | undefined;
}

/**
 * Тип возвращаемого значения для GET-запросов
 * @template T - Тип данных
 * @template IsFile - Флаг, указывающий на загрузку файла
 */
type GetReturn<T, IsFile extends boolean> = IsFile extends true ? ArrayBuffer : T;

/**
 * HTTP-клиент для выполнения запросов к REST API
 *
 * Предоставляет удобный интерфейс для работы с HTTP-запросами,
 * автоматически добавляет заголовки и обрабатывает ошибки
 *
 * @example
 * ```typescript
 * const client = new HttpClient(
 *   { 'Authorization': 'Bearer token' },
 *   service
 * );
 *
 * const response = client.request({
 *   url: 'https://api.example.com/data',
 *   method: 'GET'
 * });
 * ```
 */
export class HttpClient implements IHttpClient {
  headers: Record<string, string>;
  private executeService: ExecuteService;

  /**
   * Создает экземпляр HTTP-клиента
   * @param headers - HTTP заголовки по умолчанию
   * @param executeService - Сервис для выполнения запросов
   */
  constructor(headers: Record<string, string>, executeService: ExecuteService) {
    this.headers = headers;
    this.executeService = executeService;
  }

  /**
   * Выполняет HTTP-запрос
   * @template T - Тип ответа
   * @param config - Конфигурация запроса
   * @param isFile - Флаг загрузки файла (если true, возвращает ArrayBuffer)
   * @returns Ответ сервера или undefined
   * @throws Error при ошибке HTTP или парсинга ответа
   */
  request<T>(config: RequestConfig, isFile: boolean = false): T | ArrayBuffer | undefined {
    // Объединяем заголовки запроса с заголовками клиента
    const requestConfig: RequestConfig = {
      ...config,
      headers: { ...config.headers, ...this.headers },
    };

    // Выполняем запрос
    const response = this.executeService.request<ArrayBuffer>(requestConfig);

    // Проверяем статус
    if (response.status < 200 || response.status >= 300) {
      const errorText = response.response
        ? new TextDecoder().decode(response.response)
        : "Empty response body";
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    if (response.status === 204) return; // No Content

    try {
      return isFile
        ? (response.response as ArrayBuffer)
        : (new TextDecoder().decode(response.response as ArrayBuffer) as T);
    } catch (err) {
      throw new Error(`Failed to decode response: ${(err as Error).message}`);
    }
  }
}

/**
 * Создает API-клиент с удобными методами для HTTP-запросов
 *
 * @param client - Экземпляр HttpClient
 * @returns Объект с методами для выполнения HTTP-запросов
 *
 * @example
 * ```typescript
 * const client = new HttpClient({ 'Authorization': 'Bearer token' }, service);
 * const api = createApiClient(client);
 *
 * // GET запрос
 * const data = api.get<{ id: number }>('https://api.example.com/data');
 *
 * // POST запрос с JSON
 * const result = api.post('https://api.example.com/data', {
 *   jsonBody: { name: 'Test' }
 * });
 *
 * // Загрузка файла
 * const file = api.get('https://api.example.com/file.pdf', true);
 *
 * // Загрузка файла через multipart
 * api.post('https://api.example.com/upload', {
 *   multipartBody: [{
 *     key: 'file',
 *     fileName: 'document.pdf',
 *     fileValue: arrayBuffer,
 *     contentType: 'application/pdf'
 *   }]
 * });
 * ```
 */

type ApiOptions = {
  headers?: Record<string, string>;
  timeout?: number;
  repeatMode?: boolean;
};
export const createApiClient = (client: HttpClient) => {
  const requestWrapper = <T>(
    url: string,
    method: RequestConfig["method"],
    options?: ApiOptions & { isFile?: boolean },
    body?: { jsonBody?: unknown; multipartBody?: MultipartBodyConfig[] }
  ): T => {
    return client.request<T>(
      { url, method, ...options, ...body } as RequestConfig,
      options?.isFile ?? false
    ) as T;
  };

  return {
    /**
     * Выполняет GET-запрос
     * @template T - Тип ответа
     * @template IsFile - Флаг загрузки файла
     * @param url - URL запроса
     * @param isFile - Загрузка файла (возвращает ArrayBuffer)
     * @param options - Дополнительные опции (заголовки, таймаут)
     * @returns Ответ сервера
     */
    get: <T>(url: string, options?: ApiOptions) => requestWrapper<T>(url, "GET", options),
    /**
     * Выполняет GET-запрос для загрузки файла
     * @param url - URL запроса
     * @param options - Дополнительные опции (заголовки, таймаут)
     * @returns Загруженный файл в виде ArrayBuffer
     */
    getFile: (url: string, options?: ApiOptions) =>
      requestWrapper<ArrayBuffer>(url, "GET", { ...options, isFile: true }),
    /**
     * Выполняет POST-запрос
     * @template T - Тип ответа
     * @param url - URL запроса
     * @param body - Тело запроса (JSON или multipart)
     * @param headers - Дополнительные HTTP заголовки
     * @returns Ответ сервера
     */
    post: <T>(
      url: string,
      body: { jsonBody?: unknown; multipartBody?: MultipartBodyConfig[] },
      options?: ApiOptions
    ) => requestWrapper<T>(url, "POST", options, body),
    /**
     * Выполняет PATCH-запрос
     * @template T - Тип ответа
     * @param url - URL запроса
     * @param body - Тело запроса (JSON или multipart)
     * @param options - Дополнительные опции (заголовки, таймаут)
     * @returns Ответ сервера
     */
    patch: <T>(
      url: string,
      body: { jsonBody?: unknown; multipartBody?: MultipartBodyConfig[] },
      options?: ApiOptions
    ) => requestWrapper<T>(url, "PATCH", options, body),

    /**
     * Выполняет PUT-запрос
     * @template T - Тип ответа
     * @param url - URL запроса
     * @param body - Тело запроса (JSON или multipart)
     * @param options - Дополнительные опции (заголовки, таймаут)
     * @returns Ответ сервера
     */
    put: <T>(
      url: string,
      body: { jsonBody?: unknown; multipartBody?: MultipartBodyConfig[] },
      options?: ApiOptions
    ) => requestWrapper<T>(url, "PUT", options, body),
    /**
     * Выполняет DELETE-запрос
     * @template T - Тип ответа
     * @param url - URL запроса
     * @param headers - Дополнительные HTTP заголовки
     * @returns Ответ сервера
     */
    delete: <T>(url: string, options?: ApiOptions) => requestWrapper<T>(url, "DELETE", options),
  };
};
