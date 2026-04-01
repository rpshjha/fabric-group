import {
  generateUserRegistrationData as _generateUserRegistrationData,
  generateTransferAmount as _generateTransferAmount,
  generateUniqueTestUser,
  generateRandomAmount,
} from './test-data-generator';

export function createTestUser() {
  return _generateUserRegistrationData();
}

export function getRandomTransferAmount(min = 50, max = 300) {
  return _generateTransferAmount(min, max);
}

export { generateUniqueTestUser, generateRandomAmount };

export { BillPaymentBuilder } from './test-data-builder';

export type {
  UserRegistrationData,
  TestUser,
  TransferData,
  BillPaymentData,
} from './test-data-generator';
