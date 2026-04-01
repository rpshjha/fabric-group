import { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiResponse<T> {
  status: number;
  data: T;
}

export interface RequestOptions {
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
}

export class APIClient {
  constructor(private request: APIRequestContext) {}

  async get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const res = await this.request.get(url, options);
    return this.parse<T>(res);
  }

  async post<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    const res = await this.request.post(url, { data: body });
    return this.parse<T>(res);
  }

  private async parse<T>(res: APIResponse): Promise<ApiResponse<T>> {
    const text = await res.text();

    return {
      status: res.status(),
      data: this.safeParse<T>(text),
    };
  }

  private safeParse<T>(text: string): T {
    try {
      return JSON.parse(text);
    } catch {
      return text as unknown as T;
    }
  }
}
