import type { IntegrationBlock } from "./block/block";
import type { IntegrationConnection } from "./connection";

/**
 * Основной тип интеграции в системе Proceset
 *
 * Интеграция объединяет блоки обработки данных и подключения к внешним сервисам
 *
 * @example
 * ```typescript
 * app = {
 *   schema: 2,
 *   version: '1.0.0',
 *   label: 'Моя интеграция',
 *   description: 'Описание интеграции',
 *   blocks: {
 *     myBlock: { ... }
 *   },
 *   connections: {
 *     myConnection: { ... }
 *   }
 * } satisfies Integration;
 * ```
 */
export type Integration = {
  /** Версия схемы интеграции */
  schema: number;
  /** Версия интеграции (семантическое версионирование) */
  version: string;
  /** Название интеграции */
  label: string;
  /** Описание интеграции */
  description: string;
  /** Набор блоков обработки данных */
  blocks: Record<string, IntegrationBlock<any, any, any>>;
  /** Набор подключений к внешним сервисам */
  connections: Record<string, IntegrationConnection<any>>;
};
