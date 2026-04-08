import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { OpenNewAccountPage } from './OpenNewAccountPage';
import { AccountsOverviewPage } from './AccountsOverviewPage';
import { TransferFundsPage } from './TransferFundsPage';
import { BillPayPage } from './BillPayPage';
import { LoginPage } from './LoginPage';

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
  private readonly welcomeMessage: Locator;

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
    this.welcomeMessage = page.locator('p.smallText');
  }

  public async isMenuVisible(): Promise<boolean> {
    return this.menu.isVisible();
  }

  public async goToOpenNewAccount(): Promise<OpenNewAccountPage> {
    await this.openAccountLink.click();
    return new OpenNewAccountPage(this.page);
  }

  public async goToAccountsOverview(): Promise<AccountsOverviewPage> {
    await this.overviewLink.click();
    return new AccountsOverviewPage(this.page);
  }

  public async goToTransferFunds(): Promise<TransferFundsPage> {
    await this.transferLink.click();
    return new TransferFundsPage(this.page);
  }

  public async goToBillPay(): Promise<BillPayPage> {
    await this.billPayLink.click();
    return new BillPayPage(this.page);
  }

  public async goTofindTransactions(): Promise<void> {
    await this.findTransactionsLink.click();
  }

  public async goToUpdateContactInfo(): Promise<void> {
    await this.updateProfileLink.click();
  }

  public async goToRequestLoan(): Promise<void> {
    await this.requestLoanLink.click();
  }

  public async logoutUser(): Promise<LoginPage> {
    await this.logoutLink.click();
    return new LoginPage(this.page);
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

  public async getWelcomeMessage(): Promise<string> {
    return (await this.welcomeMessage.textContent()) ?? '';
  }
}
