import type {
  RequestConfig,
  ExecuteService,
  MutatingRequestConfig,
  MultipartBodyConfig,
} from "../../common";

interface IHttpClient {
  Authorization: string;
  request<T>(config: RequestConfig): Promise<T | ArrayBuffer>;
}

type GetReturn<T, IsFile extends boolean> = IsFile extends true ? ArrayBuffer : T;

export class HttpClient implements IHttpClient {
  Authorization: string;
  private executeService: ExecuteService;

  constructor(token: string, executeService: ExecuteService) {
    this.Authorization = token;
    this.executeService = executeService;
  }
  async request<T>(config: RequestConfig, isFile: boolean = false): Promise<T | ArrayBuffer> {
    // Добавляем заголовок авторизации
    const headers = {
      ...(config.headers ?? {}),
      Authorization: this.Authorization,
    };

    const requestConfig: RequestConfig = {
      ...config,
      headers,
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
        ? (JSON.parse(new TextDecoder().decode(response.response as ArrayBuffer)) as T)
        : (response.response as ArrayBuffer);
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
  ) => client.request<T>({ url, method: "GET", headers }, !isFile) as Promise<GetReturn<T, IsFile>>,

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
