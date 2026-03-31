import { APIService } from './core/api-service';
import type { TransactionList, Transaction } from './types/transaction.types';

export class TransactionAPI extends APIService {
  /**
   * Retrieves all transactions for a specific account
   * @param accountId - The account identifier to fetch transactions for
   * @returns List of transactions for the account
   * @throws Error if API call fails or returns non-200 status
   */
  async getTransactions(accountId: string): Promise<TransactionList> {
    const res = await this.client.get<TransactionList>(`/transactions/${accountId}`);

    if (res.status !== 200) {
      throw new Error(
        `Failed to fetch transactions for account ${accountId}. Status: ${res.status}`
      );
    }

    if (!Array.isArray(res.data)) {
      throw new Error('Invalid transaction data structure received from API');
    }

    return res.data;
  }

  /**
   * Searches for transactions matching a specific amount using the Find Transactions API
   * @param accountId - The account to search within
   * @param amount - The transaction amount to search for
   * @returns List of transactions matching the amount from the search API
   * @throws Error if unable to search transactions
   */
  async findTransactionsByAmount(accountId: string, amount: number): Promise<TransactionList> {
    const searchEndpoint = `/parabank/services/bank/accounts/${accountId}/transactions/search`;

    const res = await this.client.get<TransactionList>(searchEndpoint, {
      queryParams: { amount: amount.toString() },
    });

    if (res.status !== 200) {
      throw new Error(
        `Failed to search transactions for account ${accountId} with amount ${amount}. Status: ${res.status}`
      );
    }

    if (!Array.isArray(res.data)) {
      throw new Error('Invalid transaction search data structure received from API');
    }

    return res.data;
  }

  /**
   * Retrieves a specific transaction by its ID
   * @param transactionId - The transaction identifier to fetch
   * @returns The transaction details
   * @throws Error if API call fails or returns non-200 status
   */
  async getTransactionById(transactionId: number): Promise<Transaction> {
    const res = await this.client.get<Transaction>(
      `/parabank/services_proxy/bank/transactions/${transactionId}`
    );

    if (res.status !== 200) {
      throw new Error(`Failed to fetch transaction ${transactionId}. Status: ${res.status}`);
    }

    if (!res.data || typeof res.data !== 'object') {
      throw new Error('Invalid transaction data structure received from API');
    }

    return res.data;
  }
}
