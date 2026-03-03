/**
 * Описание структуры Java Map, приходящей из GraalJS (HostObject).
 * @template K Тип ключа (обычно string)
 * @template V Тип значения (обычно string или ArrayList)
 */
/** Итератор для обхода ключей в GraalJS */
export interface IJavaIterator<T> {
  hasNext(): boolean;
  next(): T;
}
/** Вспомогательный интерфейс для ключей */
export interface IJavaSet<T> {
  iterator(): IJavaIterator<T>;
  size(): number;
  toArray(): T[];
}

/**  Функция для преобразования Java Map в JavaScript объект.
 * @param javaHashMap - Java Map, полученная из GraalJS
 * @returns JavaScript объект с ключами и значениями из Java Map
 */
export interface IJavaMap<K = string, V = any> {
  get(key: K): V | null;
  put(key: K, value: V): V | null;
  size(): number;
  isEmpty(): boolean;
  containsKey(key: K): boolean;
  containsValue(value: V): boolean;
  remove(key: K): V | null;
  clear(): void;

  // Итерация
  keySet(): IJavaSet<K>;
  values(): any;
  entrySet(): any;

  // Функциональные методы Java 8+
  forEach(action: (key: K, value: V) => void): void;
  getOrDefault(key: K, defaultValue: V): V;
}

export const javaToJsHashmapTranslate = (rawHeaders: IJavaMap): Record<string, any> => {
  const jsHeaders: Record<string, any> = {};

  try {
    if (rawHeaders.keySet && typeof rawHeaders.keySet === "function") {
      const iterator = rawHeaders.keySet().iterator();
      while (iterator.hasNext()) {
        const key = iterator.next();
        const value = rawHeaders.get(key);
        jsHeaders[key] =
          value && typeof value === "object" && value.toArray ? Array.from(value.toArray()) : value;
      }
      return jsHeaders;
    }
  } catch {
    return { ...rawHeaders };
  }

  return { ...rawHeaders };
};
