import { APIService } from './core/api-service';
import type { Transaction } from './types/transaction.types';

export class TransactionAPI extends APIService {
  private readonly endpoints = {
    byId: (id: number) => `/parabank/services_proxy/bank/transactions/${id}`,
  };

  async getById(
    transactionId: number,
    options: { headers?: Record<string, string> } = {}
  ): Promise<Transaction> {
    const res = await this.client.get<Transaction>(this.endpoints.byId(transactionId), {
      headers: options.headers,
    });

    if (res.status !== 200) {
      throw new Error(`Failed to fetch transaction ${transactionId}. Status: ${res.status}`);
    }

    if (!res.data || typeof res.data !== 'object') {
      throw new Error('Invalid transaction data structure received from API');
    }

    return res.data as Transaction;
  }
}
