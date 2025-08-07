"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import SignupForm from '../SignupForm';
import EmailVerification from './EmailVerification';
import ProfileCompletion from './ProfileCompletion';

export enum AuthStep {
  SIGNUP_SIGNIN = 'signup_signin',
  EMAIL_VERIFICATION = 'email_verification', 
  PROFILE_COMPLETION = 'profile_completion'
}

interface UnifiedAuthDialogProps {
  onClose: () => void;
  initialStep?: AuthStep;
}

const UnifiedAuthDialog: React.FC<UnifiedAuthDialogProps> = ({ 
  onClose, 
  initialStep = AuthStep.SIGNUP_SIGNIN 
}) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>(initialStep);
  const { currentUser } = useAuth();
  const router = useRouter();

  // Monitor auth state changes to automatically progress through steps
  useEffect(() => {
    if (currentUser) {
      // User is authenticated, check what step they need
      if (!currentUser.emailVerified && currentUser.email) {
        // Email signup but not verified
        setCurrentStep(AuthStep.EMAIL_VERIFICATION);
      } else if (!currentUser.displayName) {
        // Authenticated but profile not complete
        setCurrentStep(AuthStep.PROFILE_COMPLETION);
      } else {
        // Fully authenticated and profile complete - close dialog and go to dashboard
        onClose();
        router.push('/dashboard');
      }
    }
  }, [currentUser, onClose, router]);

  const handleStepComplete = (nextStep?: AuthStep) => {
    if (nextStep) {
      setCurrentStep(nextStep);
    } else {
      // No next step specified, close dialog and go to dashboard
      onClose();
      router.push('/dashboard');
    }
  };

  const handleSignupComplete = () => {
    // After signup, check if email verification is needed
    if (currentUser?.email && !currentUser.emailVerified) {
      setCurrentStep(AuthStep.EMAIL_VERIFICATION);
    } else {
      // Phone signup or already verified, go to profile completion
      setCurrentStep(AuthStep.PROFILE_COMPLETION);
    }
  };

  const handleEmailVerificationComplete = () => {
    // After email verification, go to profile completion
    setCurrentStep(AuthStep.PROFILE_COMPLETION);
  };

  const handleProfileCompletionComplete = () => {
    // After profile completion, close dialog and go to dashboard
    onClose();
    router.push('/dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case AuthStep.SIGNUP_SIGNIN:
        return (
          <SignupForm 
            onSubmitted={handleSignupComplete}
          />
        );
      
      case AuthStep.EMAIL_VERIFICATION:
        return (
          <EmailVerification 
            onVerificationComplete={handleEmailVerificationComplete}
          />
        );
      
      case AuthStep.PROFILE_COMPLETION:
        return (
          <ProfileCompletion 
            onProfileComplete={handleProfileCompletionComplete}
          />
        );
      
      default:
        return (
          <SignupForm 
            onSubmitted={handleSignupComplete}
          />
        );
    }
  };

  return (
    <>
      {renderCurrentStep()}
    </>
  );
};

export default UnifiedAuthDialog;
