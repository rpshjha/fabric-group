import { APIService } from './core/api-service';

export interface Account {
  id: string;
  balance: number;
  type: string;
}

export class AccountAPI extends APIService {
  async getAccounts(customerId: string): Promise<Account[]> {
    const res = await this.client.get<Account[]>(`/customers/${customerId}/accounts`);

    if (res.status !== 200) {
      throw new Error(`Failed to fetch accounts: ${res.status}`);
    }

    return res.data;
  }

  async createAccount(
    customerId: string,
    accountType: number,
    fromAccountId: string
  ): Promise<Account> {
    const res = await this.client.post<Account>(`/createAccount`, {
      queryParams: {
        customerId,
        newAccountType: accountType,
        fromAccountId,
      },
    });

    if (res.status !== 200) {
      throw new Error('Account creation failed');
    }

    return res.data;
  }
}
