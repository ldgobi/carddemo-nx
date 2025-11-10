'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/components/ui';
import { validateAccountId } from '@/types/account';

export default function AccountsPage() {
  const router = useRouter();
  const [accountId, setAccountId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate account ID
    if (!accountId.trim()) {
      setError('Please enter an account ID');
      return;
    }

    const cleanedAccountId = accountId.replace(/\D/g, '');
    
    if (!validateAccountId(cleanedAccountId)) {
      setError('Account ID must be a non-zero 11-digit number');
      return;
    }

    // Navigate to account view page
    router.push(`/accounts/${cleanedAccountId}`);
  };

  const handleClear = () => {
    setAccountId('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Search for an account by entering the 11-digit account ID
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <Input
                label="Account ID"
                type="text"
                value={accountId}
                onChange={(e) => {
                  setAccountId(e.target.value);
                  setError(null);
                }}
                placeholder="Enter 11-digit account ID"
                required
                error={error || undefined}
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter the account number to view account and customer details
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit">Search Account</Button>
              <Button type="button" variant="secondary" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            How to use Account Management
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Enter a valid 11-digit account ID to search</span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>View comprehensive account and customer information</span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Update account and customer details as needed</span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>All changes are validated before being saved</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
