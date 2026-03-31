import { test as base, Page, APIRequestContext } from '@playwright/test';
import { TestContext } from './test-context';
import { TransactionFlow } from '../../tests/flows/transaction.flow';
import { AuthAPI } from '@api/AuthAPI';
import { TransactionAPI } from '@api/TransactionAPI';
import { BillPayAPI } from '@api/BillPayAPI';

export interface TestContextFixture {
  testId: string;
  createdResources: string[];
}

export const test = base.extend<{
  testContext: TestContext;
  transactionFlow: TransactionFlow;
  authenticatedPage: Page;
  apiContext: APIRequestContext;
}>({
  testContext: async (_: unknown, use): Promise<void> => {
    const testContext = new TestContext();

    await use(testContext);

    testContext.clear();
  },

  transactionFlow: async ({ apiContext, testContext }, use): Promise<void> => {
    const authAPI = new AuthAPI(apiContext);
    const transactionAPI = new TransactionAPI(apiContext);
    const billPayAPI = new BillPayAPI(apiContext);
    const transactionFlow = new TransactionFlow(transactionAPI, authAPI, billPayAPI, testContext);

    await use(transactionFlow);
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
