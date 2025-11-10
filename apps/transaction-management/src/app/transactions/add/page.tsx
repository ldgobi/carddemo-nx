'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { transactionService } from '@/services/transactionService';
import { CreateTransactionRequest } from '@/types/transaction';
import { Button } from '@/components/ui';

export default function AddTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTransactionRequest>({
    cardNumber: '',
    typeCode: '',
    categoryCode: 0,
    source: '',
    description: '',
    amount: 0,
    merchantId: 0,
    merchantName: '',
    merchantCity: '',
    merchantZip: '',
    originalTimestamp: new Date().toISOString().split('T')[0],
    confirmation: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'categoryCode' || name === 'merchantId' 
        ? parseFloat(value) || 0 
        : value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.cardNumber || formData.cardNumber.length !== 16) {
      setError('Card number must be exactly 16 digits');
      return false;
    }

    if (!formData.typeCode || formData.typeCode.length !== 2) {
      setError('Type code must be exactly 2 characters');
      return false;
    }

    if (!formData.categoryCode || formData.categoryCode < 1000 || formData.categoryCode > 9999) {
      setError('Category code must be a 4-digit number');
      return false;
    }

    if (!formData.source || formData.source.length > 10) {
      setError('Source is required and must not exceed 10 characters');
      return false;
    }

    if (!formData.description || formData.description.length > 100) {
      setError('Description is required and must not exceed 100 characters');
      return false;
    }

    if (!formData.amount || formData.amount === 0) {
      setError('Amount is required and must not be zero');
      return false;
    }

    if (!formData.merchantId || formData.merchantId === 0) {
      setError('Merchant ID is required');
      return false;
    }

    if (!formData.merchantName || formData.merchantName.length > 50) {
      setError('Merchant name is required and must not exceed 50 characters');
      return false;
    }

    if (!formData.merchantCity || formData.merchantCity.length > 50) {
      setError('Merchant city is required and must not exceed 50 characters');
      return false;
    }

    if (!formData.merchantZip || formData.merchantZip.length > 10) {
      setError('Merchant ZIP is required and must not exceed 10 characters');
      return false;
    }

    if (!formData.originalTimestamp) {
      setError('Transaction date is required');
      return false;
    }

    if (formData.confirmation !== 'Y' && formData.confirmation !== 'y') {
      setError('Please confirm the transaction by entering Y');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await transactionService.createTransaction(formData);
      setSuccess(`Transaction created successfully with ID: ${result.transactionId}`);
      
      // Reset form
      setFormData({
        cardNumber: '',
        typeCode: '',
        categoryCode: 0,
        source: '',
        description: '',
        amount: 0,
        merchantId: 0,
        merchantName: '',
        merchantCity: '',
        merchantZip: '',
        originalTimestamp: new Date().toISOString().split('T')[0],
        confirmation: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/transactions');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to create transaction:', err);
      setError(err.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Add New Transaction</h1>
            <Button onClick={() => router.push('/transactions')}>
              Back to List
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength={16}
                placeholder="16 digits"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="typeCode"
                value={formData.typeCode}
                onChange={handleInputChange}
                maxLength={2}
                placeholder="2 characters"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Code <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="categoryCode"
                value={formData.categoryCode || ''}
                onChange={handleInputChange}
                min={1000}
                max={9999}
                placeholder="4 digits"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Source <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                maxLength={10}
                placeholder="Max 10 characters"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount || ''}
                onChange={handleInputChange}
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transaction Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="originalTimestamp"
                value={formData.originalTimestamp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={100}
              rows={3}
              placeholder="Max 100 characters"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Merchant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Merchant ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="merchantId"
                  value={formData.merchantId || ''}
                  onChange={handleInputChange}
                  placeholder="Numeric ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Merchant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="merchantName"
                  value={formData.merchantName}
                  onChange={handleInputChange}
                  maxLength={50}
                  placeholder="Max 50 characters"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="merchantCity"
                  value={formData.merchantCity}
                  onChange={handleInputChange}
                  maxLength={50}
                  placeholder="Max 50 characters"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="merchantZip"
                  value={formData.merchantZip}
                  onChange={handleInputChange}
                  maxLength={10}
                  placeholder="Max 10 characters"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmation (Y/N) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="confirmation"
                value={formData.confirmation}
                onChange={handleInputChange}
                maxLength={1}
                placeholder="Enter Y to confirm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter 'Y' to confirm the transaction creation
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Transaction'}
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/transactions')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
