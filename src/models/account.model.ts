export type AccountType = 'SAVINGS' | 'CHECKING';

export type Account = {
  id: string;
  type: AccountType;
};
