import type { ExecuteService } from "../../../common";
import { BaseClient } from "./BaseClient";
import type { IClientConfig, IGraphQLResponse, IRequestOptions } from "../types";

/**
 * GraphQL клиент
 *
 * Предоставляет удобный интерфейс для работы с GraphQL API
 * с автоматической обработкой ошибок и парсингом ответов
 *
 * @example
 * ```typescript
 * const client = new GraphQLClient(
 *   { baseUrl: 'https://api.example.com/graphql' },
 *   executeService
 * );
 *
 * const data = client.query<{ user: User }>(
 *   `query GetUser($id: ID!) {
 *     user(id: $id) { id name email }
 *   }`,
 *   { id: '123' }
 * );
 *
 * const result = client.mutate<{ createUser: User }>(
 *   `mutation CreateUser($input: UserInput!) {
 *     createUser(input: $input) { id name }
 *   }`,
 *   { input: { name: 'John' } }
 * );
 * ```
 */
export class GraphQLClient extends BaseClient {
  constructor(config: IClientConfig, executeService: ExecuteService) {
    super(config, executeService);

    // GraphQL всегда использует POST
    this.setHeader("Content-Type", "application/json");
  }

  /**
   * Выполняет GraphQL запрос (query или mutation).
   * * @remarks
   * Перед отправкой запрос нормализуется: удаляются лишние пробелы и символы переноса строк.
   * Убедитесь, что ваш GraphQL-сервер поддерживает POST-запросы и `application/json`.
   * * @template T - Ожидаемый тип данных в поле `data`.
   * @param query - Строка запроса.
   * @param variables - Переменные запроса.
   * @returns Данные из поля `data` ответа сервера.
   * @throws {Error} Если сервер вернул массив `errors` или если ответ пуст.
   */
  request<T = any>(query: string, variables?: Record<string, any>, options?: IRequestOptions): T {
    const normalizedQuery = this.normalizeQuery(query);

    const response = this.executeRequest<ArrayBuffer>(
      this.mergeConfig({
        url: this.buildUrl(this.config.baseUrl),
        method: "POST",
        jsonBody: JSON.stringify({
          query: normalizedQuery,
          variables: variables || {},
        }),
        ...options,
      })
    );
    if (!response.response) {
      throw new Error("Grapql: Response buffer is empty");
    }

    return this.parseGraphQLResponse<T>(response.response);
  }

  /**
   * Нормализует GraphQL запрос (убирает лишние пробелы)
   */
  private normalizeQuery(query: string): string {
    return query.replace(/\s+/g, " ").trim();
  }

  /**
   * Парсит GraphQL ответ и обрабатывает ошибки
   */
  private parseGraphQLResponse<T>(buffer: ArrayBuffer): T {
    const decoded = new TextDecoder().decode(buffer);

    let body: IGraphQLResponse<T>;
    try {
      body = JSON.parse(decoded) as IGraphQLResponse<T>;
    } catch (e) {
      throw new Error(`GraphQL: Invalid JSON response - ${decoded}`);
    }

    // Обрабатываем ошибки GraphQL
    if (body.errors && body.errors.length > 0) {
      const error = body.errors[0];
      const errorDetails = [
        error.message,
        error.path ? `Path: ${error.path.join(".")}` : "",
        error.locations
          ? `Location: line ${error.locations[0].line}, column ${error.locations[0].column}`
          : "",
      ]
        .filter(Boolean)
        .join(" | ");

      throw new Error(`GraphQL Error: ${errorDetails}`);
    }

    if (!body.data) {
      throw new Error("GraphQL: No data in response");
    }

    return body.data;
  }
}
