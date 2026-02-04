**@infomaximum/integration-sdk** — это TypeScript библиотека для создания пользовательских интеграций в системе Proceset. Библиотека предоставляет типизированные интерфейсы, утилиты и инструменты для разработки блоков обработки данных, подключений к внешним сервисам.

<a href="https://www.npmjs.com/package/@infomaximum/integration-sdk">
    <img alt="npm" src="https://img.shields.io/npm/v/@infomaximum/integration-sdk?style=for-the-badge">
</a>

---

## Установка

Установите библиотеку с помощью npm или yarn:

```bash
npm install @infomaximum/integration-sdk
```

```bash
yarn add @infomaximum/integration-sdk
```

---

## Быстрый старт

### Создание интеграции

```typescript
import type { Integration } from "@infomaximum/integration-sdk";

app = {
  schema: 2,
  version: "1.0.0",
  label: "Моя интеграция",
  description: "Описание интеграции",
  blocks: {
    myBlock: {
      label: "Мой блок",
      description: "Описание блока",
      inputFields: [
        {
          key: "inputText",
          type: "text",
          label: "Введите текст",
          required: true,
        },
      ],
      executePagination: async (service, bundle, context) => {
        return {
          output_variables: [{ name: "result", type: "String" }],
          output: [{ result: bundle.inputData.inputText }],
          state: undefined,
          hasNext: false,
        };
      },
    },
  },
  connections: {},
} satisfies Integration;
```

---

## Основные концепции

### Integration (Интеграция)

Интеграция — это основной объект, который объединяет блоки и подключения. Каждая интеграция должна содержать:

- **schema** — версия схемы интеграции
- **version** — версия интеграции
- **label** — название интеграции
- **description** — описание интеграции
- **blocks** — набор блоков обработки данных
- **connections** — набор подключений к внешним сервисам

### Block (Блок)

Блок — это единица обработки данных в интеграции. Блок может:

- Принимать входные данные через `inputFields`
- Выполнять логику обработки в `executePagination`
- Возвращать результаты через `output_variables` и `output`
- Поддерживать пагинацию через `context` и `hasNext`

**Пример блока:**

```typescript
const myBlock: IntegrationBlock = {
  label: "Получить данные",
  description: "Получает данные из API",
  inputFields: [
    {
      key: "apiUrl",
      type: "text",
      label: "URL API",
      required: true,
    },
  ],
  executePagination: async (service, bundle, context) => {
    const response = service.request({
      url: bundle.inputData.apiUrl,
      method: "GET",
    });

    return {
      output_variables: [{ name: "data", type: "String" }],
      output: [{ data: response.response }],
      state: undefined,
      hasNext: false,
    };
  },
};
```

### Connection (Подключение)

Подключение — это механизм аутентификации и авторизации для работы с внешними сервисами.

**Пример подключения:**

```typescript
const myConnection: IntegrationConnection = {
  label: "API подключение",
  description: "Подключение к внешнему API",
  inputFields: [
    {
      key: "apiKey",
      type: "password",
      label: "API ключ",
      required: true,
    },
    {
      key: "BASE_URL",
      type: "text",
      label: "Базовый URL",
      required: true,
    },
  ],
  execute: (service, bundle) => {
    // Проверка подключения
    const response = service.request({
      url: `${bundle.authData.BASE_URL}/test`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${bundle.authData.apiKey}`,
      },
    });

    if (response.status !== 200) {
      service.stringError("Ошибка подключения");
    }
  },
  refresh: (service, bundle) => {
    // Обновление токена (если требуется)
  },
};
```

### HttpClient (HTTP-клиент)

Библиотека предоставляет удобный HTTP-клиент для работы с REST API:

```typescript
import { HttpClient, createApiClient } from "@infomaximum/integration-sdk";

const client = new HttpClient({ Authorization: "Bearer token" }, service);

const api = createApiClient(client);

// GET запрос
const data = api.get<{ id: number }>("https://api.example.com/data");

// POST запрос
const result = api.post("https://api.example.com/data", {
  jsonBody: { name: "Test" },
});

// Загрузка файла
const file = api.get("https://api.example.com/file", true);
```

---

## Типы входных полей

Библиотека поддерживает различные типы входных полей для блоков:

### Текстовые поля

```typescript
{
  key: 'text',
  type: 'text',
  label: 'Текст',
  placeholder: 'Введите текст',
  typeOptions: {
    minLength: 1,
    maxLength: 100,
    pattern: '^[a-zA-Z]+$',
    errorMessage: 'Только латинские буквы'
  }
}
```

### Числовые поля

```typescript
{
  key: 'number',
  type: 'number',
  label: 'Число',
  typeOptions: {
    min: 0,
    max: 100
  }
}
```

### Выпадающий список

```typescript
{
  key: 'select',
  type: 'select',
  label: 'Выберите опцию',
  options: [
    { label: 'Опция 1', value: 'option1' },
    { label: 'Опция 2', value: 'option2' }
  ]
}
```

### Выпадающий список c множественным выбором

```typescript
{
  key: 'multiselect',
  type: 'select',
  label: 'Выберите опцию',
  options: [
    { label: 'Опция 1', value: 'option1' },
    { label: 'Опция 2', value: 'option2' }
  ]
}
```

### Логическое поле

```typescript
{
  key: 'enabled',
  type: 'boolean',
  label: 'Включено',
  default: false
}
```

### Редактор кода

```typescript
{
  key: 'code',
  type: 'code',
  label: 'SQL запрос',
  editor: 'sql',
  sqlDialect: 'postgresql'
}
```

### Дата и время

```typescript
{
  key: 'date',
  type: 'date',
  label: 'Дата'
}

{
  key: 'datetime',
  type: 'datetime',
  label: 'Дата и время'
}
```

### Ключ-значение

```typescript
{
  key: 'headers',
  type: 'keyValue',
  label: 'HTTP заголовки',
  typeOptions: {
    sortable: true
  }
}
```

### Группа полей

```typescript
{
  key: 'group',
  type: 'group',
  label: 'Группа настроек',
  properties: [
    { key: 'field1', type: 'text', label: 'Поле 1' },
    { key: 'field2', type: 'number', label: 'Поле 2' }
  ]
}
```

### Массив

```typescript
{
  key: 'items',
  type: 'array',
  label: 'Список элементов',
  properties: [
    { key: 'name', type: 'text', label: 'Название' },
    { key: 'value', type: 'number', label: 'Значение' }
  ],
  typeOptions: {
    minItems: 1,
    maxItems: 10
  }
}
```

---

## Типы выходных переменных

Блоки могут возвращать различные типы данных:

- **String** / **StringArray** — строки
- **Long** / **LongArray** — целые числа
- **Double** / **DoubleArray** — числа с плавающей точкой
- **Boolean** / **BooleanArray** — логические значения
- **BigInteger** / **BigIntegerArray** — большие целые числа
- **BigDecimal** / **BigDecimalArray** — большие десятичные числа
- **DateTime** / **DateTimeArray** — дата и время
- **Object** / **ObjectArray** — объекты со структурой
- **File** — файлы

**Пример с объектами:**

```typescript
{
  output_variables: [
    {
      name: 'users',
      type: 'ObjectArray',
      struct: [
        { name: 'id', type: 'Long' },
        { name: 'name', type: 'String' },
        { name: 'email', type: 'String' }
      ]
    }
  ],
  output: [
    [{
      users: [
        { id: 1, name: 'Иван', email: 'ivan@example.com' },
        { id: 2, name: 'Мария', email: 'maria@example.com' }
      ]
    }]
  ]
}
```

---

## Пагинация

Блоки поддерживают пагинацию для обработки больших объемов данных:

```typescript
executePagination: async (service, bundle, context) => {
  const page = context?.page || 1;
  const pageSize = 100;

  const response = service.request({
    url: `${bundle.authData.BASE_URL}/data?page=${page}&size=${pageSize}`,
    method: 'GET'
  });

  const data = JSON.parse(new TextDecoder().decode(response.response));

  return {
    output_variables: [{ name: 'items', type: 'ObjectArray', struct: [...] }],
    output: [{ items: data.items }],
    state: { page: page + 1 },
    hasNext: data.hasMore
  };
}
```

---

## ExecuteService

`ExecuteService` предоставляет утилиты для работы внутри блоков и подключений:

### Сетевые запросы

```typescript
service.request({
  url: "https://api.example.com/data",
  method: "GET",
  headers: { Authorization: "Bearer token" },
  timeout: 30000,
});

service.request({
  url: "https://api.example.com/data",
  method: "POST",
  jsonBody: { name: "Test" },
});

service.request({
  url: "https://api.example.com/upload",
  method: "POST",
  multipartBody: [
    {
      key: "file",
      fileName: "document.pdf",
      fileValue: arrayBuffer,
      contentType: "application/pdf",
    },
  ],
});
```

### Кодирование Base64

```typescript
const encoded = service.base64Encode("Hello World");
const decoded = service.base64Decode(encoded);
```

### Обработка ошибок

```typescript
if (!data) {
  service.stringError("Данные не найдены");
}
```

---

## API Reference

Полная документация типов доступна в исходном коде библиотеки. Основные экспортируемые типы:

- `Integration` — тип интеграции
- `IntegrationBlock` — тип блока
- `IntegrationConnection` — тип подключения
- `BlockInputField` — типы входных полей
- `OutputBlockVariables` — типы выходных переменных
- `ExecuteService` — сервис для выполнения операций
- `HttpClient` — HTTP-клиент

---

## Лицензия

Apache-2.0

---

## Ссылки

- [GitHub репозиторий](https://github.com/Infomaximum/integration-sdk)
- [NPM пакет](https://www.npmjs.com/package/@infomaximum/integration-sdk)
- [Сообщить о проблеме](https://github.com/Infomaximum/integration-sdk/issues)
