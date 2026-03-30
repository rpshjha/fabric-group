import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UI_ROUTES } from '@constants/endpoints';

export class OpenAccountPage extends BasePage {
  private readonly accountTypeSelect: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly openButton: Locator;
  private readonly successMessage: Locator;
  private readonly newAccountNumber: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTypeSelect = page.locator('select[name="type"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
    this.openButton = page.getByRole('button', { name: /open new account/i });
    this.successMessage = page.locator('h1.title, .title');
    this.newAccountNumber = page.locator('#newAccountId');
    this.errorMessage = page.locator('.error');
  }

  public async navigateToOpenAccount(): Promise<void> {
    await this.navigateToPath(UI_ROUTES.OPEN_ACCOUNT);
  }

  public async openNewAccount(accountType: string, fromAccountId?: string): Promise<string> {
    await this.accountTypeSelect.selectOption(accountType);

    if (fromAccountId) {
      await this.fromAccountSelect.selectOption(fromAccountId);
    }

    await this.openButton.click();

    return this.getNewAccountNumber();
  }

  public async getNewAccountNumber(): Promise<string> {
    const text = await this.newAccountNumber.textContent();
    return text ?? '';
  }

  public async getSuccessMessage(): Promise<string> {
    const text = await this.successMessage.textContent();
    return text ?? '';
  }

  public async getErrorMessage(): Promise<string> {
    const text = await this.errorMessage.textContent();
    return text ?? '';
  }

  public async isOpenAccountPageDisplayed(): Promise<boolean> {
    return this.openButton.isVisible();
  }
}
