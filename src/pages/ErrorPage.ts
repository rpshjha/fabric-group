import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ErrorPage extends BasePage {
  private readonly title: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('#rightPanel h1.title');
    this.errorMessage = page.locator('#rightPanel p.error');
  }

  public async isPageLoaded(): Promise<boolean> {
    return await this.title.isVisible();
  }

  public async getErrorTitle(): Promise<string> {
    return (await this.title.textContent())?.trim() || '';
  }

  public async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() || '';
  }

  public async verifyErrorPage(): Promise<void> {
    await expect(this.title, 'Error page title should be visible').toHaveText('Error!');
    await expect(this.errorMessage, 'Error message should be displayed correctly').toHaveText(
      'An internal error has occurred and has been logged.'
    );
  }
}
