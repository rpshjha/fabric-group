import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UI_ROUTES } from '@constants/endpoints';
import { AccountServicesPage } from './AccountServicesPage';
import { UserRegistrationData } from '@/models';

export class RegistrationPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly phoneInput: Locator;
  private readonly ssnInput: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly registerButton: Locator;
  private readonly successMessage: Locator;
  private readonly successDetail: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[name="customer.firstName"]');
    this.lastNameInput = page.locator('input[name="customer.lastName"]');
    this.addressInput = page.locator('input[name="customer.address.street"]');
    this.cityInput = page.locator('input[name="customer.address.city"]');
    this.stateInput = page.locator('input[name="customer.address.state"]');
    this.zipCodeInput = page.locator('input[name="customer.address.zipCode"]');
    this.phoneInput = page.locator('input[name="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[name="customer.ssn"]');
    this.usernameInput = page.locator('input[name="customer.username"]');
    this.passwordInput = page.locator('input[name="customer.password"]');
    this.confirmPasswordInput = page.locator('input[name="repeatedPassword"]');
    this.registerButton = page.locator('input[value="Register"]');
    this.successMessage = page.locator('.title');
    this.successDetail = page.locator('#rightPanel > p');
    this.errorMessage = page.locator('span.error');
  }

  public async navigateToRegistrationPage(): Promise<void> {
    await this.navigateToPath(UI_ROUTES.REGISTER);
  }

  public async registerUser(userData: UserRegistrationData): Promise<AccountServicesPage> {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.addressInput.fill(userData.address);
    await this.cityInput.fill(userData.city);
    await this.stateInput.fill(userData.state);
    await this.zipCodeInput.fill(userData.zipCode);
    await this.phoneInput.fill(userData.phone);
    await this.ssnInput.fill(userData.ssn);
    await this.usernameInput.fill(userData.username);
    await this.passwordInput.fill(userData.password);
    await this.confirmPasswordInput.fill(userData.password);

    await this.registerButton.click();

    await Promise.race([
      this.successMessage.waitFor({ state: 'visible' }),
      this.errorMessage.first().waitFor({ state: 'visible' }),
    ]);

    return new AccountServicesPage(this.page);
  }

  public async getSuccessMessage(): Promise<string> {
    const text = await this.successMessage.textContent();
    return text ?? '';
  }

  public async getSuccessDetail(): Promise<string> {
    const text = await this.successDetail.textContent();
    return text ?? '';
  }

  public async getErrorMessage(): Promise<string> {
    const text = await this.errorMessage.textContent();
    return text ?? '';
  }

  public async isRegistrationPageDisplayed(): Promise<boolean> {
    return this.registerButton.isVisible();
  }

  public async getErrorCount(): Promise<number> {
    return await this.errorMessage.count();
  }

  public async hasErrors(): Promise<boolean> {
    return (await this.getErrorCount()) > 0;
  }

  public async getAllErrors(): Promise<string[]> {
    const errors = await this.errorMessage.allTextContents();
    return errors.map((e) => e.trim()).filter(Boolean);
  }
}
