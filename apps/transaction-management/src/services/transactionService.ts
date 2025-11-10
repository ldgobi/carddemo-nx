import {
  Transaction,
  CreateTransactionRequest,
  PaginatedTransactionResponse,
  TransactionResponse,
  TransactionListResponse,
  ApiError,
} from '@/types/transaction';

const API_BASE_URL = '/api';

class TransactionService {
  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        success: false,
        error: 'An unexpected error occurred',
      }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      const data = await this.handleResponse<TransactionResponse>(response);
      return data.data;
    } catch (error) {
      console.error(`Error fetching transaction ${transactionId}:`, error);
      throw error;
    }
  }

  async getTransactions(page: number = 0, size: number = 10): Promise<PaginatedTransactionResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/transactions?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      return this.handleResponse<PaginatedTransactionResponse>(response);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const result = await this.handleResponse<TransactionResponse>(response);
      return result.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      });

      const response = await fetch(`${API_BASE_URL}/transactions/date-range?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      const data = await this.handleResponse<TransactionListResponse>(response);
      return data.data;
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
  }

  async getTransactionsByCardNumber(cardNumber: string): Promise<Transaction[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/card/${cardNumber}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      const data = await this.handleResponse<TransactionListResponse>(response);
      return data.data;
    } catch (error) {
      console.error(`Error fetching transactions for card ${cardNumber}:`, error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();
export default TransactionService;
