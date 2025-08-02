"use client";

import React from 'react';
import Image from 'next/image';
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
            <div className="flex items-center gap-4">
              {user?.photoURL ? (
                <div className={`w-16 h-16 rounded-full overflow-hidden border border-[${colors.borderLight}]`}>
                  <Image 
                    src={user.photoURL} 
                    alt="Profile" 
                    width={64} 
                    height={64} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`w-16 h-16 rounded-full bg-[${colors.bgCard}] border border-[${colors.borderLight}] flex items-center justify-center`}>
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}
              <div>
                <h1 className={`${fontSizes['5xl']} md:${fontSizes['6xl']} ${fontWeights.bold} text-[${colors.textPrimary}] font-hero`}>
                  Welcome, {user?.displayName || 'User'}
                </h1>
                <p className={`text-[${colors.textSecondary}] mt-3`}>Your personal dashboard</p>
              </div>
            </div>
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
