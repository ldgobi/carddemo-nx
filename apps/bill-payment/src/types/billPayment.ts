export interface AccountBalance {
  accountId: string;
  currentBalance: number;
}

export interface BillPaymentRequest {
  accountId: string;
  confirmPayment: boolean;
}

export interface BillPaymentResponse {
  transactionId: string;
  message: string;
  accountId: string;
  paymentAmount: number;
  newBalance: number;
}

export const ACCOUNT_ID_MAX_LENGTH = 11;
export const TRANSACTION_ID_MAX_LENGTH = 16;
export const DECIMAL_PLACES = 2;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: DECIMAL_PLACES,
    maximumFractionDigits: DECIMAL_PLACES,
  }).format(amount);
}

export function formatAccountId(accountId: string): string {
  const cleanAccountId = accountId.replace(/\D/g, '');
  if (cleanAccountId.length <= 3) {
    return cleanAccountId;
  }
  if (cleanAccountId.length <= 6) {
    return `${cleanAccountId.substring(0, 3)}-${cleanAccountId.substring(3)}`;
  }
  if (cleanAccountId.length <= 9) {
    return `${cleanAccountId.substring(0, 3)}-${cleanAccountId.substring(3, 6)}-${cleanAccountId.substring(6)}`;
  }
  return `${cleanAccountId.substring(0, 3)}-${cleanAccountId.substring(3, 6)}-${cleanAccountId.substring(6, 9)}-${cleanAccountId.substring(9)}`;
}

export function canProcessPayment(balance: number): boolean {
  return balance > 0;
}
