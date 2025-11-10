/**
 * Utility functions for the Card Account Transaction Management System
 */

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string to MM/DD/YYYY
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format a date string to full date and time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Mask a card number showing only last 4 digits
 */
export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length !== 16) return cardNumber;
  return `**** **** **** ${cardNumber.slice(-4)}`;
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(cardNumber: string): string {
  return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate date range
 */
export function isValidDateRange(startDate: string, endDate: string): boolean {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get first day of current month
 */
export function getFirstDayOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
}

/**
 * Get last day of current month
 */
export function getLastDayOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
}

/**
 * Get first day of current year
 */
export function getFirstDayOfYear(): string {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
}

/**
 * Get last day of current year
 */
export function getLastDayOfYear(): string {
  const now = new Date();
  return new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generate random ID
 */
export function generateId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get error message from error object
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

/**
 * Validate credit card number using Luhn algorithm
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length !== 16) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Format account ID with dashes
 */
export function formatAccountId(accountId: number | string): string {
  const id = accountId.toString().padStart(11, '0');
  return `${id.slice(0, 3)}-${id.slice(3, 7)}-${id.slice(7)}`;
}

/**
 * Parse amount string to number
 */
export function parseAmount(amountString: string): number {
  const parsed = parseFloat(amountString.replace(/[^0-9.-]/g, ''));
  return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'Y':
    case 'ACTIVE':
      return 'text-green-600';
    case 'N':
    case 'INACTIVE':
      return 'text-red-600';
    case 'PENDING':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get status badge color class
 */
export function getStatusBadgeColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'Y':
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'N':
    case 'INACTIVE':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Sort array by property
 */
export function sortBy<T>(array: T[], property: keyof T, ascending: boolean = true): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Group array by property
 */
export function groupBy<T>(array: T[], property: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = String(item[property]);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}
