import { AccountType, BillPayTransaction, TestContextData, UserRegistrationData } from '@/models';

export class TestContext {
  private data: TestContextData = {
    accounts: [],
    fundTransfer: {},
    billPay: {},
  };

  setUser(user: UserRegistrationData): void {
    this.data.user = user;
  }

  addAccount(accountId: string, type: AccountType = 'SAVINGS'): void {
    this.data.accounts.push({ id: accountId, type });
  }

  getPrimaryAccount(): string {
    const account = this.data.accounts[0]?.id;
    if (!account) throw new Error('Primary account not found');
    return account;
  }

  getSecondaryAccount(): string {
    const account = this.data.accounts[1]?.id;
    if (!account) throw new Error('Secondary account not found');
    return account;
  }

  setLastTransferAmount(amount: number): void {
    this.data.fundTransfer.lastTransferAmount = amount;
  }

  setLastBillPayTransaction(transaction: BillPayTransaction): void {
    this.data.billPay.lastTransaction = transaction;
  }

  getLastBillPayTransaction(): BillPayTransaction | undefined {
    return this.data.billPay.lastTransaction;
  }

  clear(): void {
    this.data = { accounts: [], fundTransfer: {}, billPay: {} };
  }
}
