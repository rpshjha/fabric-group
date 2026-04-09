import { Transaction } from '@/models';

export class TransactionValidator {
  static validate(data: unknown): Transaction {
    const tx = data as Record<string, unknown>;

    if (
      typeof tx.id !== 'number' ||
      typeof tx.amount !== 'number' ||
      typeof tx.date !== 'number' ||
      typeof tx.type !== 'string' ||
      typeof tx.description !== 'string' ||
      typeof tx.accountId !== 'number'
    ) {
      throw new Error('Invalid transaction structure');
    }

    return data as Transaction;
  }

  static validateList(data: unknown): Transaction[] {
    if (!Array.isArray(data)) {
      throw new Error('Expected array of transactions');
    }

    return data.map((item) => this.validate(item));
  }
}
