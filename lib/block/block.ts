import type { AnyRecord, ExecuteService } from "../common";
import type { OutputBlockVariables } from "./output";
import type { BlockInputField } from "./input";

/**
 * Набор данных для выполнения блока
 * @template InputData - Тип входных данных блока
 * @template AuthData - Тип данных аутентификации
 */
export type BlockExecuteBundle<
  InputData extends AnyRecord = {},
  AuthData extends AnyRecord = {},
> = {
  /** Входные данные, заполненные пользователем */
  inputData: InputData;
  /** Данные аутентификации из подключения */
  authData: AuthData;
};

/**
 * Контекст выполнения блока для поддержки пагинации
 */
export type BlockContext = AnyRecord | string | number | undefined;

/**
 * Результат выполнения блока
 * @template Context - Тип контекста для пагинации
 */
export type ExecuteResult<Context extends BlockContext = undefined> = {
  /** Описание выходных переменных */
  output_variables: OutputBlockVariables[];
  /** Массив выходных данных */
  output: any[];
  /** Состояние для следующей итерации (используется для пагинации) */
  state: Context;
  /** Есть ли еще данные для загрузки */
  hasNext: boolean;
};

/**
 * Функция выполнения блока с поддержкой пагинации
 *
 * @template InputData - Тип входных данных
 * @template AuthData - Тип данных аутентификации
 * @template Context - Тип контекста для пагинации
 *
 * @param service - Сервис для выполнения операций
 * @param bundle - Набор данных с входными данными и аутентификацией
 * @param context - Контекст предыдущей итерации (для пагинации)
 * @returns Результат выполнения блока
 *
 * @example
 * ```typescript
 * executePagination: async (service, bundle, context) => {
 *   const page = context?.page || 1;
 *
 *   const response = service.request({
 *     url: `${bundle.authData.BASE_URL}/data?page=${page}`,
 *     method: 'GET'
 *   });
 *
 *   return {
 *     output_variables: [{ name: 'items', type: 'ObjectArray', struct: [...] }],
 *     output: [{ items: data }],
 *     state: { page: page + 1 },
 *     hasNext: data.length > 0
 *   };
 * }
 * ```
 */
export type IntegrationBlockExecute<
  InputData extends AnyRecord = {},
  AuthData extends AnyRecord = {},
  Context extends BlockContext = undefined,
> = (
  this: null,
  service: ExecuteService,
  bundle: BlockExecuteBundle<InputData, AuthData>,
  context: Context | undefined
) => ExecuteResult<Context> | Promise<ExecuteResult<Context>>;

/**
 * Функция для динамической генерации полей ввода блока
 * Позволяет создавать поля на основе данных аутентификации
 *
 * @template InputData - Тип входных данных
 * @template AuthData - Тип данных аутентификации
 */
export type FunctionBlockInputField<
  InputData extends AnyRecord = {},
  AuthData extends AnyRecord = {},
> = (
  service: ExecuteService,
  bundle: BlockExecuteBundle<InputData, AuthData>
) => BlockInputField<InputData>[];

/**
 * Блок обработки данных в интеграции
 *
 * Блок — это основная единица обработки данных, которая принимает входные параметры,
 * выполняет логику и возвращает результаты
 *
 * @template InputData - Тип входных данных
 * @template AuthData - Тип данных аутентификации
 * @template Context - Тип контекста для пагинации
 *
 * @example
 * ```typescript
 * const myBlock: IntegrationBlock = {
 *   label: 'Получить пользователей',
 *   description: 'Получает список пользователей из API',
 *   inputFields: [
 *     {
 *       key: 'limit',
 *       type: 'integer',
 *       label: 'Количество записей',
 *       default: 10
 *     }
 *   ],
 *   executePagination: async (service, bundle, context) => {
 *     // Логика получения данных
 *     return {
 *       output_variables: [...],
 *       output: [...],
 *       state: undefined,
 *       hasNext: false
 *     };
 *   }
 * };
 * ```
 */
export type IntegrationBlock<
  InputData extends AnyRecord = {},
  AuthData extends AnyRecord = {},
  Context extends BlockContext = undefined,
> = {
  /** Название блока */
  label: string;
  /** Описание блока */
  description: string;
  /** Поля ввода для блока */
  inputFields: (BlockInputField<InputData> | FunctionBlockInputField<InputData, AuthData>)[];
  /** Функция выполнения блока с поддержкой пагинации */
  executePagination: IntegrationBlockExecute<InputData, AuthData, Context>;
};
