import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransactionDetailsPage extends BasePage {
  private readonly title: Locator;
  private readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByRole('heading', { name: 'Transaction Details' });
    this.table = page.locator('#rightPanel table');
  }

  public async isPageLoaded(): Promise<boolean> {
    return this.title.isVisible();
  }

  private async getValue(label: string): Promise<string> {
    const row = this.table.locator('tr', {
      has: this.page.locator('td b', { hasText: label }),
    });

    return (await row.locator('td').nth(1).textContent())?.trim() || '';
  }

  public async getDetails() {
    return {
      id: await this.getValue('Transaction ID:'),
      date: await this.getValue('Date:'),
      description: await this.getValue('Description:'),
      type: await this.getValue('Type:'),
      amount: await this.getValue('Amount:'),
    };
  }

  public async getTransactionId(): Promise<string> {
    return this.getValue('Transaction ID:');
  }
}
