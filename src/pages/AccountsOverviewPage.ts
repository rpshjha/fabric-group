import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountsOverviewPage extends BasePage {
  private readonly accountsTable: Locator;
  private readonly accountRow: (accountId: string) => Locator;
  private readonly balanceLocator: (accountId: string) => Locator;
  private readonly accountTypeLocator: (accountId: string) => Locator;
  private readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.accountsTable = page.locator('table#accountTable');
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
    this.welcomeMessage = page.locator('p.smallText');
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
    const accountLinks = this.accountsTable.locator('tbody tr td:first-child a');

    await accountLinks.first().waitFor({ state: 'visible' });

    const accounts = await accountLinks.allTextContents();

    return accounts.map((a) => a.trim());
  }

  public async getWelcomeMessage(): Promise<string> {
    const text = await this.welcomeMessage.textContent();
    return text ?? '';
  }

  public async isOverviewPageDisplayed(): Promise<boolean> {
    return this.accountsTable.isVisible();
  }

  public async clickOnAccount(accountId: string): Promise<void> {
    await this.page.getByRole('link', { name: accountId }).click();
  }
}
