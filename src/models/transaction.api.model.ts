export interface Transaction {
  id: number;
  date: number;
  amount: number;
  type: string;
  description: string;
  accountId: number;
}

export type TransactionList = Transaction[];
