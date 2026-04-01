import { test as base } from './base.fixture';
import { APIClient } from '../api/core/api-client';

export const test = base.extend<{
  apiClient: APIClient;
}>({
  apiClient: async ({ page }, use) => {
    const client = new APIClient(page.request);
    await use(client);
  },
});

export { expect } from './base.fixture';
