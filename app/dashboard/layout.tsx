"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  
  // Check profile completion status from Firestore
  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user) {
        setCheckingProfile(false);
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileComplete(userData.profileComplete || false);
        } else {
          setProfileComplete(false);
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
        setProfileComplete(false);
      } finally {
        setCheckingProfile(false);
      }
    };
    
    checkProfileStatus();
  }, [user]);
  
  // Show loading state while checking authentication or profile
  if (loading || checkingProfile) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1C1C1E]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E0407B]"></div>
      </div>
    );
  }
  
  // Redirect to home if not authenticated
  if (!user) {
    router.push('/');
    return null;
  }
  
  // Check if email is verified
  if (!user.emailVerified) {
    router.push('/auth/email-verification');
    return null;
  }
  
  // Check if profile is complete using Firestore flag
  if (profileComplete === false) {
    router.push('/auth/profile-completion');
    return null;
  }
  
  // Render dashboard if authenticated, verified, and profile complete
  return <>{children}</>;
}
