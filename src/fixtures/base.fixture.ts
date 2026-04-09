import { test as base } from '@playwright/test';
import { TestContext } from '@/context';
import { APIClient } from '@/api/core/api-client';

export const test = base.extend<{
  testContext: TestContext;
  apiClient: APIClient;
}>({
  // eslint-disable-next-line no-empty-pattern
  testContext: async ({}, use): Promise<void> => {
    const testContext = new TestContext();
    await use(testContext);
    testContext.clear();
  },

  apiClient: async ({ page }, use): Promise<void> => {
    const client = new APIClient(page.request);
    await use(client);
  },
});

export { expect } from '@playwright/test';
