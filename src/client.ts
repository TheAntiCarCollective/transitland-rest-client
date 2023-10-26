import type { Meta } from "./index";

import sleep from "./shared/sleep";

// region Types
export type ClientOptions =
  | {
      apiKey: string;
      baseUrl?: string;
    }
  | string;

export type RateLimit = {
  id: number;
  limitPerMinute: number;
  limitPerMonth: number;
  remainingInMinute: number;
  remainingInMonth: number;
  resetsAt: number;
};

export type FetchOptions =
  | {
      path: string;
      query?: ConstructorParameters<typeof URLSearchParams>[0];
    }
  | {
      url: string;
    }
  | string;

export type Page = Partial<Record<"meta", Meta>>;
// endregion

export class TransitlandError extends Error {
  readonly response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

export default class Client {
  static readonly DefaultBaseUrl = "https://transit.land/api/v2/rest";

  private _rateLimit;
  readonly apiKey;
  readonly baseUrl;

  constructor(options: ClientOptions) {
    if (typeof options === "object") {
      this.apiKey = options.apiKey;
      this.baseUrl = options.baseUrl ?? Client.DefaultBaseUrl;
    } else {
      this.apiKey = options;
      this.baseUrl = Client.DefaultBaseUrl;
    }

    this._rateLimit = {
      id: Math.random(),
      limitPerMinute: 60,
      limitPerMonth: 10_000,
      remainingInMinute: 60,
      remainingInMonth: 10_000,
      resetsAt: performance.now(),
    } as Readonly<RateLimit>;
  }

  private async applyRateLimit(): Promise<void> {
    const { id: oldId, remainingInMinute, resetsAt } = this.rateLimit;

    if (remainingInMinute <= 0) {
      await sleep(resetsAt - performance.now());
      const { id, limitPerMinute } = this.rateLimit;
      // _rateLimit was set by a different async invocation
      if (oldId !== id) return this.applyRateLimit();

      this._rateLimit = {
        ...this.rateLimit,
        id: Math.random(),
        remainingInMinute: limitPerMinute,
        resetsAt: performance.now(),
      };
    } else {
      this._rateLimit = {
        ...this.rateLimit,
        id: Math.random(),
        remainingInMinute: remainingInMinute - 1,
      };
    }
  }

  private setRateLimit(headers: Headers) {
    const asNumber = (name: string) => {
      let header: null | number | string = headers.get(name);
      if (header === null) return;
      header = Number.parseInt(header);
      return Number.isNaN(header) ? undefined : header;
    };

    const limitPerMinute = asNumber("X-RateLimit-Limit-Minute");
    if (limitPerMinute === undefined) return;
    const limitPerMonth = asNumber("X-RateLimit-Limit-Month");
    if (limitPerMonth === undefined) return;
    const remainingInMinute = asNumber("X-RateLimit-Remaining-Minute");
    if (remainingInMinute === undefined) return;
    const remainingInMonth = asNumber("X-RateLimit-Remaining-Month");
    if (remainingInMonth === undefined) return;
    const resetsInSeconds = asNumber("RateLimit-Reset");
    if (resetsInSeconds === undefined) return;
    const resetsAt = performance.now() + resetsInSeconds * 1000;

    this._rateLimit = {
      id: Math.random(),
      limitPerMinute,
      limitPerMonth,
      remainingInMinute,
      remainingInMonth,
      resetsAt,
    };
  }

  async fetch<T>(options: FetchOptions): Promise<T> {
    const headers = { apikey: this.apiKey };

    let url;
    if (typeof options === "string") {
      return this.fetch({ path: options });
    } else if ("url" in options) {
      url = options.url;
    } else {
      let { path, query } = options;
      path = path.startsWith("/") ? path : `/${path}`;
      url = `${this.baseUrl}${path}`;

      query = new URLSearchParams(query);
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      if (query.size > 0) url += `?${query}`;
    }

    await this.applyRateLimit();
    const response = await fetch(url, { headers });
    this.setRateLimit(response.headers);
    const text = await response.text();

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      // Ignore error; json is undefined
    }

    switch (response.status) {
      // OK
      case 200: {
        if (json === undefined) break;
        return json as T;
      }
      // Too Many Requests
      case 429: {
        return this.fetch<T>(options);
      }
    }

    let message = `${response.statusText}: ${text}`;
    if (typeof json === "object" && json !== null && "error" in json) {
      const { error } = json;
      message = typeof error === "string" ? error : message;
    }

    throw new TransitlandError(message, response);
  }

  async *paginateFetch<P extends Page>(options: FetchOptions) {
    let next: FetchOptions | undefined = options;
    while (next !== undefined) {
      const page: P = await this.fetch(next);
      yield page;

      const { meta } = page;
      next = meta === undefined ? undefined : { url: meta.next };
    }
  }

  get rateLimit() {
    return this._rateLimit;
  }
}
