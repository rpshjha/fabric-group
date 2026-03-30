import { APIService } from './core/api-service';

export class TransferAPI extends APIService {
  async transferFunds(fromAccountId: string, toAccountId: string, amount: number): Promise<void> {
    const res = await this.client.post<void>(`/transfer`, {
      queryParams: {
        fromAccountId,
        toAccountId,
        amount,
      },
    });

    if (res.status !== 200) {
      throw new Error('Transfer failed');
    }
  }
}
