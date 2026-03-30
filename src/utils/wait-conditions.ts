import { Page } from '@playwright/test';

export async function waitForNetworkIdle(page: Page, timeoutMs = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: timeoutMs });
}
