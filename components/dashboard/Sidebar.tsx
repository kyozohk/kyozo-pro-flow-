"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import CustomButton from '../CustomButton';
import KyozoLogo from '../ui/KyozoLogo';

const Sidebar: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <aside className="w-64 bg-zinc-900 h-full flex flex-col border-r border-zinc-800">
      {/* Logo at the top */}
      <div className="p-6">
        <Link href="/">
          <div className="flex items-center">
            <KyozoLogo className="mr-2" 
            />
          </div>
        </Link>
      </div>
      
      {/* Main navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" passHref legacyBehavior>
              <a className="block w-full">
                <CustomButton 
                  variant="text" 
                  className="w-full flex items-center justify-start p-3 hover:bg-zinc-800 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </CustomButton>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/communities" passHref legacyBehavior>
              <a className="block w-full">
                <CustomButton 
                  variant="text" 
                  className="w-full flex items-center justify-start p-3 hover:bg-zinc-800 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Communities
                </CustomButton>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/subscription" passHref legacyBehavior>
              <a className="block w-full">
                <CustomButton 
                  variant="text" 
                  className="w-full flex items-center justify-start p-3 hover:bg-zinc-800 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Subscription
                </CustomButton>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Bottom section with sign out and links */}
      <div className="border-t border-zinc-800 p-4">
        <CustomButton 
          onClick={signOut}
          variant="primary"
          className="w-full flex items-center justify-center mb-4 py-3 rounded-full"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </div>
        </CustomButton>
        
        <div className="space-y-2">
          <Link href="/terms" passHref legacyBehavior>
            <a className="block w-full">
              <CustomButton 
                variant="text" 
                className="w-full text-center text-sm text-gray-500"
              >
                Terms & Conditions
              </CustomButton>
            </a>
          </Link>
          <Link href="/privacy" passHref legacyBehavior>
            <a className="block w-full">
              <CustomButton 
                variant="text" 
                className="w-full text-center text-sm text-gray-500"
              >
                Privacy Policy
              </CustomButton>
            </a>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
