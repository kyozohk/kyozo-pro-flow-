"use client";

import React, { useState } from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../../styles/theme';
import Dialog from '../../../Dialog';
import CustomButton from '../../../CustomButton';
import WizardSidebar from './WizardSidebar';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Settings from './Step2Settings';
import Step3Import from './Step3Import';
import Step4Complete from './Step4Complete';

export type WizardStep = 'basic-info' | 'settings' | 'import' | 'complete';

export interface CommunityData {
  name: string;
  location: string;
  image: File | null;
  imageUrl: string;
  description: string;
  privacy: 'public' | 'private' | 'invite-only';
  allowReferrals: boolean;
  visibility: 'visible' | 'hidden';
  primaryColor: string;
  eventbriteApiKey?: string;
  csvData?: any[];
}

interface OnboardingWizardProps {
  onClose: () => void;
  onCreateCommunity: (community: any) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onClose, onCreateCommunity }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic-info');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [importMethod, setImportMethod] = useState<'eventbrite' | 'csv' | 'none'>('none');
  const [importInProgress, setImportInProgress] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [importedMembers, setImportedMembers] = useState<any[]>([]);
  
  // Community data state
  const [communityData, setCommunityData] = useState<CommunityData>({
    name: '',
    location: '',
    image: null,
    imageUrl: '',
    description: '',
    privacy: 'public',
    allowReferrals: true,
    visibility: 'visible',
    primaryColor: '#e0407b', // Default to the app's primary color
  });

  const updateCommunityData = (data: Partial<CommunityData>) => {
    setCommunityData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep === 'basic-info') {
      if (!communityData.name.trim()) {
        setError('Community name is required');
        return;
      }
      setCurrentStep('settings');
    } else if (currentStep === 'settings') {
      setCurrentStep('import');
    } else if (currentStep === 'import') {
      if (importMethod !== 'none' && !importComplete) {
        startImport();
      } else {
        setCurrentStep('complete');
      }
    } else if (currentStep === 'complete') {
      handleCreateCommunity();
    }
    
    setError('');
  };

  const handlePrev = () => {
    if (currentStep === 'settings') {
      setCurrentStep('basic-info');
    } else if (currentStep === 'import') {
      setCurrentStep('settings');
    } else if (currentStep === 'complete') {
      setCurrentStep('import');
    }
    
    setError('');
  };

  const startImport = async () => {
    setImportInProgress(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (importMethod === 'eventbrite') {
        if (!communityData.eventbriteApiKey) {
          throw new Error('Eventbrite API key is required');
        }
        
        // Mock imported members
        const mockMembers = [
          { id: '1', name: 'Jane Cooper', email: 'jane@example.com' },
          { id: '2', name: 'John Smith', email: 'john@example.com' },
          { id: '3', name: 'Emily Johnson', email: 'emily@example.com' },
        ];
        
        setImportedMembers(mockMembers);
      } else if (importMethod === 'csv') {
        if (!communityData.csvData || communityData.csvData.length === 0) {
          throw new Error('No CSV data provided');
        }
        
        setImportedMembers(communityData.csvData);
      }
      
      setImportComplete(true);
      setCurrentStep('complete');
    } catch (err: any) {
      setError(err.message || 'Failed to import members. Please try again.');
      console.error('Error importing members:', err);
    } finally {
      setImportInProgress(false);
    }
  };

  const handleCreateCommunity = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would be a call to Firebase or another backend
      const newCommunity = {
        id: Date.now().toString(),
        ...communityData,
        memberCount: importedMembers.length,
        members: importedMembers,
        createdAt: new Date().toISOString(),
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onCreateCommunity(newCommunity);
    } catch (err: any) {
      setError(err.message || 'Failed to create community. Please try again.');
      console.error('Error creating community:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic-info':
        return (
          <Step1BasicInfo 
            communityData={communityData} 
            updateCommunityData={updateCommunityData} 
          />
        );
      case 'settings':
        return (
          <Step2Settings 
            communityData={communityData} 
            updateCommunityData={updateCommunityData} 
          />
        );
      case 'import':
        return (
          <Step3Import 
            communityData={communityData} 
            updateCommunityData={updateCommunityData}
            importMethod={importMethod}
            setImportMethod={setImportMethod}
            importInProgress={importInProgress}
            importComplete={importComplete}
          />
        );
      case 'complete':
        return (
          <Step4Complete 
            communityData={communityData} 
            importedMembers={importedMembers}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'basic-info':
        return 'Basic Information';
      case 'settings':
        return 'Community Settings';
      case 'import':
        return 'Import Members';
      case 'complete':
        return 'Ready to Launch';
      default:
        return '';
    }
  };

  return (
    <Dialog isOpen={true} onClose={onClose} title="Create Your Community" size="xl">
      <div className="flex flex-col md:flex-row gap-6">
        <WizardSidebar currentStep={currentStep} />
        
        <div className="flex-1">
          {error && (
            <div className={`bg-red-900/20 border border-red-500/50 text-red-100 p-4 ${borderRadius.md} mb-6`}>
              {error}
            </div>
          )}
          
          <h2 className={`${fontSizes['2xl']} ${fontWeights.bold} text-[${colors.textPrimary}] mb-6 font-hero`}>
            {getStepTitle()}
          </h2>
          
          <div className="mb-8">
            {renderStepContent()}
          </div>
          
          <div className="flex justify-between pt-4 border-t border-[${colors.borderDark}]">
            <div>
              {currentStep !== 'basic-info' && (
                <CustomButton
                  type="button"
                  variant="text"
                  onClick={handlePrev}
                  disabled={isLoading || importInProgress}
                >
                  Previous
                </CustomButton>
              )}
            </div>
            
            <div className="flex space-x-4">
              <CustomButton
                type="button"
                variant="text"
                onClick={onClose}
                className={`text-[${colors.textSecondary}]`}
                disabled={isLoading || importInProgress}
              >
                Cancel
              </CustomButton>
              
              <CustomButton
                type="button"
                variant="primary"
                onClick={handleNext}
                disabled={isLoading || importInProgress}
                className={`${borderRadius.full} px-6`}
              >
                {currentStep === 'complete' ? 'Create Community' : 'Next'}
                {(isLoading || importInProgress) && (
                  <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default OnboardingWizard;
