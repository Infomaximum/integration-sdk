/**
 * Базовые типы для API клиентов
 */

import type { MultipartBodyConfig, RequestConfig, RequestResult } from "../../common";

export interface IClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
  repeatMode?: boolean;
}

// GraphQL типы
export interface IGraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface IGraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, any>;
}

export interface IGraphQLResponse<T = any> {
  data?: T;
  errors?: IGraphQLError[];
  extensions?: Record<string, any>;
}

// Типы для API методов
export interface IRequestBody {
  jsonBody?: unknown;
  multipartBody?: MultipartBodyConfig[];
}

export interface IRequestOptions extends IClientConfig {
  isFile?: boolean;
}

/**
 * Интерфейс для перехватчиков запросов
 */
export interface IRequestInterceptor {
  onRequest?(config: RequestConfig): RequestConfig;
  onResponse?<T>(response: RequestResult<T>): RequestResult<T>;
  onError?(error: Error): never;
}

/**
 * Контекст выполнения запроса
 */
// export interface IRequestContext {
//   config: IRequestConfig;
//   startTime: number;
//   retryCount: number;
//   metadata: Record<string, any>;
// }
