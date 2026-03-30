import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountServicesPage extends BasePage {
  private readonly menu: Locator;
  private readonly openAccountLink: Locator;
  private readonly overviewLink: Locator;
  private readonly transferLink: Locator;
  private readonly billPayLink: Locator;
  private readonly findTransactionsLink: Locator;
  private readonly updateProfileLink: Locator;
  private readonly requestLoanLink: Locator;
  private readonly logoutLink: Locator;
  private readonly homeLink: Locator;
  private readonly aboutUsLink: Locator;
  private readonly contactLink: Locator;

  constructor(page: Page) {
    super(page);
    this.menu = page.locator('#leftPanel');
    this.openAccountLink = this.menu.getByRole('link', { name: /Open New Account/i });
    this.overviewLink = this.menu.getByRole('link', { name: /Accounts Overview/i });
    this.transferLink = this.menu.getByRole('link', { name: /Transfer Funds/i });
    this.billPayLink = this.menu.getByRole('link', { name: /Bill Pay/i });
    this.findTransactionsLink = this.menu.getByRole('link', { name: /Find Transactions/i });
    this.updateProfileLink = this.menu.getByRole('link', { name: /Update Contact Info/i });
    this.requestLoanLink = this.menu.getByRole('link', { name: /Request Loan/i });
    this.logoutLink = this.menu.getByRole('link', { name: /Log Out/i });
    this.homeLink = page.locator('ul.button li.home a');
    this.aboutUsLink = page.locator('ul.button li.aboutus a');
    this.contactLink = page.locator('ul.button li.contact a');
  }

  public async isMenuVisible(): Promise<boolean> {
    return this.menu.isVisible();
  }

  public async openAccount(): Promise<void> {
    await this.openAccountLink.click();
  }

  public async goToOverview(): Promise<void> {
    await this.overviewLink.click();
  }

  public async goToTransfer(): Promise<void> {
    await this.transferLink.click();
  }

  public async goToBillPay(): Promise<void> {
    await this.billPayLink.click();
  }

  public async findTransactions(): Promise<void> {
    await this.findTransactionsLink.click();
  }

  public async updateContactInfo(): Promise<void> {
    await this.updateProfileLink.click();
  }

  public async requestLoan(): Promise<void> {
    await this.requestLoanLink.click();
  }

  public async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  public async goToHome(): Promise<void> {
    await this.homeLink.click();
  }

  public async goToAboutUs(): Promise<void> {
    await this.aboutUsLink.click();
  }

  public async goToContact(): Promise<void> {
    await this.contactLink.click();
  }

  public async isAccountServicesSectionVisible(): Promise<boolean> {
    return this.menu.locator('h2', { hasText: 'Account Services' }).isVisible();
  }
}
