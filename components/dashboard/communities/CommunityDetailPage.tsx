"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../styles/theme';
import CustomButton from '../../CustomButton';
import CustomTabs from '../../../components/dashboard/communities/CustomTabs';
import MembersTab from '../../../components/dashboard/communities/tabs/MembersTab';
import MessagingTab from '../../../components/dashboard/communities/tabs/MessagingTab';
import SettingsTab from '../../../components/dashboard/communities/tabs/SettingsTab';
import TeamTab from '../../../components/dashboard/communities/tabs/TeamTab';

interface CommunityDetailPageProps {
  communityId: string;
}

const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({ communityId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('members');
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from Firebase
    const fetchCommunity = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        setCommunity({
          id: communityId,
          name: 'Tech Innovators Community',
          description: 'A community for tech enthusiasts and innovators to connect and collaborate on cutting-edge projects.',
          memberCount: 42,
          createdAt: new Date().toISOString(),
          imageUrl: null
        });
      } catch (error) {
        console.error('Error fetching community:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [communityId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E0407B]"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className={`bg-[${colors.bgCard}] ${borderRadius.xl} p-8 text-center`}>
        <h2 className={`${fontSizes['2xl']} ${fontWeights.bold} text-[${colors.textPrimary}] mb-4`}>
          Community Not Found
        </h2>
        <p className={`text-[${colors.textSecondary}] mb-6`}>
          The community you're looking for doesn't exist or you don't have access to it.
        </p>
        <CustomButton
          variant="primary"
          className={`${borderRadius.full} px-6`}
          onClick={() => router.push('/dashboard/communities')}
        >
          Back to Communities
        </CustomButton>
      </div>
    );
  }

  const tabs = [
    { id: 'members', label: 'Members' },
    { id: 'messaging', label: 'Messaging' },
    { id: 'team', label: 'Team' },
    { id: 'settings', label: 'Settings' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'members':
        return <MembersTab communityId={communityId} communityName={community.name} />;
      case 'messaging':
        return <MessagingTab communityId={communityId} />;
      case 'team':
        return <TeamTab communityId={communityId} communityName={community.name} />;
      case 'settings':
        return <SettingsTab community={community} onUpdate={setCommunity} />;
      default:
        return <MembersTab communityId={communityId} communityName={community.name} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <CustomButton
          variant="text"
          className={`text-[${colors.textSecondary}] hover:text-[${colors.textPrimary}] mr-4`}
          onClick={() => router.push('/dashboard/communities')}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </div>
        </CustomButton>
      </div>

      {/* Community header */}
      <div className={`bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] overflow-hidden mb-6`}>
        <div className="h-48 bg-gradient-to-r from-[${colors.gradientStart}] to-[${colors.gradientEnd}] relative">
          {community.imageUrl && (
            <Image
              src={community.imageUrl}
              alt={community.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        
        <div className="p-8">
          <h1 className={`${fontSizes['3xl']} ${fontWeights.bold} text-[${colors.textPrimary}] mb-2 font-hero`}>
            {community.name}
          </h1>
          <p className={`text-[${colors.textSecondary}] mb-4`}>
            {community.description}
          </p>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-[${colors.textSecondary}] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className={`text-sm text-[${colors.textSecondary}]`}>
              {community.memberCount} members
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <CustomTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CommunityDetailPage;
