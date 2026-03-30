export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  description: string;
  accountId: string;
}

export type TransactionList = Transaction[];
