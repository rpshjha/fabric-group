export interface TransferFundsTransaction {
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
