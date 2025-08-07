"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Show loading state while checking authentication
  if (loading) {
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
  
  // Check if profile is complete (using displayName as indicator)
  if (!user.displayName) {
    router.push('/auth/profile-completion');
    return null;
  }
  
  // Render dashboard if authenticated, verified, and profile complete
  return <>{children}</>;
}
