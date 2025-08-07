"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { sendEmailVerification, reload } from 'firebase/auth';
import { CustomButton } from '../index';
import Dialog from '../Dialog';

interface EmailVerificationProps {
  onVerificationComplete?: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ onVerificationComplete }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
      return;
    }

    // Check if email is already verified
    if (currentUser.emailVerified) {
      setIsVerified(true);
      // Call completion callback or redirect to profile completion
      if (onVerificationComplete) {
        onVerificationComplete();
      } else {
        setTimeout(() => {
          router.push('/auth/profile-completion');
        }, 2000);
      }
    }
  }, [currentUser, router, onVerificationComplete]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!currentUser || resendCooldown > 0) return;

    setLoading(true);
    setError('');

    try {
      await sendEmailVerification(currentUser);
      setResendCooldown(60); // 60 second cooldown
    } catch (error: any) {
      setError(error.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError('');

    try {
      await reload(currentUser);
      if (currentUser.emailVerified) {
        setIsVerified(true);
        setTimeout(() => {
          router.push('/auth/profile-completion');
        }, 2000);
      } else {
        setError('Email not yet verified. Please check your inbox and click the verification link.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to check verification status');
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <Dialog title="Email Verified!" onClose={() => router.push('/auth/profile-completion')}>
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-green-500 mb-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-300 text-lg">Your email has been successfully verified. Redirecting to profile completion...</p>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog title="Verify Your Email" onClose={() => router.push('/')}>
      <div className="text-center mb-8">
        <svg className="w-16 h-16 mx-auto text-[#E0407B] mb-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 2.25l-10.72 6.33a2.25 2.25 0 01-2.06 0L1.5 9M12 12.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-gray-300 mb-4 text-lg">
          We've sent a verification email to <strong className="text-[#E0407B]">{currentUser?.email}</strong>
        </p>
        <p className="text-sm text-gray-400">
          Please check your inbox and click the verification link to continue.
        </p>
      </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Primary Action Button */}
          <CustomButton
            onClick={handleCheckVerification}
            disabled={loading}
            variant="form"
            className="w-full bg-gradient-to-r from-[#E0407B] to-[#D45E9B] hover:from-[#D45E9B] hover:to-[#E0407B] text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Checking...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>I've Verified My Email</span>
              </div>
            )}
          </CustomButton>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1C1C1E] text-gray-400">or</span>
            </div>
          </div>

          {/* Secondary Action */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">Didn't receive the email?</p>
            <CustomButton
              onClick={handleResendEmail}
              disabled={loading || resendCooldown > 0}
              variant="outline"
              className="w-full border-2 border-[#E0407B] text-[#E0407B] hover:bg-[#E0407B] hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              {resendCooldown > 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Resend in {resendCooldown}s</span>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span>Resend Verification Email</span>
                </div>
              )}
            </CustomButton>
          </div>
        </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Make sure to check your spam folder if you don't see the email in your inbox.
        </p>
      </div>
    </Dialog>
  );
};

export default EmailVerification;
