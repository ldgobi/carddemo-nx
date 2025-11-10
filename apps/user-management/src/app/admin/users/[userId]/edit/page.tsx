'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { userService } from '@/services/userService';
import { User, UpdateUserRequest, FIRST_NAME_MAX_LENGTH, LAST_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '@/types/user';

export default function UpdateUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  
  const [originalData, setOriginalData] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: '',
    lastName: '',
    password: '',
    userType: 'U',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        handleSubmit(e as any);
      } else if (e.key === 'F3') {
        e.preventDefault();
        handleReturn();
      } else if (e.key === 'F4') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, originalData]);

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

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await userService.getUserById(userId);
      
      setOriginalData(userData);
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: '',
        userType: userData.userType,
      });
      setInfoMessage('Press PF5 key to save your updates ...');
    } catch (err: any) {
      const errorMessage = err.message || 'Unable to lookup User...';
      if (errorMessage.toLowerCase().includes('not found')) {
        setError('User ID NOT found...');
      } else {
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasModifications = (): boolean => {
    if (!originalData) return false;

    const firstNameChanged = formData.firstName !== originalData.firstName;
    const lastNameChanged = formData.lastName !== originalData.lastName;
    const passwordChanged = formData.password && formData.password.trim() !== '';
    const userTypeChanged = formData.userType !== originalData.userType;

    return firstNameChanged || lastNameChanged || passwordChanged || userTypeChanged;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSuccessMessage(null);
    setInfoMessage(null);
    setError(null);

    if (!formData.firstName.trim()) {
      setError('First Name can NOT be empty...');
      return;
    }

    if (!formData.lastName.trim()) {
      setError('Last Name can NOT be empty...');
      return;
    }

    if (!formData.userType) {
      setError('User Type can NOT be empty...');
      return;
    }
    
    if (!hasModifications()) {
      setError('Please modify to update ...');
      return;
    }

    try {
      setSaving(true);
      
      const updatePayload: UpdateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: formData.userType,
        password: formData.password || undefined,
      };

      const response = await userService.updateUser(userId, updatePayload);
      setSuccessMessage(response.message);
      
      setOriginalData(response.user);
      setFormData({
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        password: '',
        userType: response.user.userType,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Unable to Update User...';
      setError(errorMessage);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReturn = () => {
    router.push('/admin/users');
  };

  const handleClear = () => {
    if (originalData) {
      setFormData({
        firstName: originalData.firstName,
        lastName: originalData.lastName,
        password: '',
        userType: originalData.userType,
      });
    }
    setError(null);
    setSuccessMessage(null);
    setInfoMessage('Press PF5 key to save your updates ...');
  };

  const handleInputChange = (field: keyof UpdateUserRequest, value: string) => {
    let processedValue = value;
    
    if (field === 'password') {
      processedValue = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    setError(null);
    setSuccessMessage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-600">Loading user data...</div>
      </div>
    );
  }

  if (!originalData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md w-full border border-gray-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'User not found'}</p>
          <button
            onClick={handleReturn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Return to User List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white shadow-2xl rounded-lg p-6 max-w-3xl mx-auto border border-gray-200">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">
              <span className="font-mono">CU02</span>
              <span className="mx-2">|</span>
              <span className="font-mono">COUSR02C</span>
            </div>
            <span className="text-sm text-gray-600 font-mono">{currentDateTime}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">CardDemo</h1>
          <h2 className="text-xl font-semibold text-gray-600">Update User</h2>
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

        {infoMessage && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-sm">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed uppercase font-mono"
            />
          </div>

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
              disabled={saving}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={saving}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter Last Name"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              maxLength={PASSWORD_MAX_LENGTH}
              disabled={saving}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed uppercase font-mono"
              placeholder="Enter new Password (leave blank to keep current)"
            />
            <p className="mt-1 text-xs text-gray-500">Leave blank to keep current password</p>
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
              disabled={saving}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="U">U - Regular User</option>
              <option value="A">A - Administrator</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save (F5)'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={saving}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Clear (F4)
            </button>
            <button
              type="button"
              onClick={handleReturn}
              disabled={saving}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Return (F3)
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>All fields are required except Password (leave blank to keep current)</p>
          <p className="mt-1">Password will be converted to uppercase</p>
          <p className="mt-1">Press F5 to save changes, F4 to reset, F3 to return to user list</p>
        </div>
      </div>
    </div>
  );
}
