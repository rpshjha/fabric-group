import { APIRequestContext } from '@playwright/test';
import { APIClient } from './api-client';

export abstract class APIService {
  protected readonly client: APIClient;

  constructor(request: APIRequestContext) {
    this.client = new APIClient(request);
  }
}
