import {
  UserRegistrationData,
  generateUserRegistrationData,
  generateTransferAmount,
  generateBillAmount,
  generatePayeeData,
} from './test-data-generator';

export class UserBuilder {
  private data: UserRegistrationData;

  constructor() {
    this.data = generateUserRegistrationData();
  }

  withFirstName(firstName: string): this {
    this.data.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.data.lastName = lastName;
    return this;
  }

  withFullName(firstName: string, lastName: string): this {
    this.data.firstName = firstName;
    this.data.lastName = lastName;
    return this;
  }

  withAddress(address: string): this {
    this.data.address = address;
    return this;
  }

  withCity(city: string): this {
    this.data.city = city;
    return this;
  }

  withState(state: string): this {
    this.data.state = state;
    return this;
  }

  withCityAndState(city: string, state: string): this {
    this.data.city = city;
    this.data.state = state;
    return this;
  }

  withZipCode(zipCode: string): this {
    this.data.zipCode = zipCode;
    return this;
  }

  withPhone(phone: string): this {
    this.data.phone = phone;
    return this;
  }

  withSSN(ssn: string): this {
    this.data.ssn = ssn;
    return this;
  }

  withUsername(username: string): this {
    this.data.username = username;
    return this;
  }

  withPassword(password: string): this {
    this.data.password = password;
    return this;
  }

  withOverrides(overrides: Partial<UserRegistrationData>): this {
    this.data = { ...this.data, ...overrides };
    return this;
  }

  build(): UserRegistrationData {
    return { ...this.data };
  }

  toJSON(): UserRegistrationData {
    return this.build();
  }
}

export class TransferBuilder {
  private fromAccountId: number;
  private toAccountId: number;
  private amount: number;
  private description: string = '';

  constructor(fromAccountId: number = 1, toAccountId: number = 2) {
    this.fromAccountId = fromAccountId;
    this.toAccountId = toAccountId;
    this.amount = generateTransferAmount();
  }

  fromAccount(accountId: number): this {
    this.fromAccountId = accountId;
    return this;
  }

  toAccount(accountId: number): this {
    this.toAccountId = accountId;
    return this;
  }

  withAmount(amount: number): this {
    this.amount = amount;
    return this;
  }

  withDescription(description: string): this {
    this.description = description;
    return this;
  }

  withTypicalAmount(): this {
    this.amount = generateTransferAmount(50, 300);
    return this;
  }

  withLargeAmount(): this {
    this.amount = generateTransferAmount(1000, 5000);
    return this;
  }

  withSmallAmount(): this {
    this.amount = generateTransferAmount(1, 50);
    return this;
  }

  build() {
    return {
      fromAccountId: this.fromAccountId,
      toAccountId: this.toAccountId,
      amount: this.amount,
      description: this.description,
    };
  }
}

export class BillPaymentBuilder {
  private payeeData = generatePayeeData();
  private amount: number;
  private accountId: number;

  constructor(accountId: number = 1) {
    this.accountId = accountId;
    this.amount = generateBillAmount();
  }

  fromAccount(accountId: number): this {
    this.accountId = accountId;
    return this;
  }

  withAmount(amount: number): this {
    this.amount = amount;
    return this;
  }

  withPayee(payeeName: string): this {
    this.payeeData.name = payeeName;
    return this;
  }

  withTypicalAmount(): this {
    this.amount = generateBillAmount(50, 200);
    return this;
  }

  withLargeAmount(): this {
    this.amount = generateBillAmount(200, 500);
    return this;
  }

  withRandomPayee(): this {
    this.payeeData = generatePayeeData();
    return this;
  }

  build() {
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
