export class URLSearchParams {
  private _params: [string, string][] = [];

  constructor(init: string | Record<string, any> = "") {
    if (typeof init === "string") {
      const query = init.startsWith("?") ? init.slice(1) : init;
      if (query) {
        query.split("&").forEach((pair) => {
          const [key, value] = pair.split("=");
          if (key) {
            this.append(decodeURIComponent(key), decodeURIComponent(value || ""));
          }
        });
      }
    } else if (typeof init === "object" && init !== null) {
      for (const key in init) {
        this.append(key, init[key]);
      }
    }
  }

  append(name: string | number, value: any): void {
    this._params.push([String(name), String(value)]);
  }

  get(name: string): string | null {
    const found = this._params.find((p) => p[0] === name);
    return found ? found[1] : null;
  }

  set(name: string, value: any): void {
    const index = this._params.findIndex((p) => p[0] === name);
    if (index !== -1) {
      this._params[index][1] = String(value);
    } else {
      this.append(name, value);
    }
  }

  delete(name: string): void {
    this._params = this._params.filter((p) => p[0] !== name);
  }

  toString(): string {
    return this._params
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
  }
}

/**
 * Реализация класса URL для парсинга и манипуляции адресами внутри интеграций.
 */
export class URL {
  public protocol: string = "";
  public hostname: string = "";
  public port: string = "";
  public pathname: string = "/";
  public hash: string = "";
  public searchParams: URLSearchParams;

  constructor(url: string, base?: string) {
    let fullUrl = url;
    if (base) {
      const b = base.endsWith("/") ? base : base + "/";
      const u = url.startsWith("/") ? url.slice(1) : url;
      fullUrl = b + u;
    }

    const parsed = this._parse(fullUrl);
    if (!parsed) throw new TypeError(`Invalid URL: ${fullUrl}`);

    this.protocol = parsed.protocol;
    this.hostname = parsed.hostname;
    this.port = parsed.port;
    this.pathname = parsed.pathname;
    this.hash = parsed.hash;
    this.searchParams = new URLSearchParams(parsed.search);
  }

  private _parse(url: string) {
    // Регулярное выражение расширено для поддержки локальных хостов и IP
    const regex = /^(https?:)\/\/([^:/\s]+)(?::(\d+))?([^?#]*)(?:\?([^#]*))?(#(.*))?$/;
    const match = url.match(regex);
    if (!match) return null;

    return {
      protocol: match[1],
      hostname: match[2],
      port: match[3] || "",
      pathname: match[4] || "/",
      search: match[5] || "",
      hash: match[6] || "",
    };
  }

  get host(): string {
    return this.port ? `${this.hostname}:${this.port}` : this.hostname;
  }

  get origin(): string {
    return `${this.protocol}//${this.host}`;
  }

  get search(): string {
    const s = this.searchParams.toString();
    return s ? `?${s}` : "";
  }

  get href(): string {
    return `${this.origin}${this.pathname}${this.search}${this.hash}`;
  }

  toString(): string {
    return this.href;
  }

  [Symbol.toPrimitive](hint: string): string | null {
    if (hint === "string" || hint === "default") {
      return this.href;
    }
    return null;
  }
}
