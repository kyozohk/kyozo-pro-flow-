"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, query, getDocs, collectionGroup } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Dashboard from '../../../components/dashboard/Dashboard';
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  bio?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  status: 'active' | 'inactive';
  joinDate?: any;
  source: 'eventbrite' | 'manual' | 'csv';
  communityId: string;
  communityName?: string;
  communitySlug?: string;
}

const MembersPage: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'eventbrite' | 'manual' | 'csv'>('all');

  // Fetch all members from all communities
  useEffect(() => {
    const fetchMembers = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // First get all communities
        const communitiesQuery = query(collection(db, `users/${user.uid}/communities`));
        const communitiesSnapshot = await getDocs(communitiesQuery);
        
        const allMembers: Member[] = [];
        
        // For each community, fetch its members
        for (const communityDoc of communitiesSnapshot.docs) {
          const communityData = communityDoc.data();
          const membersQuery = query(collection(db, `users/${user.uid}/communities/${communityDoc.id}/members`));
          const membersSnapshot = await getDocs(membersQuery);
          
          const communityMembers = membersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            communityId: communityDoc.id,
            communityName: communityData.name,
            communitySlug: communityData.slug || communityDoc.id,
          })) as Member[];
          
          allMembers.push(...communityMembers);
        }
        
        setMembers(allMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [user]);

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.communityName && member.communityName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesSource = filterSource === 'all' || member.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getSourceColor = (source: string) => {
    const colors = {
      eventbrite: 'bg-blue-500/20 text-blue-300',
      manual: 'bg-green-500/20 text-green-300',
      csv: 'bg-purple-500/20 text-purple-300',
    };
    return colors[source as keyof typeof colors] || colors.manual;
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-300' 
      : 'bg-gray-500/20 text-gray-300';
  };

  const MembersContent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
          Members
        </h1>
        <p className="text-gray-300 text-lg">
          Manage all members across your communities
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search members, emails, or communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Source Filter */}
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value as any)}
          className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Sources</option>
          <option value="eventbrite">Eventbrite</option>
          <option value="manual">Manual</option>
          <option value="csv">CSV</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-orange-600/20 to-yellow-500/20 rounded-xl border border-orange-500/30">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{members.length}</p>
              <p className="text-gray-300 text-sm">Total Members</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-600/20 to-emerald-500/20 rounded-xl border border-green-500/30">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{members.filter(m => m.status === 'active').length}</p>
              <p className="text-gray-300 text-sm">Active</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V15.75a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{members.filter(m => m.source === 'eventbrite').length}</p>
              <p className="text-gray-300 text-sm">From Eventbrite</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-500/20 rounded-xl border border-purple-500/30">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{filteredMembers.length}</p>
              <p className="text-gray-300 text-sm">Filtered Results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            {members.length === 0 ? 'No Members Yet' : 'No Members Found'}
          </h3>
          <p className="text-gray-300 max-w-lg mx-auto text-lg leading-relaxed">
            {members.length === 0 
              ? 'Import members through your communities to see them here.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Link 
              key={`${member.communityId}-${member.id}`}
              href={`/community/${member.communitySlug}/member/${member.id}`}
              className="group block"
            >
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {member.imageUrl ? (
                        <img 
                          src={member.imageUrl} 
                          alt={member.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {member.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-300 transition-colors truncate">
                        {member.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2 truncate">{member.email}</p>
                      
                      {member.communityName && (
                        <p className="text-blue-300 text-sm mb-3 truncate">
                          {member.communityName}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(member.source)}`}>
                          {member.source}
                        </span>
                      </div>
                      
                      {/* Social Links */}
                      {(member.linkedinUrl || member.twitterUrl) && (
                        <div className="flex space-x-2 mt-3">
                          {member.linkedinUrl && (
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </div>
                          )}
                          {member.twitterUrl && (
                            <div className="w-6 h-6 bg-sky-500 rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dashboard>
      <MembersContent />
    </Dashboard>
  );
};

export default MembersPage;
