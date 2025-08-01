"use client";

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/dashboard/Sidebar';

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white">Welcome, {user?.displayName || 'User'}</h1>
            <p className="text-gray-400 mt-2">Your personal dashboard</p>
          </header>
          
          <div className="bg-zinc-900 rounded-xl p-8 shadow-lg border border-zinc-800">
            {children || (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to Kyozo</h2>
                <p className="text-gray-300 max-w-lg mx-auto">
                  This is your personal dashboard. Explore communities, manage your subscription, and customize your experience.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
