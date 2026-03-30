export const API_ENDPOINTS = {
  LOGIN: '/parabank/services/bank/login',
  REGISTER: '/parabank/register.htm',
  ACCOUNTS: '/parabank/services/bank/accounts',
  ACCOUNTS_DETAIL: (accountId: string): string => `/parabank/services/bank/accounts/${accountId}`,
  TRANSFER_FUNDS: '/parabank/services/bank/transfer',
  TRANSACTIONS: '/parabank/services/bank/accounts/{accountId}/transactions',
  FIND_TRANSACTIONS: '/parabank/services/bank/accounts/{accountId}/transactions/search',
  BILL_PAY: '/parabank/services/bank/billpay',
  OPEN_ACCOUNT: '/parabank/services/bank/openAccount',
} as const;

export const UI_ROUTES = {
  HOME: '/',
  REGISTER: '/parabank/register.htm',
  LOGIN: '/parabank/',
  ACCOUNTS_OVERVIEW: '/parabank/overview.htm',
  OPEN_ACCOUNT: '/parabank/openaccount.htm',
  TRANSFER_FUNDS: '/parabank/transfer.htm',
  BILL_PAY: '/parabank/billpay.htm',
  FIND_TRANSACTIONS: '/parabank/findtransactions.htm',
} as const;
