export const TEST_DATA = {
  REGISTRATION: {
    FIRST_NAME: 'Test',
    LAST_NAME: 'User',
  },
  ACCOUNT_OPENING: {
    ACCOUNT_TYPE: 'SAVINGS',
  },
  TRANSFER: {
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 99.99,
  },
  BILL_PAY: {
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 99.99,
  },
} as const;
