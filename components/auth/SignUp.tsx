"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CustomButton } from '../index';
import { OtpInput } from '../index';

type AuthMethod = 'email' | 'phone' | 'google';

export const SignUp: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'initial' | 'verification' | 'profile'>('initial');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUpWithEmail, signUpWithPhone, verifyPhoneCode, signInWithGoogle } = useAuth();

  const handleAuthMethodChange = (method: AuthMethod) => {
    setAuthMethod(method);
    setError('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMethod === 'email') {
        await signUpWithEmail(email, password);
        setStep('verification');
      } else if (authMethod === 'phone') {
        const confirmationResult = await signUpWithPhone(phoneNumber);
        setVerificationId(confirmationResult.verificationId);
        setStep('verification');
      } else if (authMethod === 'google') {
        await signInWithGoogle();
        // Google sign-in handles verification automatically
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMethod === 'phone') {
        await verifyPhoneCode(verificationId, verificationCode);
      }
      setStep('profile');
    } catch (error: any) {
      setError(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      // Google sign-in handles profile info automatically
    } catch (error: any) {
      setError(error.message || 'Error signing in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Create your account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {step === 'initial' && (
        <>
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 ${authMethod === 'email' ? 'text-[#E0407B] border-b-2 border-[#E0407B]' : 'text-gray-500'}`}
              onClick={() => handleAuthMethodChange('email')}
            >
              Email
            </button>
            <button
              className={`flex-1 py-2 ${authMethod === 'phone' ? 'text-[#E0407B] border-b-2 border-[#E0407B]' : 'text-gray-500'}`}
              onClick={() => handleAuthMethodChange('phone')}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleSignUp}>
            {authMethod === 'email' ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0407B]"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0407B]"
                    required
                    minLength={6}
                  />
                </div>
              </>
            ) : (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0407B]"
                  placeholder="+1 234 567 8900"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <CustomButton variant="form" type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Continue'}
              </CustomButton>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M19.6 10.2c0-.7-.1-1.3-.2-1.9H10v3.7h5.4c-.2 1.2-.9 2.2-2 2.9v2.4h3.2c1.9-1.7 3-4.3 3-7.1z"
                fill="#4285F4"
              />
              <path
                d="M10 20c2.7 0 4.9-.9 6.6-2.4l-3.2-2.4c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H1.1v2.5C2.7 17.8 6.1 20 10 20z"
                fill="#34A853"
              />
              <path
                d="M4.4 12.1c-.2-.6-.3-1.3-.3-2.1s.1-1.5.3-2.1V5.4H1.1C.4 6.8 0 8.3 0 10s.4 3.2 1.1 4.6l3.3-2.5z"
                fill="#FBBC05"
              />
              <path
                d="M10 3.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8C14.9.9 12.7 0 10 0 6.1 0 2.7 2.2 1.1 5.4l3.3 2.5c.8-2.3 3-4.1 5.6-4.1z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
        </>
      )}

      {step === 'verification' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Verification</h3>
          
          {authMethod === 'email' ? (
            <div className="text-center mb-6">
              <p className="mb-4">We've sent a verification link to your email.</p>
              <p className="text-sm text-gray-600">Please check your inbox and click the link to verify your email address.</p>
              <CustomButton 
                variant="primary" 
                size="default" 
                onClick={() => setStep('profile')} 
                className="mt-4"
              >
                I've verified my email
              </CustomButton>
            </div>
          ) : (
            <form onSubmit={handleVerifyCode}>
              <p className="mb-4">Enter the 6-digit code sent to your phone</p>
              
              <div className="mb-6">
                <div id="recaptcha-container"></div>
                <OtpInput 
                  value={verificationCode} 
                  onChange={setVerificationCode} 
                  length={6} 
                />
              </div>
              
              <CustomButton variant="form" type="submit" disabled={loading || verificationCode.length !== 6}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </CustomButton>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SignUp;
