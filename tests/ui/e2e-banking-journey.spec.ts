import { test, expect } from '@playwright/test';
import { RegistrationPage } from '@pages/RegistrationPage';
import { LoginPage } from '@pages/LoginPage';
import { OverviewPage } from '@pages/OverviewPage';
import { OpenAccountPage } from '@pages/OpenAccountPage';
import { TransferFundsPage } from '@pages/TransferFundsPage';
import { BillPayPage } from '@pages/BillPayPage';
import { AccountServicesPage } from '@pages/AccountServicesPage';
import { createTestUser, getRandomTransferAmount, BillPaymentBuilder } from '@utils/test-data';
import { TestContext } from '@fixtures/test-context';
import { UI_ROUTES } from '@constants/endpoints';

test('Complete banking journey - User opens account, transfers funds, and pays bills', async ({
  page,
}) => {
  const testContext = new TestContext();

  const regPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);
  const overview = new OverviewPage(page);
  const accountPage = new OpenAccountPage(page);
  const transferPage = new TransferFundsPage(page);
  const billPage = new BillPayPage(page);
  const accountServicesPage = new AccountServicesPage(page);

  testContext.setUser(createTestUser());

  await regPage.navigateToRegistrationPage();
  expect(page.url()).toContain(UI_ROUTES.REGISTER);

  await regPage.registerUser(testContext.getUser()!);

  const errors = await regPage.getAllErrors();
  expect(errors, `Registration failed with errors: ${errors.join(', ')}`).toHaveLength(0);

  const successTitle = await regPage.getSuccessMessage();
  expect(successTitle).toContain(`Welcome ${testContext.getUser()!.username}`);

  const successDetail = await regPage.getSuccessDetail();
  expect(successDetail).toBe('Your account was created successfully. You are now logged in.');

  await accountServicesPage.logout();

  await loginPage.navigateToLoginPage();
  await loginPage.login(testContext.getUser()!.username, testContext.getUser()!.password);
  expect(page.url()).toContain(UI_ROUTES.ACCOUNTS_OVERVIEW);

  const greeting = await overview.getWelcomeMessage();
  expect(greeting).toContain(testContext.getUser()!.firstName);

  expect(await accountServicesPage.isMenuVisible()).toBeTruthy();
  expect(await accountServicesPage.isAccountServicesSectionVisible()).toBeTruthy();

  await accountServicesPage.openAccount();
  expect(page.url()).toContain(UI_ROUTES.OPEN_ACCOUNT);

  const accounts = await overview.getAllAccounts();
  expect(accounts.length).toBeGreaterThan(0);

  testContext.setPrimaryAccount(accounts[0]);

  testContext.setSavingsAccount(
    await accountPage.openNewAccount('SAVINGS', testContext.getPrimaryAccount()!)
  );
  expect(testContext.getSavingsAccount()).toBeTruthy();
  expect(testContext.getSavingsAccount()).toMatch(/^\d+$/);

  const accountMsg = await accountPage.getSuccessMessage();
  expect(accountMsg).toContain('Account');

  await overview.navigateToOverview();
  const balance = await overview.getAccountBalance(testContext.getSavingsAccount()!);
  expect(balance).toBeTruthy();
  expect(balance).toMatch(/^\$[\d,]+\.\d{2}$/);

  const allAccounts = await overview.getAllAccounts();
  expect(allAccounts).toContain(testContext.getSavingsAccount());

  await accountServicesPage.goToTransfer();
  expect(page.url()).toContain(UI_ROUTES.TRANSFER_FUNDS);

  testContext.setLastTransferAmount(getRandomTransferAmount(50, 300));

  await transferPage.transferFunds(
    testContext.getPrimaryAccount()!,
    testContext.getSavingsAccount()!,
    testContext.getLastTransferAmount()!
  );

  const transferMsg = await transferPage.getConfirmationMessage();
  expect(transferMsg).toBeTruthy();
  expect(transferMsg.toLowerCase()).toContain('success');

  await accountServicesPage.goToBillPay();
  expect(page.url()).toContain(UI_ROUTES.BILL_PAY);

  testContext.setLastBillAmount(
    new BillPaymentBuilder(parseInt(testContext.getSavingsAccount()!)).withTypicalAmount().build()
      .amount
  );

  const payment = new BillPaymentBuilder(parseInt(testContext.getSavingsAccount()!))
    .withTypicalAmount()
    .build();

  testContext.setLastBillAmount(payment.amount);

  await billPage.payBill({
    name: payment.payee,
    address: payment.address,
    city: payment.city,
    state: payment.state,
    zipCode: payment.zipCode,
    phone: payment.phone,
    amount: testContext.getLastBillAmount()!,
    fromAccountId: String(testContext.getSavingsAccount()),
  });

  const billMsg = await billPage.getSuccessMessage();
  expect(billMsg).toBeTruthy();
});
