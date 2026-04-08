export type AccountType = 'SAVINGS' | 'CHECKING';

export type Account = {
  id: string;
  type: AccountType;
};

/**
 * User profile information for test context.
 */
export interface UserProfile {
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
}

/**
 * Bill payment transaction details combining UI and API data.
 */
export interface BillPayTransaction {
  fromAccount?: string;
  billAmount?: number;
  transactionId?: number;
  transactionDescription?: string;
  transactionDate?: string;
}

/**
 * Fund transfer operation state.
 */
export interface FundTransferState {
  lastTransferAmount?: number;
}

/**
 * Bill payment operation state.
 */
export interface BillPayState {
  lastTransaction?: BillPayTransaction;
}

export interface TestContextData {
  user?: UserProfile;
  accounts: Account[];
  fundTransfer: FundTransferState;
  billPay: BillPayState;
}

export class TestContext {
  private data: TestContextData = {
    accounts: [],
    fundTransfer: {},
    billPay: {},
  };

  setUser(user: UserProfile): void {
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
