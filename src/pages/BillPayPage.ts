import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UI_ROUTES } from '@constants/endpoints';
import { BillPaymentData } from '@/models/user.model';

export class BillPayPage extends BasePage {
  private readonly payeeNameInput: Locator;
  private readonly payeeAddressInput: Locator;
  private readonly payeeCityInput: Locator;
  private readonly payeeStateInput: Locator;
  private readonly payeeZipInput: Locator;
  private readonly payeePhoneInput: Locator;

  private readonly accountNumberInput: Locator;
  private readonly verifyAccountInput: Locator;

  private readonly amountInput: Locator;
  private readonly fromAccountSelect: Locator;

  private readonly payButton: Locator;

  private readonly successMessage: Locator;
  private readonly confirmationMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Payee details
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.payeeAddressInput = page.locator('input[name="payee.address.street"]');
    this.payeeCityInput = page.locator('input[name="payee.address.city"]');
    this.payeeStateInput = page.locator('input[name="payee.address.state"]');
    this.payeeZipInput = page.locator('input[name="payee.address.zipCode"]');
    this.payeePhoneInput = page.locator('input[name="payee.phoneNumber"]');

    // Required account fields
    this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');

    // Payment details
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');

    // Button (input type, not role=button)
    this.payButton = page.locator('input[value="Send Payment"]');

    // Result / messages
    this.successMessage = page.locator('#billpayResult h1.title');
    this.confirmationMessage = page.locator('#billpayResult');
    this.errorMessage = page.locator('#billpayError');
  }

  public async navigateToBillPay(): Promise<void> {
    await this.navigateToPath(UI_ROUTES.BILL_PAY);
  }

  public async payBill(payeeData: BillPaymentData): Promise<void> {
    await this.payeeNameInput.fill(payeeData.name);
    await this.payeeAddressInput.fill(payeeData.address);
    await this.payeeCityInput.fill(payeeData.city);
    await this.payeeStateInput.fill(payeeData.state);
    await this.payeeZipInput.fill(payeeData.zipCode);
    await this.payeePhoneInput.fill(payeeData.phone);
    await this.accountNumberInput.fill(payeeData.toAccount.toString());
    await this.verifyAccountInput.fill(payeeData.toAccount.toString());
    await this.amountInput.fill(payeeData.amount.toString());
    await this.fromAccountSelect.selectOption(payeeData.fromAccount);

    await this.payButton.click();
    await this.confirmationMessage.waitFor({ state: 'visible' });
  }

  public async getSuccessMessage(): Promise<string> {
    const text = await this.successMessage.textContent();
    return text ?? '';
  }

  public async getConfirmationMessage(): Promise<string> {
    await this.confirmationMessage.waitFor({ state: 'visible' });
    const text = await this.confirmationMessage.textContent();
    return text ?? '';
  }

  public async getErrorMessage(): Promise<string> {
    const text = await this.errorMessage.textContent();
    return text ?? '';
  }

  public async getBillPayDetails() {
    await this.confirmationMessage.waitFor({ state: 'visible' });

    return {
      payee: await this.page.locator('#payeeName').textContent(),
      amount: await this.page.locator('#amount').textContent(),
      fromAccount: await this.page.locator('#fromAccountId').textContent(),
    };
  }

  public async isBillPayPageDisplayed(): Promise<boolean> {
    return this.payButton.isVisible();
  }
}
