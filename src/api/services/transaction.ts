import { BaseAPI } from '../core/base-api';
import type { Transaction } from '../types/transaction.types';
import { TransactionValidator } from '../validators/transaction-validator';

export class TransactionAPI extends BaseAPI {
  private endpoints = {
    byId: (id: number) => `/parabank/services_proxy/bank/transactions/${id}`,
    byAmount: (accountId: number, amount: number) =>
      `/parabank/services_proxy/bank/accounts/${accountId}/transactions/amount/${amount}`,
  };

  async getById(id: number): Promise<Transaction> {
    const res = await this.client.get<Transaction>(this.endpoints.byId(id));

    this.assertOk(res.status, `Get transaction failed: ${id}`);
    return TransactionValidator.validate(res.data);
  }

  async searchByAmount(accountId: number, amount: number): Promise<Transaction[]> {
    const res = await this.client.get<Transaction[]>(this.endpoints.byAmount(accountId, amount));

    this.assertOk(res.status, `Search failed: ${accountId}`);
    return TransactionValidator.validateList(res.data);
  }
}
