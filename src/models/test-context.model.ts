import { Account } from './account.model';
import { BillPayTransaction, TransferFundsTransaction } from './transaction.model';
import { UserRegistrationData } from './user.model';

export interface FundTransferState {
  lastTransaction?: TransferFundsTransaction;
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
