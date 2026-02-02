/**
 * @infomaximum/integration-sdk
 *
 * Библиотека для создания пользовательских интеграций в системе Proceset
 *
 * @packageDocumentation
 */

export * from "./block";
export * from "./debugging";
export * from "./common";
export * from "./connection";
export * from "./integration";
export * from "./utils";
import type { Integration } from "./integration";

/**
 * Глобальная переменная для регистрации интеграции
 *
 * @example
 * ```typescript
 * app = {
 *   schema: 2,
 *   version: '1.0.0',
 *   label: 'Моя интеграция',
 *   description: 'Описание',
 *   blocks: {},
 *   connections: {}
 * } satisfies Integration;
 * ```
 */
declare global {
  var app: Integration;
}
