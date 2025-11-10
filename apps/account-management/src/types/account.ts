// Account and Card Data Management Types

export interface AccountViewResponse {
  accountId: number;
  activeStatus: string;
  currentBalance: number;
  creditLimit: number;
  cashCreditLimit: number;
  openDate: string;
  expirationDate: string;
  reissueDate: string;
  currentCycleCredit: number;
  currentCycleDebit: number;
  groupId: string;
  customerId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  ssn: string;
  ficoScore: number;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode: string;
  zipCode: string;
  countryCode: string;
  phoneNumber1: string;
  phoneNumber2?: string;
  governmentIssuedId?: string;
  eftAccountId?: string;
  primaryCardHolderIndicator: string;
}

export interface UpdateAccountRequest {
  // Account fields
  activeStatus?: string;
  currentBalance?: number;
  creditLimit?: number;
  cashCreditLimit?: number;
  openDate?: string;
  expirationDate?: string;
  reissueDate?: string;
  currentCycleCredit?: number;
  currentCycleDebit?: number;
  groupId?: string;
  
  // Customer fields
  firstName?: string;
  middleName?: string;
  lastName?: string;
  ssn?: string;
  dateOfBirth?: string;
  ficoScore?: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateCode?: string;
  zipCode?: string;
  countryCode?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  governmentIssuedId?: string;
  eftAccountId?: string;
  primaryCardHolderIndicator?: string;
}

// Validation functions
export function validateAccountId(accountId: string): boolean {
  const cleaned = accountId.replace(/\D/g, '');
  return cleaned.length === 11 && cleaned !== '00000000000';
}

export function validateActiveStatus(status: string): boolean {
  return status === 'Y' || status === 'N';
}

export function validateMonetaryAmount(amount: number): boolean {
  return typeof amount === 'number' && amount >= 0 && !isNaN(amount);
}

export function validateDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function validateSSN(ssn: string): boolean {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length !== 9) return false;
  
  // Check for invalid SSN patterns
  const firstThree = cleaned.substring(0, 3);
  const middleTwo = cleaned.substring(3, 5);
  const lastFour = cleaned.substring(5);
  
  if (firstThree === '000' || firstThree === '666' || parseInt(firstThree) >= 900) return false;
  if (middleTwo === '00') return false;
  if (lastFour === '0000') return false;
  
  return true;
}

export function validateFicoScore(score: number): boolean {
  return typeof score === 'number' && score >= 300 && score <= 850;
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return false;
  
  const areaCode = cleaned.substring(0, 3);
  const prefix = cleaned.substring(3, 6);
  
  if (areaCode === '000' || areaCode === '911') return false;
  if (prefix === '000') return false;
  
  return true;
}

export function validateStateCode(state: string): boolean {
  return /^[A-Z]{2}$/.test(state);
}

export function validateZipCode(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

export function validateCountryCode(country: string): boolean {
  return /^[A-Z]{2,3}$/.test(country);
}

export function validateName(name: string): boolean {
  return /^[A-Za-z\s]+$/.test(name) && name.trim().length > 0;
}

export function validatePrimaryCardHolderIndicator(indicator: string): boolean {
  return indicator === 'Y' || indicator === 'N';
}

// Formatting functions
export function formatSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length !== 9) return ssn;
  return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 5)}-${cleaned.substring(5)}`;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  return `(${cleaned.substring(0, 3)})${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatAccountId(accountId: number): string {
  return accountId.toString().padStart(11, '0');
}

// Helper functions
export function getStatusBadgeColor(status: string): string {
  return status === 'Y' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  return status === 'Y' ? 'Active' : 'Inactive';
}

export function getFicoScoreColor(score: number): string {
  if (score >= 800) return 'text-green-600';
  if (score >= 740) return 'text-blue-600';
  if (score >= 670) return 'text-yellow-600';
  if (score >= 580) return 'text-orange-600';
  return 'text-red-600';
}

export function getFicoScoreLabel(score: number): string {
  if (score >= 800) return 'Exceptional';
  if (score >= 740) return 'Very Good';
  if (score >= 670) return 'Good';
  if (score >= 580) return 'Fair';
  return 'Poor';
}

export function calculateAvailableCredit(creditLimit: number, currentBalance: number): number {
  return Math.max(0, creditLimit - currentBalance);
}

export function calculateCreditUtilization(creditLimit: number, currentBalance: number): number {
  if (creditLimit === 0) return 0;
  return (currentBalance / creditLimit) * 100;
}

export function getCreditUtilizationColor(utilization: number): string {
  if (utilization <= 30) return 'text-green-600';
  if (utilization <= 50) return 'text-yellow-600';
  if (utilization <= 75) return 'text-orange-600';
  return 'text-red-600';
}

export function getFullName(firstName: string, middleName: string | undefined, lastName: string): string {
  if (middleName) {
    return `${firstName} ${middleName} ${lastName}`;
  }
  return `${firstName} ${lastName}`;
}

export function getFullAddress(
  addressLine1: string,
  addressLine2: string | undefined,
  city: string,
  stateCode: string,
  zipCode: string
): string {
  const parts = [addressLine1];
  if (addressLine2) parts.push(addressLine2);
  parts.push(`${city}, ${stateCode} ${zipCode}`);
  return parts.join(', ');
}
