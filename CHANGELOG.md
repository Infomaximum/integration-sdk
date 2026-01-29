# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.3.0](https://github.com/Infomaximum/integration-sdk/compare/v3.2.1...v3.3.0) (2026-01-29)


### Features

* support multiselect input field ([f783699](https://github.com/Infomaximum/integration-sdk/commit/f783699f47d3b3983df987a5cd57ab8efbc4edcb))

### [3.2.1](https://github.com/Infomaximum/integration-sdk/compare/v3.2.0...v3.2.1) (2026-01-27)


### Bug Fixes

* removed deprecated method and add typeoptions ([9febcfd](https://github.com/Infomaximum/integration-sdk/commit/9febcfd67042986e3737697c02768412f71adf5b))

## [3.2.0](https://github.com/Infomaximum/integration-sdk/compare/v3.1.1...v3.2.0) (2025-09-23)


### Features

* added support refresh mechanism ([d6e2d98](https://github.com/Infomaximum/integration-sdk/commit/d6e2d9870fe9d5fc120c560886a03799145ba70b))
* refactor net middleware ([f09231e](https://github.com/Infomaximum/integration-sdk/commit/f09231e40528cb45533b56ed42abf8f117f697f3))


### Bug Fixes

* remove duplicate ([49c498c](https://github.com/Infomaximum/integration-sdk/commit/49c498cea97f3cfd8d7e580147000067888ad031))
* remove strategies ([bd73b68](https://github.com/Infomaximum/integration-sdk/commit/bd73b68168400a7044f920d5809c3b54a5083708))

### [3.1.1](https://github.com/Infomaximum/integration-sdk/compare/v3.1.0...v3.1.1) (2025-09-02)


### Bug Fixes

* add code field prop ([71e4142](https://github.com/Infomaximum/integration-sdk/commit/71e4142be8c3aca65bcdd8c54024678067867127))
* added missing fields in group field and remove parsing response ([6778d99](https://github.com/Infomaximum/integration-sdk/commit/6778d994c3e5267a98deccb8dd1e92419ab13c87))

## [3.1.0](https://github.com/Infomaximum/integration-sdk/compare/v3.0.2...v3.1.0) (2025-08-28)


### Features

* added new input filed types ([1d4d34e](https://github.com/Infomaximum/integration-sdk/commit/1d4d34ee759d95aec1a31d0b8d262f7d25596732))

### [3.0.2](https://github.com/Infomaximum/integration-sdk/compare/v3.0.1...v3.0.2) (2025-08-05)


### Bug Fixes

* correct return type for 204 No Content response ([92b4812](https://github.com/Infomaximum/integration-sdk/commit/92b48124905b0bde7977fecc6ec4575877a00335))

### [3.0.1](https://github.com/Infomaximum/integration-sdk/compare/v3.0.0...v3.0.1) (2025-08-05)


### Bug Fixes

* fixed connection fields ([4435000](https://github.com/Infomaximum/integration-sdk/commit/443500011226fc39c4f97db9b246adf332a85fd7))

## [3.0.0](https://github.com/Infomaximum/integration-sdk/compare/v3.0.0-2...v3.0.0) (2025-07-31)


### Features

* added new input fields ([317b4f7](https://github.com/Infomaximum/integration-sdk/commit/317b4f70b8b60eb62c9493b4ee632523426417de))
* added the ability to operate in asynchronous mode ([23fd0b4](https://github.com/Infomaximum/integration-sdk/commit/23fd0b4300b38352c50c62d505f7f0e489c1e6b4))
* added wrapper on service.request as HTTP Module ([f99f95a](https://github.com/Infomaximum/integration-sdk/commit/f99f95a9f35dbc3597100fb0794588247986cf5e))


### Bug Fixes

* fix http client headers ([13f377d](https://github.com/Infomaximum/integration-sdk/commit/13f377de28d348aba3fa0daa76eddbcf9968d874))
* fix import ([56cb5ee](https://github.com/Infomaximum/integration-sdk/commit/56cb5ee44ba03fd642a3818d5535b1c7ac5d406a))
* fixed global naming ([8e7fca2](https://github.com/Infomaximum/integration-sdk/commit/8e7fca2577a63801a9d356957030acbb8a68e47c))

## [3.0.0-2](https://github.com/Infomaximum/integration-sdk/compare/v3.0.0-1...v3.0.0-2) (2025-06-02)


### ⚠ BREAKING CHANGES

* Обновление общей структуры интеграции

### Bug Fixes

* Обновление общей структуры интеграции ([2423740](https://github.com/Infomaximum/integration-sdk/commit/2423740cc379e5ad168cdb3e7dc0dd5a3ff03151))
* поле keys в InputField keyValue не является обязательным ([fa76139](https://github.com/Infomaximum/integration-sdk/commit/fa76139311503313b88c98a94007b9af4da0fde3))

## [3.0.0-1](https://github.com/Infomaximum/integration-sdk/compare/v3.0.0-0...v3.0.0-1) (2025-05-15)


### Bug Fixes

* Изменение формата ответа от service.request ([1eb29f6](https://github.com/Infomaximum/integration-sdk/commit/1eb29f65d1cc7bd6a7cb70e1318d180bd352df15))

## [3.0.0-0](https://github.com/Infomaximum/integration-sdk/compare/v2.3.0...v3.0.0-0) (2025-05-05)


### ⚠ BREAKING CHANGES

* изменения под новый серверный движок

### Bug Fixes

* Убрана лишняя вложенность для ошибок и добавлен новый метод 'hoo… ([#6](https://github.com/Infomaximum/integration-sdk/issues/6)) ([f076784](https://github.com/Infomaximum/integration-sdk/commit/f076784a68166c456a9f08fd14e9abbe0bfe2959))

## [2.3.0](https://github.com/Infomaximum/integration-sdk/compare/v2.2.1...v2.3.0) (2025-04-09)


### Features

* добавлен флаг для генерирования схемы ([99338fb](https://github.com/Infomaximum/integration-sdk/commit/99338fb1ecfb34d526278d1c1923f2762f1ccfb3))

### [2.2.1](https://github.com/Infomaximum/integration-sdk/compare/v2.2.0...v2.2.1) (2025-04-08)


### Bug Fixes

* исправлен тип структуры ObjectArrayOutput ([87d510b](https://github.com/Infomaximum/integration-sdk/commit/87d510bbce2a8f4aeb54ceed96ad9df195d997b0))

## [2.2.0](https://github.com/Infomaximum/integration-sdk/compare/v2.1.0...v2.2.0) (2025-04-04)


### Features

* добавлены новые типы данных output_variables ([095dc10](https://github.com/Infomaximum/integration-sdk/commit/095dc10a971a6684aa241611fba17f640522886d))

## [2.1.0](https://github.com/Infomaximum/integration-sdk/compare/v2.0.0...v2.1.0) (2025-04-04)


### Features

* добавлены типы output_variables ([31c6206](https://github.com/Infomaximum/integration-sdk/commit/31c6206644df400b9d8a40cbed4cd312c46fabd3))

## [2.0.0](https://github.com/Infomaximum/integration-sdk/compare/v1.4.2...v2.0.0) (2025-04-03)


### Features

* начальная реализация с использованием generics ([8937b4b](https://github.com/Infomaximum/integration-sdk/commit/8937b4b01b1afb875683debff67aeabcf8fa6e06))


### Bug Fixes

* исправлены дженерики ([b7eb96e](https://github.com/Infomaximum/integration-sdk/commit/b7eb96e3d175b3943ca5660ec887bf421e766045))
* исправлены типы ([a32dd2d](https://github.com/Infomaximum/integration-sdk/commit/a32dd2d3cda4e133481751b6b06e955d9e88fc56))
* исправлены типы ([cf5048b](https://github.com/Infomaximum/integration-sdk/commit/cf5048b7c105d8b94315ff7544fe79765c8cd896))
* исправлены типы подключения ([08777b1](https://github.com/Infomaximum/integration-sdk/commit/08777b1f03412d63ad1a57352163423f38fa1dc4))
* types ([f4dc50b](https://github.com/Infomaximum/integration-sdk/commit/f4dc50b8b6ac9cfe91ed024ac2b5e55a77061bdc))

### [1.4.2](https://github.com/Infomaximum/integration-sdk/compare/v1.4.1...v1.4.2) (2025-03-27)


### Bug Fixes

* исправлен тип BlockContext ([de160bf](https://github.com/Infomaximum/integration-sdk/commit/de160bf40172315906f98fd3f87a57aa64c4040c))

### [1.4.1](https://github.com/Infomaximum/integration-sdk/compare/v1.4.0...v1.4.1) (2025-03-26)


### Bug Fixes

* series может отсутствовать ([42d3cca](https://github.com/Infomaximum/integration-sdk/commit/42d3ccaae2aec0418fd390d966629e7c441d9a3c))

## [1.4.0](https://github.com/Infomaximum/integration-sdk/compare/v1.3.2...v1.4.0) (2025-03-26)


### Features

* добавлено пространство для типов отладчика ([ef5c697](https://github.com/Infomaximum/integration-sdk/commit/ef5c69715e21e3a9fd485162798feccf921a3ffd))

### [1.3.2](https://github.com/Infomaximum/integration-sdk/compare/v1.3.1...v1.3.2) (2025-03-25)

### [1.3.1](https://github.com/Infomaximum/integration-sdk/compare/v1.3.0...v1.3.1) (2025-03-24)


### Bug Fixes

* fixing use function in inputfields and add params to connection methods ([968ec77](https://github.com/Infomaximum/integration-sdk/commit/968ec77579bbe62d13f528cf8d383d9813509b19))
* removed return empty array ([facc4cc](https://github.com/Infomaximum/integration-sdk/commit/facc4cc9a41b870f10de2f440001e9e669956ead))
* this is null ([7738005](https://github.com/Infomaximum/integration-sdk/commit/7738005d31c0ca1c112492d0440ae879c3d255e9))

## [1.3.0](https://github.com/Infomaximum/integration-sdk/compare/v1.2.2...v1.3.0) (2025-03-21)


### Features

* добавлены экспорты типов ([0c5a083](https://github.com/Infomaximum/integration-sdk/commit/0c5a08300d7f52638f460cc1d1003d93a7d08ddc))


### Bug Fixes

* исправлено генерирование единого .d.ts файла ([dd5d7ae](https://github.com/Infomaximum/integration-sdk/commit/dd5d7ae673058a44f8de133bf83a1535864cde57))

### [1.2.2](https://github.com/Infomaximum/integration-sdk/compare/v1.2.1...v1.2.2) (2025-03-20)

### [1.2.1](https://github.com/Infomaximum/integration-sdk/compare/v1.2.0...v1.2.1) (2025-03-04)

## [1.2.0](https://github.com/Infomaximum/integration-sdk/compare/v1.1.1...v1.2.0) (2025-03-03)


### Features

* "Расширение типизации блоков, добавлена типизация для подключения" ([4d3b75c](https://github.com/Infomaximum/integration-sdk/commit/4d3b75c9c14c6f129ef7262a52119f01d7b50917))

### [1.1.1](https://github.com/Infomaximum/integration-sdk/compare/v1.1.0...v1.1.1) (2025-02-25)

## 1.1.0 (2025-02-25)


### Features

* базовые типы ([1f10d1a](https://github.com/Infomaximum/integration-sdk/commit/1f10d1ac346119d0733c86f1be3b3177f190c548))
