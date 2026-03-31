export type AccountType = 'SAVINGS' | 'CHECKING';

export type Account = {
  id: string;
  type: AccountType;
};
export interface TestContextData {
  user?: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
  };
  accounts?: Account[];
  transactions?: {
    lastTransferAmount?: number;
    lastBillAmount?: number;
    transactions?: any[];
    transactionId?: number;
  };
}

export class TestContext {
  private data: TestContextData = {
    accounts: [],
    transactions: {},
  };

  setUser(user: TestContextData['user']): void {
    this.data.user = user;
  }

  getUser() {
    return this.data.user;
  }

  addAccount(accountId: string, type: AccountType = 'SAVINGS'): void {
    if (!this.data.accounts) this.data.accounts = [];
    this.data.accounts.push({ id: accountId, type });
  }

  getPrimaryAccount(): string | undefined {
    return this.data.accounts?.[0]?.id;
  }

  getSecondaryAccount(): string | undefined {
    return this.data.accounts?.[1]?.id;
  }

  setLastTransferAmount(amount: number): void {
    if (!this.data.transactions) this.data.transactions = {};
    this.data.transactions.lastTransferAmount = amount;
  }

  getLastTransferAmount(): number | undefined {
    return this.data.transactions?.lastTransferAmount;
  }

  setLastBillAmount(amount: number): void {
    if (!this.data.transactions) this.data.transactions = {};
    this.data.transactions.lastBillAmount = amount;
  }

  getLastBillAmount(): number | undefined {
    return this.data.transactions?.lastBillAmount;
  }

  setTransactions(transactions: any[]): void {
    if (!this.data.transactions) this.data.transactions = {};
    this.data.transactions.transactions = transactions;
  }

  getTransactions(): any[] | undefined {
    return this.data.transactions?.transactions;
  }

  setTransactionId(transactionId: number): void {
    if (!this.data.transactions) this.data.transactions = {};
    this.data.transactions.transactionId = transactionId;
  }

  getTransactionId(): number | undefined {
    return this.data.transactions?.transactionId;
  }

  getAllData(): TestContextData {
    return this.data;
  }

  clear(): void {
    this.data = { accounts: [], transactions: {} };
  }

  get accountId(): string | undefined {
    return this.getPrimaryAccount();
  }

  get billAmount(): number | undefined {
    return this.getLastBillAmount();
  }

  get transactions(): any[] | undefined {
    return this.getTransactions();
  }

  set transactions(value: any[]) {
    this.setTransactions(value);
  }
}
