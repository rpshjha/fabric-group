import { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiResponse<T> {
  status: number;
  data: T;
  raw: APIResponse;
}

export interface RequestOptions<T = unknown> {
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number>;
  body?: T;
}

export class APIClient {
  constructor(private readonly request: APIRequestContext) {}

  async get<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.requestWrapper<T>(() =>
      this.request.get(url, {
        headers: options.headers,
        params: options.queryParams,
      })
    );
  }

  async post<T, B = unknown>(
    url: string,
    options: RequestOptions<B> = {}
  ): Promise<ApiResponse<T>> {
    return this.requestWrapper<T>(() =>
      this.request.post(url, {
        headers: options.headers,
        data: options.body,
      })
    );
  }

  private async requestWrapper<T>(apiCall: () => Promise<APIResponse>): Promise<ApiResponse<T>> {
    const response = await apiCall();
    const text = await response.text();

    let parsed: T;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text as unknown as T;
    }

    return {
      status: response.status(),
      data: parsed,
      raw: response,
    };
  }
}
