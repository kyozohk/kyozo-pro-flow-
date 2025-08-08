"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { CustomButton } from '../index';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Dialog from '../Dialog';
import PhoneInput from '../PhoneInput';
import { colors, fonts } from '../../styles/theme';

interface ProfileCompletionProps {
  onProfileComplete?: () => void;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onProfileComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone' | 'google'>('email');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const { completeProfile, currentUser } = useAuth();

  // Generate a default avatar URL based on user's initials
  const generateDefaultAvatar = (firstName: string, lastName: string) => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const colors = [
      'FF6B6B', 'FFE66D', '4ECDC4', '45B7D1', 'A8E6CF', 
      'FFD93D', 'FF8B94', '88D8B0', '6C5CE7', 'FD79A8'
    ];
    const colorIndex = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length;
    const bgColor = colors[colorIndex];
    
    return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=fff&size=200&font-size=0.6&bold=true`;
  };

  // Fetch existing user data and pre-fill form
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setPhoneNumber(userData.phoneNumber || currentUser.phoneNumber || '');
          
          // Determine signup method
          if (currentUser.phoneNumber && !currentUser.email) {
            setSignupMethod('phone');
          } else if (currentUser.providerData.some(provider => provider.providerId === 'google.com')) {
            setSignupMethod('google');
          } else {
            setSignupMethod('email');
          }
          
          // Set existing avatar if available
          if (userData.photoURL) {
            setAvatarPreview(userData.photoURL);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // If no avatar file is provided and no existing avatar, generate a default one
      let avatarToUse = avatarFile;
      
      if (!avatarFile && !avatarPreview && firstName && lastName) {
        // Create a default avatar URL
        const defaultAvatarUrl = generateDefaultAvatar(firstName, lastName);
        
        // Convert the default avatar URL to a blob and then to a file
        try {
          const response = await fetch(defaultAvatarUrl);
          const blob = await response.blob();
          avatarToUse = new File([blob], 'default-avatar.png', { type: 'image/png' });
        } catch (avatarError) {
          console.warn('Failed to generate default avatar:', avatarError);
          // Continue without avatar if generation fails
        }
      }
      
      await completeProfile(firstName, lastName, phoneNumber, avatarToUse || undefined, countryCode);
      // Call completion callback or redirect to dashboard
      if (onProfileComplete) {
        onProfileComplete();
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      setError(error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching initial data
  if (initialLoading) {
    return (
      <Dialog title="Complete Your Profile" onClose={() => router.push('/')}>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E0407B] mb-4"></div>
          <p className="text-gray-300">Loading your profile...</p>
        </div>
      </Dialog>
    );
  }

  // Get dialog title based on signup method
  const getDialogTitle = () => {
    switch (signupMethod) {
      case 'phone': return 'Complete Your Profile';
      case 'google': return 'Add Your Phone Number';
      default: return 'Complete Your Profile';
    }
  };

  return (
    <Dialog title="" onClose={() => {}} dismissible={false}>
      <div className="w-full h-full flex flex-col md:flex-row items-start gap-8 md:gap-12 p-8 md:p-12">
        {/* Left Side - Text Content & Form */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left z-10">
          <p
            className="text-sm font-bold tracking-[0.2em] uppercase"
            style={{ color: colors.card.tagText, fontFamily: fonts.card }}
          >
            {signupMethod === 'google' ? 'PHONE VERIFICATION' : 'PROFILE SETUP'}
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold leading-tight tracking-tighter"
            style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
          >
            {getDialogTitle()}
          </h2>
          <p 
            className="text-base md:text-lg leading-relaxed"
            style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
          >
            {signupMethod === 'google' 
              ? 'We need your phone number to complete your profile and keep your account secure.'
              : 'Complete your profile to get started with your community experience.'}
          </p>
          
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg">
              {error}
            </div>
          )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex flex-col items-center">
          <div 
            className="w-32 h-32 rounded-full bg-gray-800 border-2 border-gray-600 mb-4 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#E0407B] transition-colors"
            onClick={handleBrowseClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Avatar preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-xs">Click or drag to upload</p>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <p className="text-sm text-gray-400">Upload a profile picture</p>
        </div>

        {/* Name fields - show for email and phone signup, hide for Google if already have names */}
        {(signupMethod !== 'google' || !firstName || !lastName) && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0407B] focus:border-[#E0407B]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0407B] focus:border-[#E0407B]"
                required
              />
            </div>
          </div>
        )}

        {/* Phone number field - required for all signup methods except phone (already have it) */}
        {signupMethod !== 'phone' && (
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="phoneNumber">
              Phone Number
            </label>
            <PhoneInput
              id="phoneNumber"
              value={phoneNumber}
              onChange={(phone, country) => {
                setPhoneNumber(phone);
                setCountryCode(country);
              }}
              placeholder="Enter your phone number"
              required
              className="w-full"
            />
          </div>
        )}

          <CustomButton variant="form" type="submit" disabled={loading}>
            {loading ? 'Saving...' : (
              signupMethod === 'google' ? 'Save Phone Number' : 'Complete Profile'
            )}
          </CustomButton>
        </form>
        </div>
        
        {/* Right Side - Parallax Image */}
        <div className="w-full md:w-1/2 relative ml-auto">
          <div 
            className="w-full h-96 md:h-full rounded-2xl overflow-hidden"
            style={{
              backgroundImage: 'url(/parallax-profile.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M21 17V15L15 15.5V17M11 14V12C11 9.8 9.2 8 7 8S3 9.8 3 12V14C3 16.2 4.8 18 7 18S11 16.2 11 14ZM9 14C9 15.1 8.1 16 7 16S5 15.1 5 14V12C5 10.9 5.9 10 7 10S9 10.9 9 12V14Z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Join Our Community</h3>
                <p className="text-sm opacity-90">Connect with like-minded individuals and grow together</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProfileCompletion;
