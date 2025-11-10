export interface Account {
  accountId: number;
  customerId: number;
  activeStatus: string;
  currentBalance: number;
  creditLimit: number;
  cashCreditLimit: number;
  openDate: string;
  expirationDate: string;
  currentCycleCredit: number;
  currentCycleDebit: number;
}

export interface AccountResponse {
  success: boolean;
  data: Account;
}

export interface AccountListResponse {
  success: boolean;
  data: Account[];
  count: number;
}

export interface ApiError {
  success: boolean;
  error: string;
}
