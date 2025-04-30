export type AnyRecord = Record<string, any>;

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


export type RequestResult<Response = any> = {
  status: number;
  response: Readonly<Partial<Response>>;
};

export type ExecuteService = {
  base64Encode: (input: string) => string;
  base64Decode: (input: string) => string;
  request: <Response>(config: RequestConfig) => RequestResult<Response>;
  stringError(message: string): never;
  hook : (fn: (url: string, headers: Record<string, string>) => string,guid:string,timeout:number) => string | undefined;
  console: (input: string) => void;
};
