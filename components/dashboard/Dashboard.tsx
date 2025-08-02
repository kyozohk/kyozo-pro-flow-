"use client";

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/dashboard/Sidebar';
import { colors, borderRadius, fontWeights, fontSizes } from '../../styles/theme';

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className={`flex h-screen bg-[${colors.bgDarker}]`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className={`${fontSizes['5xl']} md:${fontSizes['6xl']} ${fontWeights.bold} text-[${colors.textPrimary}] font-hero`}>
              Welcome, {user?.displayName || 'User'}
            </h1>
            <p className={`text-[${colors.textSecondary}] mt-3`}>Your personal dashboard</p>
          </header>
          
          <div className={`bg-[${colors.bgCard}] ${borderRadius.xl} p-10 shadow-lg border border-[${colors.borderDark}]`}>
            {children || (
              <div className="text-center py-14">
                <h2 className={`${fontSizes['3xl']} ${fontWeights.bold} text-[${colors.textPrimary}] mb-6 font-hero`}>
                  Welcome to Kyozo
                </h2>
                <p className={`text-[${colors.textSecondary}] max-w-lg mx-auto ${fontSizes.lg}`}>
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
