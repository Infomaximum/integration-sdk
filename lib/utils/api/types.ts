import type { MultipartBodyConfig } from "../../common";

export interface UnifiedHttpOptions {
  headers?: Record<string, string>;
}

export interface UnifiedGetOptions extends UnifiedHttpOptions {
  isFile?: boolean;
}

export interface UnifiedBodyOptions extends UnifiedHttpOptions {
  jsonBody?: unknown;
  multipartBody?: MultipartBodyConfig[];
}

export interface GraphQLRequestOptions extends UnifiedHttpOptions {
  query: string;
  variables?: Record<string, any>;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
    extensions?: Record<string, any>;
  }>;
  extensions?: Record<string, any>;
}

export type HeadersStore = { values: Record<string, string> };

export function normalizeQuery(query: string): string {
  return query.replace(/\s+/g, " ").trim();
}

export function mergeHeaders(store: HeadersStore, headers?: Record<string, string>): Record<string, string> {
  return { ...store.values, ...(headers || {}) };
}

// Template tag to compose GraphQL queries with whitespace normalization
export function gql(parts: TemplateStringsArray, ...substitutions: Array<unknown>): string {
  let result = "";
  for (let i = 0; i < parts.length; i++) {
    result += parts[i];
    if (i < substitutions.length) {
      const value = substitutions[i];
      result += value == null ? "" : String(value);
    }
  }
  return normalizeQuery(result);
}

export type { MultipartBodyConfig };

