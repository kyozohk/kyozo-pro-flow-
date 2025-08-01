"use client";

import React, { useState } from 'react';
import Dialog from '../Dialog';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ProfileCompletion from './ProfileCompletion';

type AuthView = 'signUp' | 'signIn' | 'profile';

interface AuthDialogProps {
  onClose: () => void;
  initialView?: AuthView;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({
  onClose,
  initialView = 'signUp'
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);

  const handleViewChange = (view: AuthView) => {
    setCurrentView(view);
  };

  const getDialogTitle = () => {
    switch(currentView) {
      case 'signUp':
        return 'Create Account';
      case 'signIn':
        return 'Welcome Back';
      case 'profile':
        return 'Complete Your Profile';
      default:
        return 'Authentication';
    }
  };

  return (
    <Dialog title={getDialogTitle()} onClose={onClose}>
      <div className="p-2">
        {currentView === 'signUp' && (
          <SignUp />
        )}
        
        {currentView === 'signIn' && (
          <SignIn />
        )}
        
        {currentView === 'profile' && (
          <ProfileCompletion />
        )}
        
        {currentView !== 'profile' && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {currentView === 'signUp' ? (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => handleViewChange('signIn')}
                    className="text-[#E0407B] hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => handleViewChange('signUp')}
                    className="text-[#E0407B] hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default AuthDialog;
