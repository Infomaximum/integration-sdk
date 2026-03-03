import type { ExecuteService, RequestResult } from "../../../common";
import { BaseClient } from "./BaseClient";
import type { IClientConfig, IRequestOptions, IRequestBody, ApiResponse } from "../types";

/**
 * HTTP клиент для REST API
 *
 * Предоставляет методы для выполнения HTTP-запросов с автоматической
 * обработкой заголовков, ошибок и преобразованием данных
 *
 * @example
 * ```typescript
 * const client = new HttpClient(
 *   { baseUrl: 'https://api.example.com', headers: { 'Authorization': 'Bearer token' } },
 *   executeService
 * );
 *
 * // GET запрос
 * const data = client.get<User>('/users/1');
 *
 * // POST запрос
 * const newUser = client.post<User>('/users', {
 *   jsonBody: { name: 'John' }
 * });
 *
 * // Загрузка файла
 * const file = client.getFile('/documents/report.pdf');
 * ```
 */
export class HttpClient extends BaseClient {
  constructor(config: IClientConfig, executeService: ExecuteService) {
    super(config, executeService);
  }

  /**
   * Выполняет GET-запрос.
   * * @remarks
   * Если сервер возвращает статус 204 (No Content), метод вернет `undefined`.
   * Если ответ не является валидным JSON, он будет возвращен как обычная строка.
   * @param path - Относительный путь (при наличии baseUrl) или полный URL.
   * @returns @template T Декодированный JSON объект, строка или undefined.
   */
  get<T = any>(path: string, options?: IRequestOptions): ApiResponse<T> | undefined {
    const response = this.executeRequest<ArrayBuffer>(
      this.mergeConfig({
        url: this.buildUrl(path),
        method: "GET",
        ...options,
      })
    );

    return this.decodeResponse<T>(response, false);
  }

  /**
   * Выполняет GET-запрос для загрузки файла
   */
  getFile(path: string, options?: IRequestOptions): ArrayBuffer | undefined {
    const response = this.executeRequest<ArrayBuffer>(
      this.mergeConfig({
        url: this.buildUrl(path),
        method: "GET",
        ...options,
      })
    );

    return response.response;
  }

  /**
   * Выполняет POST-запрос
   */
  post<T = any>(
    path: string,
    body?: IRequestBody,
    options?: IRequestOptions
  ): ApiResponse<T> | undefined {
    return this.mutate<T>("POST", path, body, options);
  }

  /**
   * Выполняет PUT-запрос
   */
  put<T = any>(
    path: string,
    body?: IRequestBody,
    options?: IRequestOptions
  ): ApiResponse<T> | undefined {
    return this.mutate<T>("PUT", path, body, options);
  }

  /**
   * Выполняет PATCH-запрос
   */
  patch<T = any>(
    path: string,
    body?: IRequestBody,
    options?: IRequestOptions
  ): ApiResponse<T> | undefined {
    return this.mutate<T>("PATCH", path, body, options);
  }

  /**
   * Выполняет DELETE-запрос
   */
  delete<T = any>(path: string, options?: IRequestOptions): ApiResponse<T> | undefined {
    const response = this.executeRequest<ArrayBuffer>(
      this.mergeConfig({
        url: this.buildUrl(path),
        method: "DELETE",
        ...options,
      })
    );

    return this.decodeResponse<T>(response, false);
  }

  /**
   * Выполняет изменяющий запрос (POST/PUT/PATCH)
   */
  private mutate<T>(
    method: "POST" | "PUT" | "PATCH",
    path: string,
    body?: IRequestBody,
    options?: IRequestOptions
  ): ApiResponse<T> | undefined {
    const response = this.executeRequest<ArrayBuffer>(
      this.mergeConfig({
        url: this.buildUrl(path),
        method,
        ...body,
        ...options,
      })
    );

    return this.decodeResponse<T>(response, false);
  }

  /**
   * Декодирует ответ сервера
   */
  private decodeResponse<T>(data: RequestResult, isFile: boolean): ApiResponse<T> | any {
    const { status, response, headers } = data;
    // 204 No Content
    if (status === 204) {
      return undefined as T;
    }
    if (!response) {
      throw new Error("HTTP: Response buffer is empty!");
    }

    if (isFile) {
      return response as T;
    }

    try {
      const text = new TextDecoder().decode(response);

      // Пытаемся распарсить как JSON
      try {
        return { data: JSON.parse(text) as T, headers };
      } catch {
        // Если не JSON, возвращаем как текст
        return { data: text as unknown as T, headers };
      }
    } catch (err) {
      throw new Error(`Failed to decode response: ${(err as Error).message}`);
    }
  }
}
