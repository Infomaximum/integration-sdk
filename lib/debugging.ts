/**
 * Пространство имен для отладки интеграций
 */
export declare namespace Debugging {
  /**
   * Опции для отладки интеграции
   */
  export type DebugIntegrationOptions = {
    /** Ключ сущности для отладки */
    entityKey: string;
    /** Режим серий запуска интеграций */
    series?: boolean;
    /** Генерировать схему при отладке */
    isGenerateSchema?: boolean;
  };
}
