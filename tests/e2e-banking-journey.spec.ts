import { createTestUser, getRandomTransferAmount, BillPaymentBuilder } from '@utils/test-data';
import { UI_ROUTES } from '@constants/endpoints';
import { AccountServicesPage, AccountsOverviewPage, LoginPage, RegistrationPage } from '@/pages';
import { TransactionAPI } from '@api/services';
import { test, expect } from '@/fixtures';

test('User completes end-to-end banking journey successfully', async ({
  page,
  apiClient,
  testContext,
}) => {
  test.setTimeout(60000);

  const user = createTestUser();
  testContext.setUser(user);

  const registrationPage = new RegistrationPage(page);

  let loginPage: LoginPage;
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
    loginPage = await accountServicesPage.logoutUser();

    await loginPage.navigateToLoginPage();
    accountsOverviewPage = await loginPage.login(user.username, user.password);

    await expect(
      page,
      'User should land on Accounts Overview page after successful login'
    ).toHaveURL(new RegExp(UI_ROUTES.ACCOUNTS_OVERVIEW));
    await expect(
      accountServicesPage.getWelcomeMessage(),
      'Welcome message should contain user first name after login'
    ).resolves.toContain(user.firstName);

    let accounts = await accountsOverviewPage.getAllAccounts();
    expect(
      accounts.length,
      'User should have at least one account after successful login'
    ).toBeGreaterThan(0);
    accounts.forEach((account) => testContext.addAccount(account));
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
    await expect(page, 'User should be navigated to Open Account page').toHaveURL(
      new RegExp(UI_ROUTES.OPEN_ACCOUNT)
    );

    newSavingsAccountId = await openNewAccountPage.openNewAccount(
      'SAVINGS',
      testContext.getPrimaryAccount()
    );

    testContext.addAccount(newSavingsAccountId, 'SAVINGS');

    expect(newSavingsAccountId, `Invalid account number generated: ${newSavingsAccountId}`).toMatch(
      /^\d+$/
    );
  });

  await test.step('User views existing accounts overview', async () => {
    accountsOverviewPage = await accountServicesPage.goToAccountsOverview();
    const accounts = await accountsOverviewPage.getAllAccounts();

    expect(
      accounts.length,
      'User should have at least one account in Accounts Overview'
    ).toBeGreaterThan(0);
    accounts.forEach((account) => testContext.addAccount(account));

    for (const account of accounts) {
      const balance = await accountsOverviewPage.getAccountBalance(account);
      expect(balance, `User should see properly formatted account balance`).toMatch(
        /^\$[\d,]+\.\d{2}$/
      );
    }
  });

  await test.step('User transfers funds between accounts', async () => {
    const transferFundsPage = await accountServicesPage.goToTransferFunds();
    await expect(page, 'User should be navigated to Transfer Funds page').toHaveURL(
      new RegExp(UI_ROUTES.TRANSFER_FUNDS)
    );

    const amount = getRandomTransferAmount(100, 300);
    testContext.setLastTransferAmount(amount);

    await transferFundsPage.transferFunds(
      testContext.getPrimaryAccount()!,
      testContext.getSecondaryAccount()!,
      amount
    );

    await expect(
      transferFundsPage.getConfirmationMessage(),
      'User should see confirmation message after successful fund transfer'
    ).resolves.toContain('Transfer Complete');
  });

  await test.step('User pays a bill successfully', async () => {
    const billPayPage = await accountServicesPage.goToBillPay();
    await expect(page, 'User should be navigated to Bill Pay page').toHaveURL(
      new RegExp(UI_ROUTES.BILL_PAY)
    );

    const billPaymentData = new BillPaymentBuilder(parseInt(testContext.getSecondaryAccount()))
      .withTypicalAmount()
      .build();

    await billPayPage.payBill({
      name: billPaymentData.payee,
      address: billPaymentData.address,
      city: billPaymentData.city,
      state: billPaymentData.state,
      zipCode: billPaymentData.zipCode,
      phone: billPaymentData.phone,
      amount: billPaymentData.amount,
      toAccount: String(billPaymentData.accountNumber),
      fromAccount: String(testContext.getSecondaryAccount()),
    });

    await expect(
      billPayPage.getSuccessMessage(),
      'Bill payment should complete successfully and display a confirmation message'
    ).resolves.toBeTruthy();

    testContext.setLastBillPayTransaction({
      fromAccount: String(testContext.getSecondaryAccount()),
      billAmount: billPaymentData.amount,
      transactionDescription: `Bill Payment to ${billPaymentData.payee}`,
    });
  });

  await test.step('Validate payment transactions using Find Transactions API (by amount) and verify response data', async () => {
    const billTransactionData = testContext.getLastBillPayTransaction();
    if (!billTransactionData) {
      throw new Error('No last bill pay transaction found in context to validate');
    }

    const transactionApi = new TransactionAPI(apiClient);

    const apiTransactions = await transactionApi.searchByAmount(
      Number(billTransactionData.fromAccount),
      billTransactionData.billAmount!
    );

    expect(
      apiTransactions.length,
      'API should return at least one transaction for the given account and amount'
    ).toBeGreaterThan(0);

    const matchingTransaction = apiTransactions.find(
      (tx) => tx.description === billTransactionData.transactionDescription
    );

    expect(matchingTransaction, 'Should find matching transaction by description').toBeTruthy();

    if (matchingTransaction) {
      if (billTransactionData.transactionId) {
        expect(matchingTransaction.id).toBe(billTransactionData.transactionId);
      }
      expect(matchingTransaction.accountId).toBe(Number(billTransactionData.fromAccount));
      expect(matchingTransaction.type).toBe('Debit');
      expect(matchingTransaction.amount).toBeCloseTo(billTransactionData.billAmount!, 2);

      if (billTransactionData.transactionDate) {
        const apiDate = new Date(matchingTransaction.date);
        const uiDate = new Date(billTransactionData.transactionDate);
        expect(apiDate.toDateString()).toBe(uiDate.toDateString());
      }
    }
  });
});
