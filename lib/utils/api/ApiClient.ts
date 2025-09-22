import type { ExecuteService } from "../../common";
import type { HeadersStore, UnifiedGetOptions, UnifiedBodyOptions, UnifiedHttpOptions, GraphQLRequestOptions } from "./types";
import type { RestStrategy } from "./strategies/RestStrategy";
import { DefaultRestStrategy } from "./strategies/RestStrategy";
import type { GraphQLStrategy } from "./strategies/GraphQLStrategy";
import { DefaultGraphQLStrategy } from "./strategies/GraphQLStrategy";

export class ApiClient {
  private readonly headersStore: HeadersStore;
  private  readonly rest: RestStrategy;
  private readonly graphql: GraphQLStrategy;

  constructor(
    executeService: ExecuteService,
    headers: Record<string, string> = {},
    restStrategy?: RestStrategy,
    graphQLStrategy?: GraphQLStrategy
  ) {
    this.headersStore = { values: { ...headers } };
    this.rest = restStrategy ?? new DefaultRestStrategy(executeService, this.headersStore);
    this.graphql = graphQLStrategy ?? new DefaultGraphQLStrategy(executeService, this.headersStore);
  }

  setHeader(name: string, value: string): void {
    this.headersStore.values[name] = value;
  }

  removeHeader(name: string): void {
    delete this.headersStore.values[name];
  }

  get<T = unknown>(url: string, options: UnifiedGetOptions = {}) {
    return this.rest.get<T>(url, options);
  }
  post<T = unknown>(url: string, body: UnifiedBodyOptions = {}) {
    return this.rest.post<T>(url, body);
  }
  patch<T = unknown>(url: string, body: UnifiedBodyOptions = {}) {
    return this.rest.patch<T>(url, body);
  }
  put<T = unknown>(url: string, body: UnifiedBodyOptions = {}) {
    return this.rest.put<T>(url, body);
  }
  delete<T = unknown>(url: string, options: UnifiedHttpOptions = {}) {
    return this.rest.delete<T>(url, options);
  }
  graphqlRequest<T = any>(url: string, options: GraphQLRequestOptions) {
    return this.graphql.request<T>(url, options);
  }
}


