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
  transactionUiId?: string;
  transactionType?: string;
  transactionUiAmount?: string;
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
  billPayee?: string;
  lastTransaction?: BillPayTransaction;
}

export interface TestContextData {
  user?: UserProfile;
  accounts?: Account[];
  sessionId?: string;
  fundTransfer?: FundTransferState;
  billPay?: BillPayState;
}

export class TestContext {
  private data: TestContextData = {
    accounts: [],
    fundTransfer: {},
    billPay: {},
  };

  private ensureFundTransfer(): FundTransferState {
    if (!this.data.fundTransfer) {
      this.data.fundTransfer = {};
    }
    return this.data.fundTransfer;
  }

  private ensureBillPay(): BillPayState {
    if (!this.data.billPay) {
      this.data.billPay = {};
    }
    return this.data.billPay;
  }

  /** Set the current test user profile. */
  setUser(user: UserProfile): void {
    this.data.user = user;
  }

  /** Get the current test user profile. */
  getUser(): UserProfile | undefined {
    return this.data.user;
  }

  /** Set the session ID (JSESSIONID). */
  setSessionId(jsessionId: string): void {
    this.data.sessionId = jsessionId;
  }

  /** Get the stored session ID (JSESSIONID). */
  getSessionId(): string | undefined {
    return this.data.sessionId;
  }

  /** Add an account to the test context. */
  addAccount(accountId: string, type: AccountType = 'SAVINGS'): void {
    if (!this.data.accounts) this.data.accounts = [];
    this.data.accounts.push({ id: accountId, type });
  }

  /** Get the primary (first) account. */
  getPrimaryAccount(): string | undefined {
    return this.data.accounts?.[0]?.id;
  }

  /** Get the secondary (second) account. */
  getSecondaryAccount(): string | undefined {
    return this.data.accounts?.[1]?.id;
  }

  /** Set the last transfer amount for fund transfer operations. */
  setLastTransferAmount(amount: number): void {
    this.ensureFundTransfer().lastTransferAmount = amount;
  }

  /** Get the last transfer amount. */
  getLastTransferAmount(): number | undefined {
    return this.data.fundTransfer?.lastTransferAmount;
  }

  /** Set the bill payee name. */
  setBillPayee(payee: string): void {
    this.ensureBillPay().billPayee = payee;
  }

  /** Get the bill payee name. */
  getBillPayee(): string | undefined {
    return this.data.billPay?.billPayee;
  }

  /** Store bill payment transaction details for validation. */
  setLastBillPayTransaction(transaction: BillPayTransaction): void {
    this.ensureBillPay().lastTransaction = transaction;
  }

  /** Retrieve stored bill payment transaction details. */
  getLastBillPayTransaction(): BillPayTransaction | undefined {
    return this.data.billPay?.lastTransaction;
  }

  /** Get all stored context data. */
  getAllData(): TestContextData {
    return this.data;
  }

  /** Clear all stored context data. */
  clear(): void {
    this.data = { accounts: [], sessionId: undefined, fundTransfer: {}, billPay: {} };
  }
}
