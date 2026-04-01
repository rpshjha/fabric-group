import { generateBillAmount, generatePayeeData, BillPaymentData } from './test-data-generator';

export class BillPaymentBuilder {
  private payeeData = generatePayeeData();
  private amount: number;
  private accountId: number;

  constructor(accountId: number = 1) {
    this.accountId = accountId;
    this.amount = generateBillAmount();
  }

  withTypicalAmount(): this {
    this.amount = generateBillAmount(50, 200);
    return this;
  }

  build(): BillPaymentData {
    return {
      payee: this.payeeData.name,
      address: this.payeeData.address,
      city: this.payeeData.city,
      state: this.payeeData.state,
      zipCode: this.payeeData.zipCode,
      phone: this.payeeData.phone,
      amount: this.amount,
      accountId: this.accountId,
      accountNumber: this.payeeData.accountNumber,
    };
  }
}
