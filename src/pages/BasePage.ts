import { Page, Locator } from '@playwright/test';

/**
 * Base Page object contains common locators and methods for all pages
 */
export class BasePage {
  protected readonly page: Page;

  private readonly headerLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerLocator = page.locator('header').first();
  }

  protected async navigateToPath(path: string): Promise<void> {
    await this.page.goto(path);
  }

  public getCurrentURL(): string {
    return this.page.url();
  }

  protected async isPageDisplayed(): Promise<boolean> {
    return this.headerLocator.isVisible();
  }

  protected async typeText(locator: Locator, text: string, delay: number = 100): Promise<void> {
    await locator.click();
    await locator.fill('');
    await locator.pressSequentially(text, { delay });
    await locator.press('Tab');
  }
}
