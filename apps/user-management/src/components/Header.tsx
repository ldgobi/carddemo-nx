'use client';

import React, { useState, useEffect } from 'react';

interface HeaderProps {
  transactionId: string;
  programName: string;
  title: string;
  subtitle?: string;
}

export default function Header({ transactionId, programName, title, subtitle }: HeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
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

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-500">
          <span className="font-mono">{transactionId}</span>
          <span className="mx-2">|</span>
          <span className="font-mono">{programName}</span>
        </div>
        <span className="text-sm text-gray-600 font-mono">{currentDateTime}</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-1">{title}</h1>
      {subtitle && <h2 className="text-xl font-semibold text-gray-600">{subtitle}</h2>}
    </div>
  );
}
