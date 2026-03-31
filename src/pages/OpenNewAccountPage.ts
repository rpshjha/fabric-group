import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UI_ROUTES } from '@constants/endpoints';

export class OpenNewAccountPage extends BasePage {
  private readonly accountTypeSelect: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly openButton: Locator;
  private readonly successMessage: Locator;
  private readonly newAccountNumber: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTypeSelect = page.locator('select#type');
    this.fromAccountSelect = page.locator('select#fromAccountId');
    this.openButton = page.locator('input[value="Open New Account"]');
    this.newAccountNumber = page.locator('a#newAccountId');
    this.errorMessage = page.locator('.error');
    this.successMessage = page.locator('#openAccountResult');
  }

  public async navigateToOpenAccount(): Promise<void> {
    await this.navigateToPath(UI_ROUTES.OPEN_ACCOUNT);
  }

  public async openNewAccount(accountType: string, existingAccountNumber: string): Promise<string> {
    await expect(this.fromAccountSelect.locator('option')).not.toHaveCount(0);

    await this.accountTypeSelect.selectOption(accountType === 'CHECKING' ? '0' : '1');
    await this.fromAccountSelect.selectOption(existingAccountNumber);
    await this.openButton.click();

    await Promise.race([
      this.successMessage.waitFor({ state: 'visible' }),
      this.page.locator('#openAccountForm').waitFor({ state: 'hidden' }),
    ]);
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
