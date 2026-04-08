export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
}

export interface TestUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TransferData {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
}

export interface BillPaymentData {
  payee: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  amount: number;
  accountId: number;
  accountNumber: string;
}

export type Account = {
  id: string;
  type: AccountType;
};

export interface BillPayTransaction {
  fromAccount?: string;
  billAmount?: number;
  transactionId?: number;
  transactionDescription?: string;
  transactionDate?: string;
}

export interface FundTransferState {
  lastTransferAmount?: number;
}

export interface BillPayState {
  lastTransaction?: BillPayTransaction;
}

export interface TestContextData {
  user?: UserRegistrationData;
  accounts: Account[];
  fundTransfer: FundTransferState;
  billPay: BillPayState;
}

export type AccountType = 'SAVINGS' | 'CHECKING';
