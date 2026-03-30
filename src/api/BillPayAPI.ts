import { APIService } from './core/api-service';
import { BillPayRequest } from './types/billpay.types';

export class BillPayAPI extends APIService {
  async payBill(request: BillPayRequest): Promise<void> {
    const res = await this.client.post<void>(`/billpay`, {
      queryParams: {
        accountId: request.accountNumber,
        amount: request.amount,
      },
      body: request,
    });

    if (res.status !== 200) {
      throw new Error('Bill payment failed');
    }
  }
}
