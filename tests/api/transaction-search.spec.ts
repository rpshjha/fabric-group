import { test } from '@fixtures/base.fixture';

test.describe('ParaBank API - Transaction Search', () => {
  test('User searches transactions by amount and sees correct results', async ({
    transactionFlow,
  }) => {
    await transactionFlow.givenUserHasMadeABillPayment();

    await transactionFlow.whenUserSearchesTransactionsByThatAmount();

    await transactionFlow.thenUserSeesMatchingTransactions();

    await transactionFlow.andTransactionDetailsAreValid();
  });
});
