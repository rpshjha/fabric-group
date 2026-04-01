import { APIClient } from './api-client';

export class BaseAPI {
  constructor(protected client: APIClient) {}

  protected assertOk(status: number, message: string) {
    if (status !== 200) {
      throw new Error(`${message} | Status: ${status}`);
    }
  }
}
