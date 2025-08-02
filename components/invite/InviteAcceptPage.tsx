"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { colors, borderRadius, fontWeights, fontSizes } from '../../styles/theme';
import CustomButton from '../CustomButton';
import SimpleInput from '../dashboard/communities/ui/SimpleInput';
import { useAuth } from '../../contexts/AuthContext';

interface InviteAcceptPageProps {
  inviteToken: string;
}

interface InviteData {
  communityId: string;
  communityName: string;
  email: string;
  invitedBy: string;
  expiresAt: string;
}

const InviteAcceptPage: React.FC<InviteAcceptPageProps> = ({ inviteToken }) => {
  const router = useRouter();
  const { user, signIn, signUp } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [step, setStep] = useState<'loading' | 'auth' | 'profile' | 'complete'>('loading');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
  
  useEffect(() => {
    const verifyInvite = async () => {
      try {
        // In a real implementation, this would verify the token with Firebase
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock invite data
        const mockInvite: InviteData = {
          communityId: 'community-123',
          communityName: 'Tech Innovators Community',
          email: 'invited@example.com',
          invitedBy: 'Jane Cooper',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };
        
        setInviteData(mockInvite);
        setEmail(mockInvite.email);
        setStep('auth');
      } catch (err) {
        console.error('Error verifying invite:', err);
        setError('This invitation link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };
    
    verifyInvite();
  }, [inviteToken]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Try to sign in first to check if user exists
      await signIn(email, password);
      setIsExistingUser(true);
      setStep('profile');
    } catch (err: any) {
      // If user doesn't exist, sign up
      if (err.code === 'auth/user-not-found') {
        try {
          await signUp(email, password);
          setIsExistingUser(false);
          setStep('profile');
        } catch (signUpErr: any) {
          console.error('Sign up error:', signUpErr);
          setError(signUpErr.message || 'Failed to create account. Please try again.');
        }
      } else {
        console.error('Sign in error:', err);
        setError(err.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName) {
      setError('Please provide your first and last name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would update the user profile in Firebase
      // and accept the community invitation
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success - move to completion step
      setStep('complete');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderAuthStep = () => (
    <div className={`max-w-md w-full bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] p-8`}>
      <h1 className={`text-[${colors.textPrimary}] ${fontSizes['2xl']} ${fontWeights.bold} mb-2`}>
        Join {inviteData?.communityName}
      </h1>
      <p className={`text-[${colors.textSecondary}] mb-6`}>
        You've been invited by {inviteData?.invitedBy} to join this community.
      </p>
      
      {error && (
        <div className={`bg-red-900/20 border border-red-500/50 text-red-100 p-4 ${borderRadius.md} mb-6`}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleAuthSubmit} className="space-y-6">
        <div>
          <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
            Email
          </label>
          <SimpleInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!inviteData?.email}
            placeholder="Your email address"
            required
          />
        </div>
        
        <div>
          <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
            Password
          </label>
          <SimpleInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
        </div>
        
        <div>
          <CustomButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Continue'}
          </CustomButton>
        </div>
      </form>
    </div>
  );
  
  const renderProfileStep = () => (
    <div className={`max-w-md w-full bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] p-8`}>
      <h1 className={`text-[${colors.textPrimary}] ${fontSizes['2xl']} ${fontWeights.bold} mb-2`}>
        Complete Your Profile
      </h1>
      <p className={`text-[${colors.textSecondary}] mb-6`}>
        Add your details to complete your profile for {inviteData?.communityName}.
      </p>
      
      {error && (
        <div className={`bg-red-900/20 border border-red-500/50 text-red-100 p-4 ${borderRadius.md} mb-6`}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full bg-[${colors.bgDarker}] border border-[${colors.borderDark}] flex items-center justify-center overflow-hidden`}>
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className={`w-12 h-12 text-[${colors.textSecondary}]`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            
            <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 border border-gray-300 cursor-pointer shadow-sm">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input 
                type="file" 
                id="avatar" 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
              First Name
            </label>
            <SimpleInput
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
            />
          </div>
          
          <div>
            <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
              Last Name
            </label>
            <SimpleInput
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
            />
          </div>
        </div>
        
        <div>
          <CustomButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Profile & Join Community'}
          </CustomButton>
        </div>
      </form>
    </div>
  );
  
  const renderCompleteStep = () => (
    <div className={`max-w-md w-full bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] p-8 text-center`}>
      <div className="flex justify-center mb-6">
        <div className={`w-16 h-16 rounded-full bg-green-100 flex items-center justify-center`}>
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <h1 className={`text-[${colors.textPrimary}] ${fontSizes['2xl']} ${fontWeights.bold} mb-2`}>
        Welcome to {inviteData?.communityName}!
      </h1>
      <p className={`text-[${colors.textSecondary}] mb-6`}>
        You've successfully joined the community.
      </p>
      
      <CustomButton
        variant="primary"
        className={`${borderRadius.full} px-6`}
        onClick={() => router.push('/dashboard')}
      >
        Go to Dashboard
      </CustomButton>
    </div>
  );
  
  if (loading && step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1C1C1E] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E0407B]"></div>
      </div>
    );
  }
  
  if (error && !inviteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1C1C1E] p-4">
        <div className={`max-w-md w-full bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] p-8 text-center`}>
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full bg-red-100 flex items-center justify-center`}>
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <h1 className={`text-[${colors.textPrimary}] ${fontSizes['2xl']} ${fontWeights.bold} mb-2`}>
            Invalid Invitation
          </h1>
          <p className={`text-[${colors.textSecondary}] mb-6`}>
            {error}
          </p>
          
          <CustomButton
            variant="primary"
            className={`${borderRadius.full} px-6`}
            onClick={() => router.push('/')}
          >
            Back to Home
          </CustomButton>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1C1C1E] p-4">
      {step === 'auth' && renderAuthStep()}
      {step === 'profile' && renderProfileStep()}
      {step === 'complete' && renderCompleteStep()}
    </div>
  );
};

export default InviteAcceptPage;
