/**
 * Базовый тип для выходной переменной
 */
export type CommonOutput = {
  /** Имя переменной */
  name: string;
};

/**
 * Логическое значение
 */
export type BooleanOutput = CommonOutput & {
  type: "Boolean";
};

/**
 * Массив логических значений
 */
export type BooleanArrayOutput = CommonOutput & {
  type: "BooleanArray";
};

/**
 * Целое число (Long)
 */
export type LongOutput = CommonOutput & {
  type: "Long";
};

/**
 * Массив целых чисел (Long)
 */
export type LongArrayOutput = CommonOutput & {
  type: "LongArray";
};

/**
 * Число с плавающей точкой (Double)
 */
export type DoubleOutput = CommonOutput & {
  type: "Double";
};

/**
 * Массив чисел с плавающей точкой (Double)
 */
export type DoubleArrayOutput = CommonOutput & {
  type: "DoubleArray";
};

/**
 * Строка
 */
export type StringOutput = CommonOutput & {
  type: "String";
};

/**
 * Массив строк
 */
export type StringArrayOutput = CommonOutput & {
  type: "StringArray";
};

/**
 * Большое целое число (BigInteger)
 */
export type BigIntegerOutput = CommonOutput & {
  type: "BigInteger";
};

/**
 * Массив больших целых чисел (BigInteger)
 */
export type BigIntegerArrayOutput = CommonOutput & {
  type: "BigIntegerArray";
};

/**
 * Большое десятичное число (BigDecimal)
 */
export type BigDecimalOutput = CommonOutput & {
  type: "BigDecimal";
};

/**
 * Массив больших десятичных чисел (BigDecimal)
 */
export type BigDecimalArrayOutput = CommonOutput & {
  type: "BigDecimalArray";
};

/**
 * Дата и время
 */
export type DateTimeOutput = CommonOutput & {
  type: "DateTime";
};

/**
 * Массив дат и времени
 */
export type DateTimeArrayOutput = CommonOutput & {
  type: "DateTimeArray";
};

/**
 * Объект со структурой
 */
export type ObjectOutput = CommonOutput & {
  type: "Object";
  /** Структура объекта (вложенные переменные) */
  struct: OutputBlockVariables[];
};

/**
 * Массив объектов со структурой
 */
export type ObjectArrayOutput = CommonOutput & {
  type: "ObjectArray";
  /** Структура каждого объекта в массиве */
  struct: OutputBlockVariables[];
};

/**
 * Файл
 */
export type FileOutput = CommonOutput & {
  type: "File";
};

/**
 * Выходная переменная блока
 * 
 * Определяет тип и структуру данных, возвращаемых блоком
 * 
 * @example
 * ```typescript
 * // Простые типы
 * { name: 'count', type: 'Long' }
 * { name: 'message', type: 'String' }
 * { name: 'isActive', type: 'Boolean' }
 * 
 * // Массивы
 * { name: 'tags', type: 'StringArray' }
 * { name: 'scores', type: 'DoubleArray' }
 * 
 * // Объекты со структурой
 * {
 *   name: 'user',
 *   type: 'Object',
 *   struct: [
 *     { name: 'id', type: 'Long' },
 *     { name: 'name', type: 'String' },
 *     { name: 'email', type: 'String' }
 *   ]
 * }
 * 
 * // Массив объектов
 * {
 *   name: 'users',
 *   type: 'ObjectArray',
 *   struct: [
 *     { name: 'id', type: 'Long' },
 *     { name: 'name', type: 'String' }
 *   ]
 * }
 * ```
 */
export type OutputBlockVariables =
  | BooleanOutput
  | BooleanArrayOutput
  | LongOutput
  | LongArrayOutput
  | DoubleOutput
  | DoubleArrayOutput
  | StringOutput
  | StringArrayOutput
  | BigIntegerOutput
  | BigIntegerArrayOutput
  | BigDecimalOutput
  | BigDecimalArrayOutput
  | DateTimeOutput
  | DateTimeArrayOutput
  | ObjectOutput
  | ObjectArrayOutput
  | FileOutput;
