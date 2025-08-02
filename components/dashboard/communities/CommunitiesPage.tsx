"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import CustomButton from '../../CustomButton';
import { colors, borderRadius, fontWeights, fontSizes, uiElements } from '../../../styles/theme';
import CommunityList from './CommunityList';
import CreateCommunityModal from './CreateCommunityModal';
import OnboardingWizard from './wizard/OnboardingWizard';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const CommunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [communities, setCommunities] = useState<any[]>([]);

  // Check if user is new (has no communities) to show onboarding wizard
  useEffect(() => {
    const checkUserCommunities = async () => {
      if (!user) return;
      
      try {
        // Query Firestore for communities where the user is the owner
        const communitiesRef = collection(db, 'communities');
        const q = query(communitiesRef, where('ownerId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const userCommunities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Firestore communities check:', userCommunities.length);
        setCommunities(userCommunities);
        
        // Only show onboarding wizard if user has no communities in Firestore
        if (userCommunities.length === 0) {
          console.log('User has no communities in Firestore, showing onboarding wizard');
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };
    
    checkUserCommunities();
  }, [user]);  // Only depend on user to ensure this runs once when user is available

  const handleCreateCommunity = (newCommunity: any) => {
    setCommunities([...communities, newCommunity]);
    setIsCreateModalOpen(false);
    setIsWizardOpen(false);
    setShowOnboarding(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center justify-between">
          <h1 className={`${fontSizes['4xl']} ${fontWeights.bold} text-[${colors.textPrimary}] font-hero`}>
            Communities
          </h1>
          <CustomButton 
            variant="primary"
            className={`${borderRadius.full} px-6 py-3`}
            onClick={() => setIsWizardOpen(true)}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Community
            </div>
          </CustomButton>
        </div>
        <p className={`text-[${colors.textSecondary}] mt-3`}>
          Manage your communities and connect with members
        </p>
      </header>

      {communities.length === 0 ? (
        <div className={`${uiElements.card} p-10 text-center`}>
          <div className="mx-auto w-20 h-20 rounded-full bg-[${colors.borderDark}] flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-[${colors.textSecondary}]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className={`${fontSizes['2xl']} ${fontWeights.bold} text-[${colors.textPrimary}] mb-4 font-hero`}>
            No Communities Yet
          </h2>
          <p className={`text-[${colors.textSecondary}] max-w-lg mx-auto mb-8`}>
            Create your first community to start connecting with members and organizing events.
          </p>
          <CustomButton 
            variant="primary"
            className={`${borderRadius.full} px-8 py-3`}
            onClick={() => setIsWizardOpen(true)}
          >
            Create Your First Community
          </CustomButton>
        </div>
      ) : (
        <CommunityList communities={communities} />
      )}

      {isCreateModalOpen && (
        <CreateCommunityModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onCreateCommunity={handleCreateCommunity}
        />
      )}

      {/* Show onboarding wizard for first-time users or when explicitly opened */}
      {(showOnboarding || isWizardOpen) && (
        <OnboardingWizard
          onClose={() => {
            setIsWizardOpen(false);
            setShowOnboarding(false);
          }}
          onCreateCommunity={handleCreateCommunity}
        />
      )}
    </div>
  );
};

export default CommunitiesPage;
