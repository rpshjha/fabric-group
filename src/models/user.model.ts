export type AccountType = 'SAVINGS' | 'CHECKING';

export type Account = {
  id: string;
  type: AccountType;
};
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

export type TestUser = Pick<
  UserRegistrationData,
  'username' | 'password' | 'firstName' | 'lastName'
>;

export interface TransferData {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
}

export interface BillPaymentData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  amount: number;
  toAccount: string;
  fromAccount: string;
}

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
