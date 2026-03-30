export interface BillPayRequest {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phoneNumber: string;
  accountNumber: string;
  amount: number;
}
