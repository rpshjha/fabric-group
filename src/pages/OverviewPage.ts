import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UI_ROUTES } from '@constants/endpoints';

export class OverviewPage extends BasePage {
  private readonly accountsTable: Locator;
  private readonly accountRow: (accountId: string) => Locator;
  private readonly balanceLocator: (accountId: string) => Locator;
  private readonly accountTypeLocator: (accountId: string) => Locator;
  private readonly logoutButton: Locator;
  private readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.accountsTable = page.locator('table');
    this.accountRow = (accountId: string) =>
      this.page.getByRole('row').filter({ hasText: accountId });
    this.balanceLocator = (accountId: string) =>
      page
        .locator(`table`)
        .locator(`text=${accountId}`)
        .locator('xpath=ancestor::tr')
        .locator('td')
        .last();
    this.accountTypeLocator = (accountId: string) =>
      this.accountRow(accountId).locator('td').nth(1);
    this.logoutButton = page.getByRole('link', { name: /logout/i });
    this.welcomeMessage = page.locator('h2');
  }

  public async navigateToOverview(): Promise<void> {
    await this.navigateToPath(UI_ROUTES.ACCOUNTS_OVERVIEW);
  }

  public async getAccountBalance(accountId: string): Promise<string> {
    const text = await this.balanceLocator(accountId).textContent();
    return text ?? '';
  }

  public async getAccountType(accountId: string): Promise<string> {
    const text = await this.accountTypeLocator(accountId).textContent();
    return text ?? '';
  }

  public async doesAccountExist(accountId: string): Promise<boolean> {
    return this.accountRow(accountId).isVisible();
  }

  public async getAllAccounts(): Promise<string[]> {
    const rowLocators = this.accountsTable.locator('tbody tr');
    const count = await rowLocators.count();
    const accounts: string[] = [];

    for (let i = 0; i < count; i++) {
      const accountId = await rowLocators.nth(i).locator('td').first().textContent();
      if (accountId) {
        accounts.push(accountId.trim());
      }
    }

    return accounts;
  }

  public async getWelcomeMessage(): Promise<string> {
    const text = await this.welcomeMessage.textContent();
    return text ?? '';
  }

  public async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  public async isOverviewPageDisplayed(): Promise<boolean> {
    return this.accountsTable.isVisible();
  }
}
