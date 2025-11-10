export interface Transaction {
  transactionId: string;
  cardNumber: string;
  accountId: number;
  typeCode: string;
  categoryCode: number;
  source: string;
  description: string;
  amount: number;
  merchantId: number;
  merchantName: string;
  merchantCity: string;
  merchantZip: string;
  originalTimestamp: string;
  processedTimestamp: string;
}

export interface CreateTransactionRequest {
  cardNumber: string;
  typeCode: string;
  categoryCode: number;
  source: string;
  description: string;
  amount: number;
  merchantId: number;
  merchantName: string;
  merchantCity: string;
  merchantZip: string;
  originalTimestamp: string;
  confirmation: string;
}

export interface TransactionListItem {
  transactionId: string;
  transactionDate: string;
  description: string;
  amount: number;
}

export interface PaginatedTransactionResponse {
  success: boolean;
  data: TransactionListItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction;
  message?: string;
}

export interface TransactionListResponse {
  success: boolean;
  data: Transaction[];
  count?: number;
}

export interface ApiError {
  success: boolean;
  error: string;
}
