import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UI_ROUTES } from '@constants/endpoints';

export class TransferFundsPage extends BasePage {
  private readonly amountInput: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly toAccountSelect: Locator;
  private readonly transferButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;
  private readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('input#amount');
    this.fromAccountSelect = page.locator('select#fromAccountId');
    this.toAccountSelect = page.locator('select#toAccountId');
    this.transferButton = page.locator("input[value='Transfer']");
    this.successMessage = page.locator('.title');
    this.errorMessage = page.locator('.error');
    this.confirmationMessage = page.locator('#showResult');
  }

  public async navigateToTransfer(): Promise<void> {
    await this.navigateToPath(UI_ROUTES.TRANSFER_FUNDS);
  }

  public async transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number
  ): Promise<void> {
    await this.amountInput.fill(amount.toString());
    await this.fromAccountSelect.selectOption(fromAccountId);
    await this.toAccountSelect.selectOption(toAccountId);
    await this.transferButton.click();
  }

  public async getSuccessMessage(): Promise<string> {
    const text = await this.successMessage.textContent();
    return text ?? '';
  }

  public async getConfirmationMessage(): Promise<string> {
    await this.confirmationMessage.waitFor({ state: 'visible' }); // ✅ wait for result

    const text = await this.confirmationMessage.textContent();
    return text ?? '';
  }

  public async getErrorMessage(): Promise<string> {
    const text = await this.errorMessage.textContent();
    return text ?? '';
  }

  public async isTransferPageDisplayed(): Promise<boolean> {
    return this.transferButton.isVisible();
  }
}
