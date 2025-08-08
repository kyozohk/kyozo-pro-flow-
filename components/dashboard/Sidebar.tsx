"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import CustomButton from '../CustomButton';
import KyozoLogo from '../ui/KyozoLogo';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Sidebar: React.FC = () => {
  const { signOut, currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  return (
    <aside className="w-64 bg-gradient-to-b from-[#1C1C1E] via-[#1A1A1C] to-[#181818] h-full flex flex-col border-r border-gray-800/50 backdrop-blur-sm">
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
        <ul className="space-y-3">
          <li>
            <Link href="/dashboard" className="block w-full">
              <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-purple-600/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-white font-medium group-hover:text-purple-300 transition-colors">Dashboard</span>
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/communities" className="block w-full">
              <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-teal-500/10 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium group-hover:text-blue-300 transition-colors">Communities</span>
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/members" className="block w-full">
              <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-orange-600/10 to-yellow-500/10 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium group-hover:text-orange-300 transition-colors">Members</span>
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/subscription" className="block w-full">
              <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-gray-600/10 to-gray-500/10 border border-gray-500/20 hover:border-gray-400/40 transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium group-hover:text-gray-300 transition-colors">Subscription</span>
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* User profile section */}
      <div className="border-t border-gray-800/50 p-4">
        {!loading && userProfile && (
          <div className="mb-4">
            {/* User Avatar and Info Card */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              <div className="flex items-center">
                <div className="relative">
                  {userProfile.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-xl object-cover border-2 border-[#E0407B]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E0407B] to-[#D45E9B] flex items-center justify-center text-white font-bold text-sm">
                      {userProfile.firstName?.charAt(0)}{userProfile.lastName?.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1C1C1E] flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {userProfile.firstName} {userProfile.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {currentUser?.email || userProfile.phoneNumber}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-green-400 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Sign Out Button */}
        <button
          onClick={signOut}
          className="group w-full p-3 rounded-xl bg-gradient-to-r from-red-600/20 to-rose-500/20 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:scale-105 mb-4"
        >
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-white font-medium group-hover:text-red-300 transition-colors">Sign Out</span>
          </div>
        </button>
        
        <div className="space-y-2">
          <Link href="/terms" className="block w-full">
            <CustomButton 
              variant="text" 
              className="w-full text-center text-xs text-gray-500 hover:text-gray-400"
            >
              Terms & Conditions
            </CustomButton>
          </Link>
          <Link href="/privacy" className="block w-full">
            <CustomButton 
              variant="text" 
              className="w-full text-center text-xs text-gray-500 hover:text-gray-400"
            >
              Privacy Policy
            </CustomButton>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
