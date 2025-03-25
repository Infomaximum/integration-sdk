export type Meta = {
  key: string;
  name: string;
  description: string;
};

export type BaseRequestConfig = {
  url: string;
  headers?: Record<string, string>;
};

export type GetRequestConfig = BaseRequestConfig & {
  method: "GET";
};

export type MutatingRequestConfig = BaseRequestConfig & {
  method: "POST" | "PATCH" | "PUT" | "DELETE";
  jsonBody?: any;
  multipartBody?: any;
};

export type RequestConfig = GetRequestConfig | MutatingRequestConfig;

export type ExecuteServiceError = {
  stringError: (message: string) => void;
  cause: (message: string) => void;
};

export type RequestResult = {
  status: number;
  response: any;
};

export type ExecuteService = {
  base64Encode: (input: string) => string;
  base64Decode: (input: string) => string;
  request: (config: RequestConfig) => RequestResult;
  error: ExecuteServiceError;
  console: (input: string) => void;
};
