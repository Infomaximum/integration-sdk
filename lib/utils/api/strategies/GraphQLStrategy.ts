import type { ExecuteService } from "../../../common";
import type { GraphQLRequestOptions, GraphQLResponse, HeadersStore } from "../types";
import { mergeHeaders, normalizeQuery } from "../types";

export interface GraphQLStrategy {
  request<T = any>(url: string, options: GraphQLRequestOptions): GraphQLResponse<T>;
}

export class DefaultGraphQLStrategy implements GraphQLStrategy {
  private readonly executeService: ExecuteService;
  private readonly headersStore: HeadersStore;

  constructor(executeService: ExecuteService, headersStore: HeadersStore) {
    this.executeService = executeService;
    this.headersStore = headersStore;
  }

  request<T = any>(url: string, options: GraphQLRequestOptions): GraphQLResponse<T> {
    const { query, variables = {}, headers } = options;
    if (!query?.trim()) {
      throw new Error("GraphQL запрос обязательное поле");
    }
    if (!url?.trim()) {
      throw new Error("Не указан url");
    }
    const normalizedQuery = normalizeQuery(query);
    const hasVariables = Object.keys(variables).length > 0;
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...mergeHeaders(this.headersStore, headers),
    };
    const response = this.executeService.request<ArrayBuffer>({
      url,
      method: "POST",
      headers: requestHeaders,
      jsonBody: JSON.stringify({ query: normalizedQuery, ...(hasVariables ? { variables } : {}) }),
    });
    if (response.status < 200 || response.status >= 300) {
      const errorText = response.response ? new TextDecoder().decode(response.response) : "Empty response body";
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }
    const decoded = response.response ? new TextDecoder().decode(response.response) : undefined;
    return decoded ? (JSON.parse(decoded) as GraphQLResponse<T>) : ({} as GraphQLResponse<T>);
  }
}


