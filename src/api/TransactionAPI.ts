import { APIService } from './core/api-service';
import { TransactionList } from './types/transaction.types';

export class TransactionAPI extends APIService {
  async getTransactions(accountId: string): Promise<TransactionList> {
    const res = await this.client.get<TransactionList>(`/transactions/${accountId}`);

    if (res.status !== 200) {
      throw new Error(`Failed to fetch transactions. Status: ${res.status}`);
    }

    return res.data;
  }

  async findTransactionsByAmount(accountId: string, amount: number): Promise<TransactionList> {
    const transactions = await this.getTransactions(accountId);

    return transactions.filter((t) => Math.abs(t.amount - amount) < 0.01);
  }
}
