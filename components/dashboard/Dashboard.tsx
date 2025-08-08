"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Sidebar from '../../components/dashboard/Sidebar';
import CommunityOnboardingDialog from '../community/CommunityOnboardingDialog';
import { usePathname } from 'next/navigation';

interface DashboardProps {
  children?: React.ReactNode;
}

interface Community {
  id: string;
  name: string;
  createdAt?: any;
  [key: string]: any;
}

interface Member {
  id: string;
  status: 'active' | 'inactive';
  [key: string]: any;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: any;
  communityName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Check for user communities and fetch member stats
  useEffect(() => {
    const checkCommunities = async () => {
      if (!user) {
        setLoadingCommunities(false);
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
        
        // If communities exist, fetch member statistics
        if (userCommunities.length > 0) {
          let totalMemberCount = 0;
          let activeMemberCount = 0;
          const activityList: any[] = [];
          
          // Fetch members from each community
          for (const community of userCommunities) {
            try {
              const membersQuery = query(collection(db, `users/${user.uid}/communities/${community.id}/members`));
              const membersSnapshot = await getDocs(membersQuery);
              const members = membersSnapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
              })) as Member[];
              
              totalMemberCount += members.length;
              activeMemberCount += members.filter(member => member.status === 'active').length;
              
              // Add recent activity (simplified - just community creation for now)
              if (community.createdAt) {
                activityList.push({
                  id: community.id,
                  type: 'community_created',
                  message: `Created community "${community.name}"`,
                  timestamp: community.createdAt,
                  communityName: community.name
                });
              }
            } catch (memberError) {
              console.error(`Error fetching members for community ${community.id}:`, memberError);
            }
          }
          
          setTotalMembers(totalMemberCount);
          setActiveMembers(activeMemberCount);
          setRecentActivity(activityList.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds).slice(0, 5));
        } else {
          // Only show onboarding dialog if no communities exist AND user is on main dashboard page
          if (pathname === '/dashboard') {
            setShowOnboarding(true);
          }
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
        // Only show onboarding dialog on error as fallback if on main dashboard page
        if (pathname === '/dashboard') {
          setShowOnboarding(true);
        }
      } finally {
        setLoadingCommunities(false);
      }
    };
    
    checkCommunities();
  }, [user]);
  
  const handleCommunityCreated = () => {
    // Refresh communities list
    if (user) {
      const checkCommunities = async () => {
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
      checkCommunities();
    }
  };
  
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };
  
  // Show loading state while checking communities
  if (loadingCommunities) {
    return (
      <div className="flex h-screen bg-[#121212]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E0407B]"></div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-[#121212]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Welcome, {user?.displayName || 'User'}
            </h1>
            <p className="text-gray-400 mt-2">
              {communities.length === 0 
                ? 'Let\'s get started by creating your first community' 
                : `Managing ${communities.length} ${communities.length === 1 ? 'community' : 'communities'}`
              }
            </p>
          </header>
          
          {/* Main content card with subtle Card0 styling */}
          <div className="bg-[#1C1C1E] rounded-2xl border border-gray-800 shadow-lg">
            <div className="p-8 md:p-12">
              {children || (
            communities.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-700">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Community?</h2>
                <p className="text-gray-300 max-w-lg mx-auto text-lg leading-relaxed mb-8">
                  Create your first community and start connecting with like-minded people. Import from Eventbrite, upload a CSV, or start from scratch.
                </p>
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#E0407B] to-[#B8336A] text-white font-semibold rounded-xl hover:from-[#C73A6F] hover:to-[#A02F5F] transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Your First Community
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-700">
                    <svg className="w-10 h-10 text-[#E0407B]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Dashboard Overview
                  </h2>
                  <p className="text-gray-300 max-w-lg mx-auto text-lg leading-relaxed">
                    Manage your communities, track growth, and engage with your members.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-[#E0407B]/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-[#E0407B]/10 rounded-xl flex items-center justify-center mb-4 border border-[#E0407B]/20">
                      <svg className="w-6 h-6 text-[#E0407B]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{communities.length}</h3>
                    <p className="text-gray-400 text-sm">Communities</p>
                  </div>
                  
                  <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
                    <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-4 border border-gray-600">
                      <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{totalMembers}</h3>
                    <p className="text-gray-400 text-sm">Total Members</p>
                  </div>
                  
                  <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
                    <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-4 border border-gray-600">
                      <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{activeMembers}</h3>
                    <p className="text-gray-400 text-sm">Active Members</p>
                  </div>
                  
                  <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
                    <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-4 border border-gray-600">
                      <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0}%</h3>
                    <p className="text-gray-400 text-sm">Active Rate</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setShowOnboarding(true)}
                      className="group p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-[#E0407B]/50 transition-all duration-300 text-left"
                    >
                      <div className="w-10 h-10 bg-[#E0407B]/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#E0407B]/30 transition-colors">
                        <svg className="w-5 h-5 text-[#E0407B]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                      <h4 className="text-white font-medium mb-1">Create Community</h4>
                      <p className="text-gray-400 text-sm">Start a new community</p>
                    </button>
                    
                    <div className="group p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mb-3 border border-gray-600">
                        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V15.75a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                        </svg>
                      </div>
                      <h4 className="text-white font-medium mb-1">Import Eventbrite</h4>
                      <p className="text-gray-400 text-sm">Sync event attendees</p>
                    </div>
                    
                    <div className="group p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mb-3 border border-gray-600">
                        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-4.5B4.875 8.25A3.375 3.375 0 001.5 11.625v2.625m18 0A2.25 2.25 0 0119.5 16.5h-2.25a2.25 2.25 0 01-2.25-2.25m4.5 0a2.25 2.25 0 01-2.25 2.25H15a2.25 2.25 0 01-2.25-2.25m4.5 0V12a9 9 0 00-9-9 9 9 0 00-9 9v4.5a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25V15z" />
                        </svg>
                      </div>
                      <h4 className="text-white font-medium mb-1">Upload CSV</h4>
                      <p className="text-gray-400 text-sm">Import member list</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                  {recentActivity.length === 0 ? (
                    <div className="p-8 bg-gray-800/30 rounded-xl border border-gray-700 text-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                      </div>
                      <h4 className="text-white font-medium mb-2">No Recent Activity</h4>
                      <p className="text-gray-400 text-sm">Activity from your communities will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium">{activity.message}</p>
                              <p className="text-gray-400 text-sm mt-1">
                                {activity.timestamp?.seconds ? 
                                  new Date(activity.timestamp.seconds * 1000).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  }) : 
                                  'Recently'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          )}                        
            </div>
          </div>
        </div>
      </main>
      
      {/* Community Onboarding Dialog */}
      {showOnboarding && (
        <CommunityOnboardingDialog
          onClose={handleCloseOnboarding}
          onCommunityCreated={handleCommunityCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
