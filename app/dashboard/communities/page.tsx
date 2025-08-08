"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Dashboard from '../../../components/dashboard/Dashboard';
import ImportCommunityDialog from '../../../components/community/ImportCommunityDialog';
import EventbriteOnboardingDialog from '../../../components/community/EventbriteOnboardingDialog';
import Link from 'next/link';

interface Community {
  id: string;
  name: string;
  location?: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
  privacy: 'public' | 'private';
  themeColor: string;
  memberCount?: number;
  createdAt?: any;
}

const CommunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showEventbriteDialog, setShowEventbriteDialog] = useState(false);

  // Fetch user communities
  useEffect(() => {
    const fetchCommunities = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const communitiesQuery = query(collection(db, `users/${user.uid}/communities`));
        const querySnapshot = await getDocs(communitiesQuery);
        const userCommunities = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Community[];
        
        setCommunities(userCommunities);
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [user]);

  const handleMethodSelect = (method: 'eventbrite' | 'csv' | 'manual') => {
    setShowImportDialog(false);
    
    switch (method) {
      case 'eventbrite':
        setShowEventbriteDialog(true);
        break;
      case 'csv':
        console.log('CSV import not yet implemented');
        break;
      case 'manual':
        console.log('Manual creation not yet implemented');
        break;
    }
  };

  const handleEventbriteComplete = (data: any) => {
    setShowEventbriteDialog(false);
    // Refresh communities list
    if (user) {
      const fetchCommunities = async () => {
        try {
          const communitiesQuery = query(collection(db, `users/${user.uid}/communities`));
          const querySnapshot = await getDocs(communitiesQuery);
          const userCommunities = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          })) as Community[];
          setCommunities(userCommunities);
        } catch (error) {
          console.error('Error refreshing communities:', error);
        }
      };
      fetchCommunities();
    }
  };

  const getThemeColors = (themeColor: string) => {
    const themes = {
      pink: 'from-pink-500 to-rose-500',
      purple: 'from-purple-500 to-indigo-500',
      blue: 'from-blue-500 to-cyan-500',
      teal: 'from-teal-500 to-emerald-500',
      orange: 'from-orange-500 to-amber-500',
    };
    return themes[themeColor as keyof typeof themes] || themes.pink;
  };

  const CommunitiesContent = () => (
    <div className="space-y-8">
      {/* Header with Import Options */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
            Communities
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your communities and import new ones
          </p>
        </div>
        
        {/* Import Options */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowImportDialog(true)}
            className="group px-6 py-3 bg-gradient-to-r from-pink-600/20 to-rose-500/20 rounded-xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span className="text-white font-medium group-hover:text-pink-300 transition-colors">Manual</span>
            </div>
          </button>
          
          <button
            onClick={() => setShowEventbriteDialog(true)}
            className="group px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V15.75a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <span className="text-white font-medium group-hover:text-blue-300 transition-colors">Eventbrite</span>
            </div>
          </button>
          
          <button
            onClick={() => console.log('CSV import')}
            className="group px-6 py-3 bg-gradient-to-r from-green-600/20 to-emerald-500/20 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <span className="text-white font-medium group-hover:text-green-300 transition-colors">CSV</span>
            </div>
          </button>
        </div>
      </div>

      {/* Communities Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : communities.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Communities Yet</h3>
          <p className="text-gray-300 max-w-lg mx-auto text-lg leading-relaxed mb-8">
            Create your first community using one of the import options above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Link 
              key={community.id} 
              href={`/community/${community.id}`}
              className="group block"
            >
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                {/* Background Image or Gradient */}
                <div className={`h-32 bg-gradient-to-br ${getThemeColors(community.themeColor)} relative`}>
                  {community.backgroundImageUrl && (
                    <img 
                      src={community.backgroundImageUrl} 
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                
                {/* Community Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Logo */}
                      <div className="w-16 h-16 -mt-8 mb-4 relative z-10">
                        {community.logoUrl ? (
                          <img 
                            src={community.logoUrl} 
                            alt={community.name}
                            className="w-full h-full rounded-xl object-cover border-4 border-[#1C1C1E]"
                          />
                        ) : (
                          <div className={`w-full h-full rounded-xl bg-gradient-to-br ${getThemeColors(community.themeColor)} flex items-center justify-center border-4 border-[#1C1C1E]`}>
                            <span className="text-white font-bold text-lg">
                              {community.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {community.name}
                      </h3>
                      
                      {community.location && (
                        <p className="text-gray-400 text-sm mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                          </svg>
                          {community.location}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">
                          {community.memberCount || 0} members
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          community.privacy === 'public' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-orange-500/20 text-orange-300'
                        }`}>
                          {community.privacy}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Import Community Dialog */}
      <ImportCommunityDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onMethodSelect={handleMethodSelect}
      />
      
      {/* Eventbrite Onboarding Dialog */}
      <EventbriteOnboardingDialog
        isOpen={showEventbriteDialog}
        onClose={() => setShowEventbriteDialog(false)}
        onComplete={handleEventbriteComplete}
      />
    </div>
  );

  return (
    <Dashboard>
      <CommunitiesContent />
    </Dashboard>
  );
};

export default CommunitiesPage;
