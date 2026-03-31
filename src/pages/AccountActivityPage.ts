import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountActivityPage extends BasePage {
  private readonly title: Locator;
  private readonly monthDropdown: Locator;
  private readonly typeDropdown: Locator;
  private readonly goButton: Locator;
  private readonly transactionTable: Locator;
  private readonly noTransactionsMsg: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByRole('heading', { name: 'Account Activity' });
    this.monthDropdown = page.locator('#month');
    this.typeDropdown = page.locator('#transactionType');
    this.goButton = page.locator('input.button[value="Go"]');
    this.transactionTable = page.locator('#transactionTable');
    this.noTransactionsMsg = page.locator('#noTransactions');
  }

  public async isPageLoaded(): Promise<boolean> {
    return this.title.isVisible();
  }

  public async filterTransactions(month: string, type: string): Promise<void> {
    await this.monthDropdown.selectOption(month);
    await this.typeDropdown.selectOption(type);
    await this.goButton.click();
  }

  private getRow(description: string): Locator {
    return this.transactionTable.locator('tbody tr', {
      has: this.page.getByRole('link', { name: new RegExp(description, 'i') }),
    });
  }

  public async getTransactionFromTable(description: string): Promise<{
    date: string;
    amount: string;
  }> {
    const row = this.getRow(description);

    return {
      date: (await row.locator('td').nth(0).textContent())?.trim() || '',
      amount: (await row.locator('td').nth(2).textContent())?.trim() || '',
    };
  }

  public async clickTransaction(description: string): Promise<void> {
    await this.page
      .getByRole('link', {
        name: new RegExp(description, 'i'),
      })
      .click();
  }
}
