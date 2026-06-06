import type { MultipartBodyConfig } from "../common";

/**
 * Подготавливает поля `fileName` и `encodedFileName` для `MultipartBodyConfig`
 * с поддержкой не-ASCII символов (RFC 5987).
 *
 * Если имя файла содержит только ASCII — возвращает только `fileName`.
 * Если содержит не-ASCII (кириллица, спецсимволы и т.д.) — возвращает оба поля:
 * - `fileName`: ASCII-совместимый fallback
 * - `encodedFileName`: URL-encoded оригинальное имя для `filename*=UTF-8''...`
 *
 * @param fileName - Оригинальное имя файла (может содержать любые символы)
 * @param asciiFallback - ASCII-имя для серверов без RFC 5987. По умолчанию — `"file"`
 *   с сохранением расширения оригинального файла.
 *
 * @example
 * ```typescript
 * multipartBody: [{
 *   key: "file",
 *   ...encodeFilename("Печать полиса.pdf"),
 *   // → { fileName: "file.pdf", encodedFileName: "%D0%9F%D0%B5%D1%87%D0%B0%D1%82%D1%8C%20%D0%BF%D0%BE%D0%BB%D0%B8%D1%81%D0%B0.pdf" }
 *   fileValue: fileContent,
 *   contentType: "application/octet-stream",
 * }]
 * ```
 */
export function encodeFilename(
  fileName: string,
  asciiFallback?: string
): Pick<MultipartBodyConfig, "fileName" | "encodedFileName"> {
  const hasNonAscii = /[^\x20-\x7E]/.test(fileName);

  if (!hasNonAscii) {
    return { fileName };
  }

  const fallback = asciiFallback ?? buildAsciiFallback(fileName);

  return {
    fileName: fallback,
    encodedFileName: encodeURIComponent(fileName),
  };
}

function buildAsciiFallback(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  const ext = dotIndex !== -1 ? fileName.slice(dotIndex) : "";
  return `file${ext}`;
}
