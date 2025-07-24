import type {
  RequestConfig,
  ExecuteService,
  MutatingRequestConfig,
  MultipartBodyConfig,
} from "../../common";

interface IHttpClient {
  headers: Record<string, string>;
  request<T>(config: RequestConfig): T | ArrayBuffer;
}

type GetReturn<T, IsFile extends boolean> = IsFile extends true ? ArrayBuffer : T;

export class HttpClient implements IHttpClient {
  headers: Record<string, string>;
  private executeService: ExecuteService;

  constructor(headers: Record<string, string>, executeService: ExecuteService) {
    this.headers = headers;
    this.executeService = executeService;
  }
  request<T>(config: RequestConfig, isFile: boolean = false): T | ArrayBuffer {
    // Добавляем заголовок авторизации

    const requestConfig: RequestConfig = {
      ...config,
      headers: { ...config.headers, ...this.headers },
    };

    // ExecuteService.request может ожидать jsonBody или multipartBody,
    // подставим их из config (если есть)
    if ("jsonBody" in config && config.jsonBody !== undefined) {
      (requestConfig as MutatingRequestConfig).jsonBody = config.jsonBody;
    }
    if ("multipartBody" in config && config.multipartBody !== undefined) {
      (requestConfig as MutatingRequestConfig).multipartBody = config.multipartBody;
    }

    // Выполняем запрос
    const response = this.executeService.request<ArrayBuffer>(requestConfig);

    // Проверяем статус
    if (response.status < 200 || response.status >= 300) {
      const errorText = response.response
        ? new TextDecoder().decode(response.response)
        : "Empty response body";
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    if (response.status === 204) {
      throw new Error(`No Content: ${requestConfig.url}`);
    }

    // Парсим JSON из ArrayBuffer
    try {
      return isFile
        ? (response.response as ArrayBuffer)
        : (JSON.parse(new TextDecoder().decode(response.response as ArrayBuffer)) as T);
    } catch (err) {
      throw new Error(`Failed to parse JSON response: ${(err as Error).message}`);
    }
  }
}

export const createApiClient = (client: HttpClient) => ({
  get: <T, IsFile extends boolean = false>(
    url: string,
    isFile?: IsFile,
    headers?: Record<string, string>
  ) => client.request<T>({ url, method: "GET", headers }, isFile) as GetReturn<T, IsFile>,

  post: <T>(
    url: string,
    body: { jsonBody?: unknown; multipartBody?: MultipartBodyConfig[] },
    headers?: Record<string, string>
  ) =>
    client.request<T>({
      url,
      headers,
      method: "POST",
      ...(body.jsonBody ? { jsonBody: body.jsonBody } : {}),
      ...(body.multipartBody ? { multipartBody: body.multipartBody } : {}),
    }),
  patch: <T>(url: string, body: { jsonBody?: unknown }, headers?: Record<string, string>) =>
    client.request<T>({
      url,
      method: "PATCH",
      headers,
      ...(body.jsonBody ? { jsonBody: body.jsonBody } : {}),
    }),
  put: <T>(url: string, body: { jsonBody?: unknown }, headers?: Record<string, string>) =>
    client.request<T>({
      url,
      method: "PUT",
      headers,
      ...(body.jsonBody ? { jsonBody: body.jsonBody } : {}),
    }),
  delete: <T>(url: string, headers?: Record<string, string>) =>
    client.request<T>({
      url,
      method: "DELETE",
      headers,
    }),
});
