import { test as base, APIRequestContext } from '@playwright/test';
import { TestContext } from '@/context';
import { APIClient } from '@/api/core/api-client';

export const test = base.extend<{
  testContext: TestContext;
  apiRequestContext: APIRequestContext;
  apiClient: APIClient;
}>({
  // eslint-disable-next-line no-empty-pattern
  testContext: async ({}, use): Promise<void> => {
    const testContext = new TestContext();
    await use(testContext);
    testContext.clear();
  },

  apiRequestContext: async ({ playwright }, use): Promise<void> => {
    const apiRequestContext = await playwright.request.newContext();
    await use(apiRequestContext);
    await apiRequestContext.dispose();
  },

  apiClient: async ({ page }, use) => {
    const client = new APIClient(page.request);
    await use(client);
  },
});

export { expect } from '@playwright/test';
