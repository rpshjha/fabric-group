import {
  AccountType,
  BillPayTransaction,
  TestContextData,
  TransferFundsTransaction,
  UserRegistrationData,
} from '@/models';

export class TestContext {
  private data: TestContextData = {
    accounts: [],
    fundTransfer: {},
    billPay: {},
  };

  setUser(user: UserRegistrationData): void {
    this.data.user = user;
  }

  getUser(): UserRegistrationData | undefined {
    return this.data.user;
  }

  addAccount(accountId: string, type: AccountType = 'SAVINGS'): void {
    this.data.accounts.push({ id: accountId, type });
  }

  getAccountByIndex(index: number): string {
    const account = this.data.accounts[index]?.id;
    if (!account) throw new Error(`Account at index ${index} not found`);
    return account;
  }

  getPrimaryAccount(): string {
    return this.getAccountByIndex(0);
  }

  getSecondaryAccount(): string {
    return this.getAccountByIndex(1);
  }

  setLastTransferFundsTransaction(transaction: TransferFundsTransaction): void {
    this.data.fundTransfer.lastTransaction = transaction;
  }

  getLastTransferFundsTransaction(): TransferFundsTransaction | undefined {
    return this.data.fundTransfer.lastTransaction;
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
