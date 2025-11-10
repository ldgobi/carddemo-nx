/**
 * Application constants for Card Account Transaction Management System
 */

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 1;

// Field Lengths
export const TRANSACTION_ID_LENGTH = 16;
export const CARD_NUMBER_LENGTH = 16;
export const ACCOUNT_ID_LENGTH = 11;
export const CUSTOMER_ID_LENGTH = 10;
export const TYPE_CODE_LENGTH = 2;
export const CATEGORY_CODE_LENGTH = 4;
export const SOURCE_MAX_LENGTH = 10;
export const DESCRIPTION_MAX_LENGTH = 100;
export const MERCHANT_NAME_MAX_LENGTH = 50;
export const MERCHANT_CITY_MAX_LENGTH = 50;
export const MERCHANT_ZIP_MAX_LENGTH = 10;

// Numeric Constraints
export const MIN_CATEGORY_CODE = 1000;
export const MAX_CATEGORY_CODE = 9999;
export const AMOUNT_DECIMAL_PLACES = 2;
export const MIN_AMOUNT = -999999999.99;
export const MAX_AMOUNT = 999999999.99;

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'MM/DD/YYYY';
export const DISPLAY_DATETIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';

// Transaction Types
export const TRANSACTION_TYPES = [
  { value: 'PU', label: 'Purchase' },
  { value: 'RF', label: 'Refund' },
  { value: 'WD', label: 'Withdrawal' },
  { value: 'DP', label: 'Deposit' },
  { value: 'FE', label: 'Fee' },
  { value: 'IN', label: 'Interest' },
  { value: 'TR', label: 'Transfer' },
  { value: 'PM', label: 'Payment' },
] as const;

// Transaction Sources
export const TRANSACTION_SOURCES = [
  { value: 'ONLINE', label: 'Online' },
  { value: 'POS', label: 'Point of Sale' },
  { value: 'ATM', label: 'ATM' },
  { value: 'MOBILE', label: 'Mobile' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'MAIL', label: 'Mail' },
  { value: 'BRANCH', label: 'Branch' },
  { value: 'AUTO', label: 'Automatic' },
] as const;

// Account Status
export const ACCOUNT_STATUS = {
  ACTIVE: 'Y',
  INACTIVE: 'N',
} as const;

export const ACCOUNT_STATUS_OPTIONS = [
  { value: 'Y', label: 'Active' },
  { value: 'N', label: 'Inactive' },
] as const;

// Report Types
export const REPORT_TYPES = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  CUSTOM: 'CUSTOM',
} as const;

export const REPORT_TYPE_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly Report' },
  { value: 'YEARLY', label: 'Yearly Report' },
  { value: 'CUSTOM', label: 'Custom Date Range' },
] as const;

// Confirmation Values
export const CONFIRMATION_YES = 'Y';
export const CONFIRMATION_NO = 'N';

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
  INVALID_LENGTH: 'Invalid length',
  INVALID_RANGE: 'Value out of range',
  INVALID_DATE: 'Invalid date',
  INVALID_DATE_RANGE: 'Start date must be before or equal to end date',
  INVALID_CARD_NUMBER: 'Card number must be exactly 16 digits',
  INVALID_ACCOUNT_ID: 'Account ID must be exactly 11 digits',
  INVALID_TYPE_CODE: 'Type code must be exactly 2 characters',
  INVALID_CATEGORY_CODE: 'Category code must be a 4-digit number',
  INVALID_AMOUNT: 'Invalid amount',
  INVALID_CONFIRMATION: 'Please confirm by entering Y',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  ACCOUNT_NOT_FOUND: 'Account not found',
  CARD_NOT_FOUND: 'Card number not found',
  OVERLIMIT_TRANSACTION: 'Transaction would exceed credit limit',
  EXPIRED_ACCOUNT: 'Transaction received after account expiration',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully',
  REPORT_GENERATED: 'Report generated successfully',
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  LOADING_TRANSACTIONS: 'Loading transactions...',
  LOADING_TRANSACTION: 'Loading transaction details...',
  LOADING_ACCOUNTS: 'Loading accounts...',
  LOADING_ACCOUNT: 'Loading account details...',
  CREATING_TRANSACTION: 'Creating transaction...',
  GENERATING_REPORT: 'Generating report...',
} as const;

// Empty State Messages
export const EMPTY_STATE_MESSAGES = {
  NO_TRANSACTIONS: 'No transactions found',
  NO_ACCOUNTS: 'No accounts found',
  NO_REPORT_DATA: 'No data available for the selected period',
} as const;

// Navigation
export const ROUTES = {
  HOME: '/',
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAIL: (id: string) => `/transactions/${id}`,
  ADD_TRANSACTION: '/transactions/add',
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: (id: number) => `/accounts/${id}`,
  REPORTS: '/reports',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Debounce Delays
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 200,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Colors
export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
} as const;

// Table Settings
export const TABLE_SETTINGS = {
  DEFAULT_SORT_ORDER: 'desc',
  ROWS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  CARD_NUMBER: /^\d{16}$/,
  ACCOUNT_ID: /^\d{11}$/,
  CUSTOMER_ID: /^\d{10}$/,
  TYPE_CODE: /^[A-Z]{2}$/,
  CATEGORY_CODE: /^\d{4}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\d{10}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_TRANSACTION_EDIT: false,
  ENABLE_TRANSACTION_DELETE: false,
  ENABLE_ACCOUNT_EDIT: false,
  ENABLE_EXPORT: true,
  ENABLE_PRINT: true,
  ENABLE_DARK_MODE: false,
} as const;

// Cache Settings
export const CACHE_SETTINGS = {
  TRANSACTION_LIST_TTL: 5 * 60 * 1000, // 5 minutes
  ACCOUNT_LIST_TTL: 10 * 60 * 1000, // 10 minutes
  TRANSACTION_DETAIL_TTL: 15 * 60 * 1000, // 15 minutes
} as const;

// Retry Settings
export const RETRY_SETTINGS = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  BACKOFF_MULTIPLIER: 2,
} as const;

// File Upload Settings
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
} as const;

// Notification Settings
export const NOTIFICATION_SETTINGS = {
  DURATION: 5000,
  POSITION: 'top-right',
} as const;

// Application Metadata
export const APP_METADATA = {
  NAME: 'Card Account Transaction Management',
  VERSION: '1.0.0',
  DESCRIPTION: 'Comprehensive system for managing card transactions, accounts, and generating detailed reports',
  AUTHOR: 'Wynxx System Modernization Team',
} as const;
