import type { ExecuteService, RequestConfig } from "../../../common";
import type { HeadersStore, UnifiedGetOptions, UnifiedBodyOptions, UnifiedHttpOptions } from "../types";
import { mergeHeaders } from "../types";

export interface RestStrategy {
  get<T = unknown>(url: string, options?: UnifiedGetOptions): T | ArrayBuffer | undefined;
  post<T = unknown>(url: string, body?: UnifiedBodyOptions): T | undefined;
  patch<T = unknown>(url: string, body?: UnifiedBodyOptions): T | undefined;
  put<T = unknown>(url: string, body?: UnifiedBodyOptions): T | undefined;
  delete<T = unknown>(url: string, options?: UnifiedHttpOptions): T | undefined;
}

export class DefaultRestStrategy implements RestStrategy {
  private readonly executeService: ExecuteService;
  private readonly headersStore: HeadersStore;

  constructor(executeService: ExecuteService, headersStore: HeadersStore) {
    this.executeService = executeService;
    this.headersStore = headersStore;
  }

  private request(config: RequestConfig) {
    const response = this.executeService.request<ArrayBuffer>(config);
    if (response.status === 204) return response;
    if (response.status < 200 || response.status >= 300) {
      const errorText = response.response ? new TextDecoder().decode(response.response) : "Empty response body";
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }
    return response;
  }

  private decodeJson<T>(buffer: ArrayBuffer | undefined): T {
    if (!buffer) return undefined as unknown as T;
    return JSON.parse(new TextDecoder().decode(buffer)) as T;
  }

  get<T = unknown>(url: string, options: UnifiedGetOptions = {}): T | ArrayBuffer | undefined {
    const response = this.request({ url, method: "GET", headers: mergeHeaders(this.headersStore, options.headers) });
    if (response.status === 204) return;
    return options.isFile ? (response.response as ArrayBuffer) : (this.decodeJson<T>(response.response as ArrayBuffer));
  }

  post<T = unknown>(url: string, body: UnifiedBodyOptions = {}): T | undefined {
    const response = this.request({
      url,
      method: "POST",
      headers: mergeHeaders(this.headersStore, body.headers),
      ...(body.jsonBody !== undefined ? { jsonBody: body.jsonBody } : {}),
      ...(body.multipartBody !== undefined ? { multipartBody: body.multipartBody } : {}),
    });
    if (response.status === 204) return;
    return this.decodeJson<T>(response.response as ArrayBuffer);
  }

  patch<T = unknown>(url: string, body: UnifiedBodyOptions = {}): T | undefined {
    const response = this.request({
      url,
      method: "PATCH",
      headers: mergeHeaders(this.headersStore, body.headers),
      ...(body.jsonBody !== undefined ? { jsonBody: body.jsonBody } : {}),
    });
    if (response.status === 204) return;
    return this.decodeJson<T>(response.response as ArrayBuffer);
  }

  put<T = unknown>(url: string, body: UnifiedBodyOptions = {}): T | undefined {
    const response = this.request({
      url,
      method: "PUT",
      headers: mergeHeaders(this.headersStore, body.headers),
      ...(body.jsonBody !== undefined ? { jsonBody: body.jsonBody } : {}),
    });
    if (response.status === 204) return;
    return this.decodeJson<T>(response.response as ArrayBuffer);
  }

  delete<T = unknown>(url: string, options: UnifiedHttpOptions = {}): T | undefined {
    const response = this.request({ url, method: "DELETE", headers: mergeHeaders(this.headersStore, options.headers) });
    if (response.status === 204) return;
    return this.decodeJson<T>(response.response as ArrayBuffer);
  }
}


