'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { CreateUserRequest, USER_ID_MAX_LENGTH, FIRST_NAME_MAX_LENGTH, LAST_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '@/types/user';

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateUserRequest>({
    userId: '',
    firstName: '',
    lastName: '',
    password: '',
    userType: 'U',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        e.preventDefault();
        handleReturn();
      } else if (e.key === 'F4') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateDateTime = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    setCurrentDateTime(`${dateStr} ${timeStr}`);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name can NOT be empty...';
      setError('First Name can NOT be empty...');
      return false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name can NOT be empty...';
      setError('Last Name can NOT be empty...');
      return false;
    }

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID can NOT be empty...';
      setError('User ID can NOT be empty...');
      return false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password can NOT be empty...';
      setError('Password can NOT be empty...');
      return false;
    }

    if (!formData.userType) {
      newErrors.userType = 'User Type can NOT be empty...';
      setError('User Type can NOT be empty...');
      return false;
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSuccessMessage(null);
    setError(null);
    setFieldErrors({});
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await userService.createUser(formData);
      setSuccessMessage(response.message);
      handleClear();
    } catch (err: any) {
      const errorMessage = err.message || 'Unable to Add User...';
      if (errorMessage.toLowerCase().includes('already exist')) {
        setError('User ID already exist...');
        setFieldErrors({ userId: 'User ID already exist...' });
      } else {
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    router.push('/admin/menu');
  };

  const handleClear = () => {
    setFormData({
      userId: '',
      firstName: '',
      lastName: '',
      password: '',
      userType: 'U',
    });
    setFieldErrors({});
    setError(null);
  };

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    let processedValue = value;
    
    if (field === 'userId' || field === 'password') {
      processedValue = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white shadow-2xl rounded-lg p-6 max-w-3xl mx-auto border border-gray-200">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">
              <span className="font-mono">CU01</span>
              <span className="mx-2">|</span>
              <span className="font-mono">COUSR01C</span>
            </div>
            <span className="text-sm text-gray-600 font-mono">{currentDateTime}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">CardDemo</h1>
          <h2 className="text-xl font-semibold text-gray-600">Add New User</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              maxLength={FIRST_NAME_MAX_LENGTH}
              required
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter First Name"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              maxLength={LAST_NAME_MAX_LENGTH}
              required
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Last Name"
            />
          </div>

          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              User ID <span className="text-red-500">*</span>
            </label>
            <input
              id="userId"
              type="text"
              value={formData.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              maxLength={USER_ID_MAX_LENGTH}
              required
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed uppercase font-mono ${
                fieldErrors.userId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter User ID"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              maxLength={PASSWORD_MAX_LENGTH}
              required
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed uppercase font-mono ${
                fieldErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Password"
            />
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
              User Type <span className="text-red-500">*</span>
            </label>
            <select
              id="userType"
              value={formData.userType}
              onChange={(e) => handleInputChange('userType', e.target.value as 'A' | 'U')}
              required
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                fieldErrors.userType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="U">U - Regular User</option>
              <option value="A">A - Administrator</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding User...' : 'Add User (Enter)'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Clear (F4)
            </button>
            <button
              type="button"
              onClick={handleReturn}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Return (F3)
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>All fields are required</p>
          <p className="mt-1">User ID and Password will be converted to uppercase</p>
          <p className="mt-1">Press F3 to return to admin menu, F4 to clear the form</p>
        </div>
      </div>
    </div>
  );
}
