import type { RequestResult } from "../../../common";
import type { IRequestInterceptor } from "../types";

/**
 * Перехватчик ошибок HTTP
 *
 * @example
 * ```typescript
 * const errorInterceptor = new ErrorInterceptor({
 *   onHttpError: (status, body) => {
 *     if (status === 401) {
 *       // Обработка ошибки авторизации
 *     }
 *   }
 * });
 * ```
 */
export class ErrorInterceptor implements IRequestInterceptor {
  private options: {
    onHttpError?: (status: number, body: string) => void;
    onNetworkError?: (error: Error) => void;
  };
  constructor(
    options: {
      onHttpError?: (status: number, body: string) => void;
      onNetworkError?: (error: Error) => void;
    } = {}
  ) {
    this.options = options;
  }

  onResponse<T>(response: RequestResult<T>): RequestResult<T> {
    if (response.status < 200 || response.status >= 300) {
      const errorText = response.response
        ? new TextDecoder().decode(response.response as unknown as ArrayBuffer)
        : "Empty response body";

      if (this.options.onHttpError) {
        this.options.onHttpError(response.status, errorText);
      }

      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response;
  }

  onError(error: Error): never {
    if (this.options.onNetworkError) {
      this.options.onNetworkError(error);
    }
    throw error;
  }
}
