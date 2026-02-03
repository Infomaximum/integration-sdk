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
 * @extends {BaseClient}
 * const client = new GraphQLClient(
 *   { baseUrl: 'https://api.example.com/graphql' },
 *   executeService
 * );
 *
 * @example
 * // Использование alias метода gql
 * const users = client.gql<{ users: User[] }>(
 *   `{ users { id name } }`
 * );
 *
 * @example
 * // Сложный запрос с фрагментами
 * const data = client.request<{ posts: Post[] }>(`
 *   fragment PostFields on Post {
 *     id
 *     title
 *     author {
 *       id
 *       name
 *     }
 *   }
 *
 *   query GetPosts($limit: Int!) {
 *     posts(limit: $limit) {
 *       ...PostFields
 *       comments {
 *         id
 *         text
 *       }
 *     }
 *   }
 * `, { limit: 10 });
 * @see {@link BaseClient} - Базовый класс с общей функциональностью
 */
export class GraphQLClient extends BaseClient {
  constructor(config: IClientConfig, executeService: ExecuteService) {
    super(config, executeService);

    this.setHeader("Content-Type", "application/json");
  }

  /**
   * Выполняет GraphQL запрос (query или mutation).
   *
   * Универсальный метод для отправки любых GraphQL операций.
   * Автоматически нормализует запрос (удаляет лишние пробелы), отправляет
   * POST запрос с query и variables, парсит ответ и обрабатывает ошибки.
   *
   * @template T Ожидаемый тип данных в поле `data` ответа
   * @template U Тип объекта с переменными (по умолчанию Record<string, any>)
   * @param query - Строка GraphQL запроса (query, mutation или subscription)
   * @param variables - Переменные для запроса (опционально)
   * @param options - Дополнительные опции HTTP запроса
   * @returns Данные из поля `data` ответа сервера
   * @throws {Error} Если сервер вернул массив `errors` или если ответ пуст
   * @throws {Error} Если ответ не является валидным JSON
   *
   * @example
   * // Query без переменных
   * const data = client.request<{ posts: Post[] }>(`
   *   query {
   *     posts {
   *       id
   *       title
   *     }
   *   }
   * `);
   *
   * @example
   * // Query с переменными
   * const data = client.request<{ user: User }>(
   *   `query GetUser($id: ID!) {
   *     user(id: $id) {
   *       id
   *       name
   *       email
   *     }
   *   }`,
   *   { id: '123' }
   * );
   *
   * @example
   * // Mutation с типизированными переменными
   * interface CreateUserVars {
   *   input: {
   *     name: string;
   *     email: string;
   *   };
   * }
   *
   * const result = client.request<{ createUser: User }, CreateUserVars>(
   *   `mutation CreateUser($input: UserInput!) {
   *     createUser(input: $input) {
   *       id
   *       name
   *     }
   *   }`,
   *   { input: { name: 'John', email: 'john@example.com' } }
   * );
   *
   * @example
   * // С дополнительными опциями
   * const data = client.request<{ users: User[] }>(
   *   `{ users { id name } }`,
   *   undefined,
   *   { timeout: 15000, headers: { 'X-Request-ID': generateId() } }
   * );
   *
   * @remarks
   * - Запрос нормализуется перед отправкой: удаляются множественные пробелы и переносы строк
   * - Все запросы отправляются POST методом с Content-Type: application/json
   * - GraphQL ошибки из поля `errors` обрабатываются и пробрасываются как Error
   * - Убедитесь, что GraphQL сервер поддерживает POST запросы и application/json
   *
   * @see {@link IRequestOptions}
   * @see {@link IGraphQLResponse}
   */
  request<T = any, U = Record<string, any>>(
    query: string,
    variables?: U,
    options?: IRequestOptions
  ): T {
    const normalizedQuery = this.normalizeQuery(query);

    const response = this.executeRequest<ArrayBuffer>(
      this.mergeConfig({
        url: this.buildUrl(this.config.baseUrl),
        method: "POST", // GraphQL всегда использует POST
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
   * Псевдоним для метода {@link request}.
   *
   * Короткое имя для удобства и лучшей читаемости кода при работе с GraphQL.
   *
   * @template T Ожидаемый тип данных в поле `data` ответа
   * @template V Тип объекта с переменными
   * @param query - Строка GraphQL запроса
   * @param vars - Переменные для запроса
   * @returns Данные из поля `data` ответа сервера
   *
   * @example
   * // Краткая запись вместо client.request()
   * const users = client.gql<{ users: User[] }>(`
   *   { users { id name } }
   * `);
   *
   * @example
   * // С переменными
   * const user = client.gql<{ user: User }>(
   *   `query($id: ID!) { user(id: $id) { id name } }`,
   *   { id: '123' }
   * );
   *
   * @see {@link request}
   */
  gql<T = any, V = Record<string, any>>(query: string, vars?: V): T {
    return this.request<T, V>(query, vars);
  }

  /**
   * Нормализует GraphQL запрос для отправки на сервер.
   *
   * Удаляет лишние пробелы и переносы строк, делая запрос более компактным
   * без изменения его семантики. Полезно для уменьшения размера payload.
   *
   * @param query - Исходная строка GraphQL запроса
   * @returns Нормализованная строка запроса
   * @private
   *
   * @example
   * // Входной запрос:
   * const input = `
   *   query GetUser($id: ID!) {
   *     user(id: $id) {
   *       id
   *       name
   *     }
   *   }
   * `;
   *
   * // Результат нормализации:
   * // "query GetUser($id: ID!) { user(id: $id) { id name } }"
   *
   * @remarks
   * - Заменяет множественные пробелы/табы/переносы на один пробел
   * - Удаляет пробелы в начале и конце строки
   * - Не изменяет содержимое строковых литералов внутри запроса
   */
  private normalizeQuery(query: string): string {
    return query.replace(/\s+/g, " ").trim();
  }

  /**
   * Парсит ответ GraphQL сервера и обрабатывает ошибки.
   *
   * Декодирует ArrayBuffer в JSON, проверяет наличие ошибок GraphQL
   * и возвращает данные из поля `data`. При наличии ошибок формирует
   * детальное сообщение с информацией о path и location.
   *
   * @template T Тип данных в поле `data`
   * @param buffer - Буфер с ответом сервера
   * @returns Данные из поля `data`
   * @throws {Error} Если ответ не является валидным JSON
   * @throws {Error} Если в ответе есть поле `errors` с ошибками
   * @throws {Error} Если поле `data` отсутствует в ответе
   * @private
   *
   * @example
   * // Успешный ответ:
   * // { "data": { "user": { "id": "1", "name": "John" } } }
   * // Результат: { user: { id: "1", name: "John" } }
   *
   * @example
   * // Ответ с ошибкой:
   * // {
   * //   "errors": [{
   * //     "message": "User not found",
   * //     "path": ["user"],
   * //     "locations": [{ "line": 2, "column": 3 }]
   * //   }]
   * // }
   * // Бросит: Error("GraphQL Error: User not found | Path: user | Location: line 2, column 3")
   *
   * @example
   * // Ответ без data:
   * // { "errors": [...] }
   * // Бросит: Error("GraphQL: No data in response")
   *
   * @remarks
   * - Всегда проверяет наличие поля `errors` перед возвратом данных
   * - Формирует подробное сообщение об ошибке с path и location если доступно
   * - При множественных ошибках обрабатывается только первая
   * - Пустое поле `data` считается ошибкой
   *
   * @see {@link IGraphQLResponse}
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
