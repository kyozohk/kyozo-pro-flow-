"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CommunityForm from './CommunityForm';
import EventbriteOnboardingDialog from './EventbriteOnboardingDialog';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface CommunityOnboardingDialogProps {
  onClose: () => void;
  onCommunityCreated: () => void;
}

type OnboardingStep = 'community-profile' | 'importing';

interface CommunityFormData {
  name: string;
  location: string;
  logo: File | null;
  backgroundImage: File | null;
  isPrivate: boolean;
  allowReferrals: boolean;
  isVisible: boolean;
  themeColor: string;
}

const CommunityOnboardingDialog: React.FC<CommunityOnboardingDialogProps> = ({
  onClose,
  onCommunityCreated
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('community-profile');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdCommunityId, setCreatedCommunityId] = useState<string | null>(null);
  
  const [communityData, setCommunityData] = useState<CommunityFormData>({
    name: '',
    location: '',
    logo: null,
    backgroundImage: null,
    isPrivate: false,
    allowReferrals: true,
    isVisible: true,
    themeColor: '#E0407B'
  });

  // Handle community profile submission
  const handleCommunitySubmit = async () => {
    if (!user || !communityData.name.trim()) {
      setError('Please fill in the community name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create community in Firestore
      const communityRef = await addDoc(collection(db, `users/${user.uid}/communities`), {
        name: communityData.name,
        location: communityData.location,
        isPrivate: communityData.isPrivate,
        allowReferrals: communityData.allowReferrals,
        isVisible: communityData.isVisible,
        themeColor: communityData.themeColor,
        createdAt: new Date(),
        memberCount: 0,
        slug: communityData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      });

      console.log('✅ Community created with ID:', communityRef.id);
      setCreatedCommunityId(communityRef.id);
      
      // Move directly to import dialog
      setCurrentStep('importing');
      setShowImportDialog(true);
    } catch (error) {
      console.error('❌ Error creating community:', error);
      setError('Failed to create community. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle import completion
  const handleImportComplete = () => {
    setShowImportDialog(false);
    // Navigate to dashboard
    onCommunityCreated();
  };

  const handleImportClose = () => {
    setShowImportDialog(false);
    // Go back to community profile if user cancels import
    setCurrentStep('community-profile');
  };

  // If importing, show the Eventbrite dialog
  if (showImportDialog) {
    return (
      <EventbriteOnboardingDialog
        isOpen={true}
        onClose={handleImportClose}
        onComplete={handleImportComplete}
      />
    );
  }

  const getDialogTitle = () => {
    switch (currentStep) {
      case 'community-profile':
        return 'Community Profile';
      case 'importing':
        return 'Import Members';
      default:
        return 'Create Community';
    }
  };

  const renderCommunityProfile = () => (
    <div className="p-8">
      <CommunityForm
        initialData={communityData}
        onDataChange={setCommunityData}
        onSubmit={handleCommunitySubmit}
        onBack={onClose}
        loading={loading}
        error={error}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#1C1C1E] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">{getDialogTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {currentStep === 'community-profile' && renderCommunityProfile()}
        </div>
      </div>
    </div>
  );
};

export default CommunityOnboardingDialog;
