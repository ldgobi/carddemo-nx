'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { accountService } from '@/services/accountService';
import { AccountViewResponse, UpdateAccountRequest } from '@/types/account';
import {
  validateActiveStatus,
  validateMonetaryAmount,
  validateDate,
  validateSSN,
  validateFicoScore,
  validatePhoneNumber,
  validateStateCode,
  validateZipCode,
  validateName,
  validatePrimaryCardHolderIndicator,
} from '@/types/account';
import { Input, Select, Button } from '@/components/ui';

export default function EditAccountPage() {
  const params = useParams();
  const router = useRouter();
  const [originalData, setOriginalData] = useState<AccountViewResponse | null>(null);
  const [formData, setFormData] = useState<UpdateAccountRequest>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (params.accountId) {
      fetchAccount(params.accountId as string);
    }
  }, [params.accountId]);

  const fetchAccount = async (accountId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountService.getAccountView(accountId);
      setOriginalData(data);
      
      // Initialize form with current data
      setFormData({
        activeStatus: data.activeStatus,
        currentBalance: data.currentBalance,
        creditLimit: data.creditLimit,
        cashCreditLimit: data.cashCreditLimit,
        openDate: data.openDate,
        expirationDate: data.expirationDate,
        reissueDate: data.reissueDate,
        currentCycleCredit: data.currentCycleCredit,
        currentCycleDebit: data.currentCycleDebit,
        groupId: data.groupId,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        ssn: data.ssn,
        dateOfBirth: data.dateOfBirth,
        ficoScore: data.ficoScore,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        stateCode: data.stateCode,
        zipCode: data.zipCode,
        countryCode: data.countryCode,
        phoneNumber1: data.phoneNumber1,
        phoneNumber2: data.phoneNumber2,
        governmentIssuedId: data.governmentIssuedId,
        eftAccountId: data.eftAccountId,
        primaryCardHolderIndicator: data.primaryCardHolderIndicator,
      });
    } catch (err) {
      console.error('Failed to load account:', err);
      setError(err instanceof Error ? err.message : 'Failed to load account');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate active status
    if (formData.activeStatus && !validateActiveStatus(formData.activeStatus)) {
      errors.activeStatus = 'Status must be Y or N';
    }

    // Validate monetary amounts
    if (formData.currentBalance !== undefined && !validateMonetaryAmount(formData.currentBalance)) {
      errors.currentBalance = 'Must be a non-negative number';
    }
    if (formData.creditLimit !== undefined && !validateMonetaryAmount(formData.creditLimit)) {
      errors.creditLimit = 'Must be a non-negative number';
    }
    if (formData.cashCreditLimit !== undefined && !validateMonetaryAmount(formData.cashCreditLimit)) {
      errors.cashCreditLimit = 'Must be a non-negative number';
    }
    if (formData.currentCycleCredit !== undefined && !validateMonetaryAmount(formData.currentCycleCredit)) {
      errors.currentCycleCredit = 'Must be a non-negative number';
    }
    if (formData.currentCycleDebit !== undefined && !validateMonetaryAmount(formData.currentCycleDebit)) {
      errors.currentCycleDebit = 'Must be a non-negative number';
    }

    // Validate dates
    if (formData.openDate && !validateDate(formData.openDate)) {
      errors.openDate = 'Invalid date format';
    }
    if (formData.expirationDate && !validateDate(formData.expirationDate)) {
      errors.expirationDate = 'Invalid date format';
    }
    if (formData.reissueDate && !validateDate(formData.reissueDate)) {
      errors.reissueDate = 'Invalid date format';
    }
    if (formData.dateOfBirth && !validateDate(formData.dateOfBirth)) {
      errors.dateOfBirth = 'Invalid date format';
    }

    // Validate SSN
    if (formData.ssn && !validateSSN(formData.ssn)) {
      errors.ssn = 'SSN must be a valid 9-digit number';
    }

    // Validate FICO score
    if (formData.ficoScore !== undefined && !validateFicoScore(formData.ficoScore)) {
      errors.ficoScore = 'FICO score must be between 300 and 850';
    }

    // Validate names
    if (formData.firstName && !validateName(formData.firstName)) {
      errors.firstName = 'Must contain only alphabetic characters';
    }
    if (formData.middleName && !validateName(formData.middleName)) {
      errors.middleName = 'Must contain only alphabetic characters';
    }
    if (formData.lastName && !validateName(formData.lastName)) {
      errors.lastName = 'Must contain only alphabetic characters';
    }

    // Validate phone numbers
    if (formData.phoneNumber1 && !validatePhoneNumber(formData.phoneNumber1)) {
      errors.phoneNumber1 = 'Must be a valid 10-digit phone number';
    }
    if (formData.phoneNumber2 && !validatePhoneNumber(formData.phoneNumber2)) {
      errors.phoneNumber2 = 'Must be a valid 10-digit phone number';
    }

    // Validate state code
    if (formData.stateCode && !validateStateCode(formData.stateCode)) {
      errors.stateCode = 'Must be a 2-letter state code';
    }

    // Validate ZIP code
    if (formData.zipCode && !validateZipCode(formData.zipCode)) {
      errors.zipCode = 'Must be a 5-digit ZIP code';
    }

    // Validate primary card holder indicator
    if (formData.primaryCardHolderIndicator && 
        !validatePrimaryCardHolderIndicator(formData.primaryCardHolderIndicator)) {
      errors.primaryCardHolderIndicator = 'Must be Y or N';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    // Check if any changes were made
    const hasChanges = Object.keys(formData).some(key => {
      const formValue = formData[key as keyof UpdateAccountRequest];
      const originalValue = originalData?.[key as keyof AccountViewResponse];
      return formValue !== originalValue;
    });

    if (!hasChanges) {
      setError('No changes detected');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await accountService.updateAccount(params.accountId as string, formData);
      router.push(`/accounts/${params.accountId}`);
    } catch (err) {
      console.error('Failed to update account:', err);
      setError(err instanceof Error ? err.message : 'Failed to update account');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/accounts/${params.accountId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (error && !originalData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Account</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => router.push('/accounts')}>
                Back to Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Account</h1>
          <p className="mt-1 text-sm text-gray-600">
            Account ID: {accountService.formatAccountId(originalData?.accountId || 0)}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-4">
                <Select
                  label="Active Status"
                  value={formData.activeStatus || ''}
                  onChange={(e) => setFormData({ ...formData, activeStatus: e.target.value })}
                  options={[
                    { value: 'Y', label: 'Active' },
                    { value: 'N', label: 'Inactive' },
                  ]}
                  error={validationErrors.activeStatus}
                />

                <Input
                  label="Current Balance"
                  type="number"
                  step="0.01"
                  value={formData.currentBalance || ''}
                  onChange={(e) => setFormData({ ...formData, currentBalance: parseFloat(e.target.value) })}
                  error={validationErrors.currentBalance}
                />

                <Input
                  label="Credit Limit"
                  type="number"
                  step="0.01"
                  value={formData.creditLimit || ''}
                  onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) })}
                  error={validationErrors.creditLimit}
                />

                <Input
                  label="Cash Credit Limit"
                  type="number"
                  step="0.01"
                  value={formData.cashCreditLimit || ''}
                  onChange={(e) => setFormData({ ...formData, cashCreditLimit: parseFloat(e.target.value) })}
                  error={validationErrors.cashCreditLimit}
                />

                <Input
                  label="Current Cycle Credit"
                  type="number"
                  step="0.01"
                  value={formData.currentCycleCredit || ''}
                  onChange={(e) => setFormData({ ...formData, currentCycleCredit: parseFloat(e.target.value) })}
                  error={validationErrors.currentCycleCredit}
                />

                <Input
                  label="Current Cycle Debit"
                  type="number"
                  step="0.01"
                  value={formData.currentCycleDebit || ''}
                  onChange={(e) => setFormData({ ...formData, currentCycleDebit: parseFloat(e.target.value) })}
                  error={validationErrors.currentCycleDebit}
                />

                <Input
                  label="Account Group ID"
                  value={formData.groupId || ''}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                  maxLength={10}
                />
              </div>
            </div>

            {/* Account Dates */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Dates</h2>
              <div className="space-y-4">
                <Input
                  label="Open Date"
                  type="date"
                  value={formData.openDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                  error={validationErrors.openDate}
                />

                <Input
                  label="Expiration Date"
                  type="date"
                  value={formData.expirationDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  error={validationErrors.expirationDate}
                />

                <Input
                  label="Reissue Date"
                  type="date"
                  value={formData.reissueDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, reissueDate: e.target.value })}
                  error={validationErrors.reissueDate}
                />
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-4">
                <Input
                  label="First Name"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  maxLength={25}
                  error={validationErrors.firstName}
                />

                <Input
                  label="Middle Name"
                  value={formData.middleName || ''}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  maxLength={25}
                  error={validationErrors.middleName}
                />

                <Input
                  label="Last Name"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  maxLength={25}
                  error={validationErrors.lastName}
                />

                <Input
                  label="SSN"
                  value={formData.ssn || ''}
                  onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  error={validationErrors.ssn}
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  error={validationErrors.dateOfBirth}
                />

                <Input
                  label="FICO Score"
                  type="number"
                  value={formData.ficoScore || ''}
                  onChange={(e) => setFormData({ ...formData, ficoScore: parseInt(e.target.value) })}
                  min={300}
                  max={850}
                  error={validationErrors.ficoScore}
                />

                <Select
                  label="Primary Card Holder"
                  value={formData.primaryCardHolderIndicator || ''}
                  onChange={(e) => setFormData({ ...formData, primaryCardHolderIndicator: e.target.value })}
                  options={[
                    { value: 'Y', label: 'Yes' },
                    { value: 'N', label: 'No' },
                  ]}
                  error={validationErrors.primaryCardHolderIndicator}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <Input
                  label="Address Line 1"
                  value={formData.addressLine1 || ''}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  maxLength={50}
                />

                <Input
                  label="Address Line 2"
                  value={formData.addressLine2 || ''}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  maxLength={50}
                />

                <Input
                  label="City"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  maxLength={50}
                />

                <Input
                  label="State Code"
                  value={formData.stateCode || ''}
                  onChange={(e) => setFormData({ ...formData, stateCode: e.target.value.toUpperCase() })}
                  maxLength={2}
                  error={validationErrors.stateCode}
                />

                <Input
                  label="ZIP Code"
                  value={formData.zipCode || ''}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  maxLength={5}
                  error={validationErrors.zipCode}
                />

                <Input
                  label="Country Code"
                  value={formData.countryCode || ''}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value.toUpperCase() })}
                  maxLength={3}
                />

                <Input
                  label="Primary Phone"
                  value={formData.phoneNumber1 || ''}
                  onChange={(e) => setFormData({ ...formData, phoneNumber1: e.target.value })}
                  placeholder="(XXX)XXX-XXXX"
                  maxLength={13}
                  error={validationErrors.phoneNumber1}
                />

                <Input
                  label="Secondary Phone"
                  value={formData.phoneNumber2 || ''}
                  onChange={(e) => setFormData({ ...formData, phoneNumber2: e.target.value })}
                  placeholder="(XXX)XXX-XXXX"
                  maxLength={13}
                  error={validationErrors.phoneNumber2}
                />

                <Input
                  label="Government Issued ID"
                  value={formData.governmentIssuedId || ''}
                  onChange={(e) => setFormData({ ...formData, governmentIssuedId: e.target.value })}
                  maxLength={20}
                />

                <Input
                  label="EFT Account ID"
                  value={formData.eftAccountId || ''}
                  onChange={(e) => setFormData({ ...formData, eftAccountId: e.target.value })}
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
