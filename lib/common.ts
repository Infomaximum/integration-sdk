export type AnyRecord = Record<string, any>;

export type BaseRequestConfig = {
  url: string;
  headers?: Record<string, string>;
  repeatMode?: boolean;
  timeout?: number;
};

export type GetRequestConfig = BaseRequestConfig & {
  method: "GET";
};

export type MultipartBodyConfig = {
  key: string;
  fileName: string;
  fileValue: ArrayBuffer;
  contentType: string;
};

export type MutatingRequestConfig = BaseRequestConfig & {
  method: "POST" | "PATCH" | "PUT" | "DELETE";
  jsonBody?: any;
  multipartBody?: MultipartBodyConfig[];
};

export type RequestConfig = GetRequestConfig | MutatingRequestConfig;

export type RequestResult<Response = ArrayBuffer> = {
  status: number;
  response: Readonly<Response> | undefined;
};
export type ExecuteServiceAuth = {
  hook: (
    fn: (url: string, headers: Record<string, string>) => string,
    guid: string,
    timeout: number
  ) => string | undefined;
};
export type ExecuteServiceUtils = {
  base64Encode: (input: string) => string;
  base64Decode: (input: string) => string;
  stringError(message: string): never;
};

export type ExecuteServiceNetwork = {
  request: <Response>(config: RequestConfig) => RequestResult<Response>;
};

export type ExecuteService = ExecuteServiceAuth & ExecuteServiceNetwork & ExecuteServiceUtils;
