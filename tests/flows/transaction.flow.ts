import { expect } from '@playwright/test';
import { AuthAPI } from '@api/AuthAPI';
import { TransactionAPI } from '@api/TransactionAPI';
import { BillPayAPI } from '@api/BillPayAPI';
import { TestContext } from '@fixtures/test-context';
import { UserBuilder, BillPaymentBuilder } from '@utils/test-data-builder';

export class TransactionFlow {
  constructor(
    private transactionAPI: TransactionAPI,
    private authAPI: AuthAPI,
    private billPayAPI: BillPayAPI,
    private context: TestContext
  ) {}

  async givenUserHasMadeABillPayment() {
    await this.setupUserAndPayment();
  }

  private async setupUserAndPayment() {
    await this.createAndLoginUser();
    await this.prepareAccount();
    await this.makeBillPayment();
  }

  private async createAndLoginUser() {
    const user = new UserBuilder().build();
    this.context.setUser(user);

    await this.authAPI.register(user);
    await this.authAPI.login(user.username, user.password);
  }

  private async prepareAccount() {
    const accounts = await this.transactionAPI.getTransactions('default');

    expect(accounts.length).toBeGreaterThan(0);

    this.context.addAccount(accounts[0].accountId);
  }

  private async makeBillPayment() {
    const accountId = this.context.accountId!;

    const bill = new BillPaymentBuilder(parseInt(accountId)).withTypicalAmount().build();

    this.context.setLastBillAmount(bill.amount);

    await this.billPayAPI.payBill({
      name: bill.payee,
      address: {
        street: bill.address,
        city: bill.city,
        state: bill.state,
        zipCode: bill.zipCode,
      },
      phoneNumber: bill.phone,
      accountNumber: accountId,
      amount: bill.amount,
    });
  }

  async whenUserSearchesTransactionsByThatAmount() {
    this.context.transactions = await this.transactionAPI.findTransactionsByAmount(
      this.context.accountId!,
      this.context.billAmount!
    );
  }

  async thenUserSeesMatchingTransactions() {
    expect(this.context.transactions!.length).toBeGreaterThan(0);
  }

  async andTransactionDetailsAreValid() {
    const match = this.context.transactions!.find(
      (t) => Math.abs(t.amount - this.context.billAmount!) < 0.01
    );

    expect(match).toBeTruthy();
    expect(match!.amount).toBe(this.context.billAmount);
    expect(match!.date).toBeTruthy();
    expect(match!.type).toBeTruthy();
  }
}
