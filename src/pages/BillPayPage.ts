import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UI_ROUTES } from '@constants/endpoints';

export class BillPayPage extends BasePage {
  private readonly payeeNameInput: Locator;
  private readonly payeeAddressInput: Locator;
  private readonly payeeCityInput: Locator;
  private readonly payeeStateInput: Locator;
  private readonly payeeZipInput: Locator;
  private readonly payeePhoneInput: Locator;
  private readonly amountInput: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly payButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;
  private readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.payeeAddressInput = page.locator('input[name="payee.address.street"]');
    this.payeeCityInput = page.locator('input[name="payee.address.city"]');
    this.payeeStateInput = page.locator('input[name="payee.address.state"]');
    this.payeeZipInput = page.locator('input[name="payee.address.zipCode"]');
    this.payeePhoneInput = page.locator('input[name="payee.phoneNumber"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
    this.payButton = page.getByRole('button', { name: /send payment/i });
    this.successMessage = page.locator('.title');
    this.errorMessage = page.locator('.error');
    this.confirmationMessage = page.locator('#billpayConfirmation, .message');
  }

  public async navigateToBillPay(): Promise<void> {
    await this.navigateToPath(UI_ROUTES.BILL_PAY);
  }

  public async payBill(payeeData: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    amount: number;
    fromAccountId: string;
  }): Promise<void> {
    await this.payeeNameInput.fill(payeeData.name);
    await this.payeeAddressInput.fill(payeeData.address);
    await this.payeeCityInput.fill(payeeData.city);
    await this.payeeStateInput.fill(payeeData.state);
    await this.payeeZipInput.fill(payeeData.zipCode);
    await this.payeePhoneInput.fill(payeeData.phone);
    await this.amountInput.fill(payeeData.amount.toString());
    await this.fromAccountSelect.selectOption(payeeData.fromAccountId);
    await this.payButton.click();
  }

  public async getSuccessMessage(): Promise<string> {
    const text = await this.successMessage.textContent();
    return text ?? '';
  }

  public async getConfirmationMessage(): Promise<string> {
    const text = await this.confirmationMessage.textContent();
    return text ?? '';
  }

  public async getErrorMessage(): Promise<string> {
    const text = await this.errorMessage.textContent();
    return text ?? '';
  }

  public async isBillPayPageDisplayed(): Promise<boolean> {
    return this.payButton.isVisible();
  }
}
