"use client";

import React from 'react';
import { colors, fontWeights } from '../../../../styles/theme';
import { WizardStep } from './OnboardingWizard';

interface WizardSidebarProps {
  currentStep: WizardStep;
}

interface StepInfo {
  id: WizardStep;
  label: string;
  description: string;
}

const WizardSidebar: React.FC<WizardSidebarProps> = ({ currentStep }) => {
  const steps: StepInfo[] = [
    {
      id: 'basic-info',
      label: 'Basic Information',
      description: 'Name, location and image'
    },
    {
      id: 'settings',
      label: 'Community Settings',
      description: 'Privacy, visibility and appearance'
    },
    {
      id: 'import',
      label: 'Import Members',
      description: 'From Eventbrite or CSV'
    },
    {
      id: 'complete',
      label: 'Ready to Launch',
      description: 'Review and create community'
    }
  ];

  const getStepStatus = (stepId: WizardStep) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full md:w-64 bg-[${colors.bgDarker}] rounded-lg p-5">
      <h3 className={`text-[${colors.textPrimary}] ${fontWeights.bold} mb-6`}>Setup Process</h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <div key={step.id} className="flex">
              <div className="mr-4 relative">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${status === 'completed' 
                    ? `bg-[${colors.primary}] text-white` 
                    : status === 'current'
                      ? `bg-[${colors.primary}]/20 text-[${colors.primary}] border-2 border-[${colors.primary}]` 
                      : `bg-[${colors.borderDark}] text-[${colors.textSecondary}]`
                  }
                `}>
                  {status === 'completed' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`
                    absolute top-8 left-4 w-0.5 h-12 -ml-px
                    ${status === 'completed' ? `bg-[${colors.primary}]` : `bg-[${colors.borderDark}]`}
                  `}></div>
                )}
              </div>
              
              <div>
                <h4 className={`
                  ${fontWeights.medium} 
                  ${status === 'completed' || status === 'current' 
                    ? `text-[${colors.textPrimary}]` 
                    : `text-[${colors.textSecondary}]`
                  }
                  ${status === 'completed' && fontWeights.bold}
                `}>
                  {step.label}
                </h4>
                <p className={`text-sm text-[${colors.textSecondary}]`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardSidebar;
