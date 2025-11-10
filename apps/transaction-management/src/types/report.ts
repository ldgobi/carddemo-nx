import { Transaction } from './transaction';

export type ReportType = 'MONTHLY' | 'YEARLY' | 'CUSTOM';

export interface GenerateReportRequest {
  reportType: ReportType;
  startDate?: string;
  endDate?: string;
  confirmation: string;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  reportType: ReportType;
  transactionCount: number;
  startDate: string;
  endDate: string;
  data: Transaction[];
}

export interface ApiError {
  success: boolean;
  error: string;
}
