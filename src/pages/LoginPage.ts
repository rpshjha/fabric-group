import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UI_ROUTES } from '@constants/endpoints';
import { AccountsOverviewPage } from './AccountsOverviewPage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: /log in/i });
    this.errorMessage = page.locator('.error');
    this.welcomeMessage = page.locator('h2');
  }

  public async navigateToLoginPage(): Promise<void> {
    await this.navigateToPath(UI_ROUTES.LOGIN);
  }

  public async login(username: string, password: string): Promise<AccountsOverviewPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return new AccountsOverviewPage(this.page);
  }

  public async getErrorMessage(): Promise<string> {
    const text = await this.errorMessage.textContent();
    return text ?? '';
  }

  public async getWelcomeMessage(): Promise<string> {
    const text = await this.welcomeMessage.textContent();
    return text ?? '';
  }

  public async isLoginPageDisplayed(): Promise<boolean> {
    return this.loginButton.isVisible();
  }
}
