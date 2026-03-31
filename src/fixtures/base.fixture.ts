import { test as base, Page, APIRequestContext } from '@playwright/test';
import { TestContext } from './test-context';

export interface TestContextFixture {
  testId: string;
  createdResources: string[];
}

export const test = base.extend<{
  testContext: TestContext;
  authenticatedPage: Page;
  apiContext: APIRequestContext;
}>({
  // eslint-disable-next-line no-empty-pattern
  testContext: async ({}, use): Promise<void> => {
    const testContext = new TestContext();

    await use(testContext);

    testContext.clear();
  },

  authenticatedPage: async ({ page }, use): Promise<void> => {
    await use(page);
  },

  apiContext: async ({ playwright }, use): Promise<void> => {
    const apiContext = await playwright.request.newContext();

    await use(apiContext);
    await apiContext.dispose();
  },
});

export { expect } from '@playwright/test';
