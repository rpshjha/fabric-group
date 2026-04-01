import { test, expect } from '@playwright/test';
import { RegistrationPage } from '@pages/RegistrationPage';
import { LoginPage } from '@pages/LoginPage';
import { createTestUser, getRandomTransferAmount, BillPaymentBuilder } from '@utils/test-data';
import { TestContext } from '@fixtures/test-context';
import { UI_ROUTES } from '@constants/endpoints';
import { AccountServicesPage } from '@/pages/AccountServicesPage';
import { AccountsOverviewPage } from '@/pages/AccountsOverviewPage';
import { AccountActivityPage } from '@/pages/AccountActivityPage';
import { TransactionDetailsPage } from '@/pages/Transaction DetailsPage';
import { TransactionAPI } from '@api/TransactionAPI';

test('User completes end-to-end banking journey successfully', async ({ page }) => {
  test.setTimeout(60000);

  const context = new TestContext();
  const user = createTestUser();
  context.setUser(user);

  const registrationPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);

  let accountServicesPage: AccountServicesPage;
  let accountsOverviewPage: AccountsOverviewPage;
  let newSavingsAccountId: string;

  await test.step('User registers successfully', async () => {
    await registrationPage.navigateToRegistrationPage();
    await expect(page).toHaveURL(new RegExp(UI_ROUTES.REGISTER));

    accountServicesPage = await registrationPage.registerUser(user);

    await expect(registrationPage.getAllErrors()).resolves.toHaveLength(0);
    await expect(registrationPage.getSuccessMessage()).resolves.toContain(
      `Welcome ${user.username}`
    );
    await expect(
      registrationPage.getSuccessDetail(),
      'User should see confirmation message after successful registration'
    ).resolves.toBe('Your account was created successfully. You are now logged in.');
  });

  await test.step('User logs in to the application', async () => {
    await accountServicesPage.logoutUser();

    await loginPage.navigateToLoginPage();
    accountsOverviewPage = await loginPage.login(user.username, user.password);

    await expect(page).toHaveURL(new RegExp(UI_ROUTES.ACCOUNTS_OVERVIEW));
    await expect(accountServicesPage.getWelcomeMessage()).resolves.toContain(user.firstName);

    let accountsOverview = await accountsOverviewPage.getAllAccounts();
    expect(
      accountsOverview.length,
      'User should have at least one account after successful login'
    ).toBeGreaterThan(0);
    accountsOverview.forEach((account) => context.addAccount(account));
  });

  await test.step('User verifies global navigation menu', async () => {
    await expect(
      accountServicesPage.isMenuVisible(),
      'Global navigation menu should be visible'
    ).resolves.toBeTruthy();
    await expect(
      accountServicesPage.isAccountServicesSectionVisible(),
      'Account Services section should be visible in the navigation menu'
    ).resolves.toBeTruthy();
  });

  await test.step('User opens a new savings account', async () => {
    const openNewAccountPage = await accountServicesPage.goToOpenNewAccount();
    await expect(page).toHaveURL(new RegExp(UI_ROUTES.OPEN_ACCOUNT));

    newSavingsAccountId = await openNewAccountPage.openNewAccount(
      'SAVINGS',
      context.getPrimaryAccount()!
    );

    context.addAccount(newSavingsAccountId, 'SAVINGS');

    expect(newSavingsAccountId, `Invalid account number generated: ${newSavingsAccountId}`).toMatch(
      /^\d+$/
    );
  });

  await test.step('User views existing accounts overview', async () => {
    accountsOverviewPage = await accountServicesPage.goToAccountsOverview();
    const accounts = await accountsOverviewPage.getAllAccounts();

    expect(accounts.length).toBeGreaterThan(0);
    accounts.forEach((account) => context.addAccount(account));

    for (const account of accounts) {
      const balance = await accountsOverviewPage.getAccountBalance(account);
      expect(balance, `User should see properly formatted account balance`).toMatch(
        /^\$[\d,]+\.\d{2}$/
      );
    }
  });

  await test.step('User transfers funds between accounts', async () => {
    const transferFundsPage = await accountServicesPage.goToTransferFunds();
    await expect(page).toHaveURL(new RegExp(UI_ROUTES.TRANSFER_FUNDS));

    const amount = getRandomTransferAmount(100, 300);
    context.setLastTransferAmount(amount);

    await transferFundsPage.transferFunds(
      context.getPrimaryAccount()!,
      context.getSecondaryAccount()!,
      amount
    );

    await expect(
      transferFundsPage.getConfirmationMessage(),
      'User should see confirmation message after successful fund transfer'
    ).resolves.toContain('Transfer Complete');
  });

  await test.step('User pays a bill successfully', async () => {
    const billPayPage = await accountServicesPage.goToBillPay();
    await expect(page).toHaveURL(new RegExp(UI_ROUTES.BILL_PAY));

    const payment = new BillPaymentBuilder(parseInt(context.getSecondaryAccount()!))
      .withTypicalAmount()
      .build();

    context.setBillPayee(payment.payee);

    await billPayPage.payBill({
      name: payment.payee,
      address: payment.address,
      city: payment.city,
      state: payment.state,
      zipCode: payment.zipCode,
      phone: payment.phone,
      amount: payment.amount,
      toAccount: String(payment.accountNumber),
      fromAccount: String(context.getSecondaryAccount()),
    });

    await expect(
      billPayPage.getSuccessMessage(),
      'Bill payment should complete successfully and display a confirmation message'
    ).resolves.toBeTruthy();
  });

  await test.step('Search the transactions using Find Transactions API', async () => {
    const accountsOverviewPage = await accountServicesPage.goToAccountsOverview();
    const fromAccount = context.getSecondaryAccount()!;

    await accountsOverviewPage.clickOnAccount(fromAccount);
    await page.waitForLoadState('networkidle');

    await test.step('Fetch last bill payment transaction from UI', async () => {
      const accountActivityPage = new AccountActivityPage(page);
      await expect(accountActivityPage.isPageLoaded()).resolves.toBeTruthy();

      const billPayee = context.getBillPayee()!;
      const transactionDescription = `Bill Payment to ${billPayee}`;
      const transactionRow =
        await accountActivityPage.getTransactionFromTable(transactionDescription);

      expect(transactionRow.date).toBeTruthy();
      expect(Number(transactionRow.amount.replace(/[^\d.]/g, ''))).toBeGreaterThan(0);

      await accountActivityPage.clickTransaction(transactionDescription);

      const transactionDetailsPage = new TransactionDetailsPage(page);
      await expect(transactionDetailsPage.isPageLoaded()).resolves.toBeTruthy();

      const uiTransaction = await transactionDetailsPage.getDetails();
      const transactionId = Number(uiTransaction.id);

      expect(transactionId).toBeGreaterThan(0);

      const cookies = await page.context().cookies();
      const jsession = cookies.find((c) => c.name === 'JSESSIONID')?.value;

      expect(jsession, 'JSESSIONID cookie should be available').toBeTruthy();
      if (!jsession) {
        throw new Error('JSESSIONID cookie missing; cannot proceed with API validation');
      }
      context.setSessionId(jsession);

      context.setLastBillPayTransaction({
        transactionId,
        fromAccount,
        billAmount: Number(uiTransaction.amount.replace(/[^\d.]/g, '')),
        transactionDescription,
        transactionUiId: uiTransaction.id,
        transactionType: uiTransaction.type,
        transactionUiAmount: uiTransaction.amount,
        transactionDate: uiTransaction.date,
      });
    });

    await test.step('Validate fetched transaction via Transaction API', async () => {
      const transactionData = context.getLastBillPayTransaction();
      if (!transactionData) {
        throw new Error('No last bill pay transaction found in context to validate');
      }
      const transactionApi = new TransactionAPI(page.request);

      const apiTransaction = await transactionApi.getTransactionById(
        transactionData.transactionId,
        {
          headers: {
            Cookie: `JSESSIONID=${context.getSessionId()}`,
          },
        }
      );

      expect(apiTransaction.id).toBe(transactionData.transactionId);
      expect(apiTransaction.accountId).toBe(Number(transactionData.fromAccount));
      expect(apiTransaction.type).toBe(transactionData.transactionType);
      expect(apiTransaction.amount).toBeCloseTo(transactionData.billAmount, 2);
      expect(apiTransaction.description).toBe(transactionData.transactionDescription);

      const apiDate = new Date(apiTransaction.date);
      const uiDate = new Date(transactionData.transactionDate);
      expect(apiDate.toDateString()).toBe(uiDate.toDateString());
    });
  });
});
