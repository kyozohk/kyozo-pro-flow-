"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TabButton from './TabButton';
import CustomInput from './CustomInput';
import CustomCheckbox from './CustomCheckbox';
import Dialog from './Dialog';
import CustomButton from './CustomButton';
import ErrorNotification from './ErrorNotification';
import { AuthTab, FormMode } from '../types';
import { useAuth } from '../contexts/AuthContext';

const SuccessView: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center space-y-4 py-8">
      <svg className="w-16 h-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-xl font-bold">You're on the list!</p>
      <p className="text-gray-300">{message}</p>
    </div>
);

interface WaitlistFormProps {
  onSubmitted: () => void;
}

const SignUpForm: React.FC<WaitlistFormProps> = ({ onSubmitted }) => {
  const router = useRouter();
  const { signUpWithEmail, signInWithEmail, signInWithGoogle } = useAuth();
  const [authTab, setAuthTab] = useState<AuthTab>(AuthTab.Email);
  const [formMode, setFormMode] = useState<FormMode>(FormMode.SignUp);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    newsletter: true,
    whatsapp: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<typeof formData, 'newsletter' | 'whatsapp'>, string>>>({});
  const [authError, setAuthError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (formMode === FormMode.SignUp) {
      if (!formData.firstname.trim()) newErrors.firstname = 'First name is required.';
      if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required.';
    }
    
    if (formMode === FormMode.ForgotPassword) {
      if (authTab === AuthTab.Email) {
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid.';
        }
      } else {
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
      }
      return newErrors;
    }
    
    if (authTab === AuthTab.Phone) {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    } else {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid.';
      }
    }
    
    return newErrors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }
    
    setIsLoading(true);
    
    try {
      if (formMode === FormMode.SignUp && authTab === AuthTab.Email) {
        await signUpWithEmail(formData.email, formData.password);
        setIsSuccess(true);
        setTimeout(() => router.push('/dashboard'), 2000);
      } else if (formMode === FormMode.SignIn && authTab === AuthTab.Email) {
        await signInWithEmail(formData.email, formData.password);
        router.push('/dashboard');
      } else if (formMode === FormMode.ForgotPassword) {
        // Handle password reset
        console.log("Password reset for:", authTab === AuthTab.Email ? formData.email : formData.phone);
        setIsSuccess(true);
        setTimeout(() => setFormMode(FormMode.SignIn), 2000);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      if (error instanceof Error) {
        setAuthError(`Authentication failed: ${error.message}`);
      } else {
        setAuthError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      // Provide specific error messages based on error code
      let errorMessage = 'Google authentication failed. Please try again.';
      
      if (error?.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.';
      } else if (error?.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled. Please try again when ready.';
      } else if (error?.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error?.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error?.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      }
      
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  if(isSuccess) {
    return <SuccessView message={formMode === FormMode.ForgotPassword ? "Password reset instructions sent." : "Account created successfully!"} />;
  }

  const getDialogTitle = () => {
    if (formMode === FormMode.SignUp) return 'Join Kyozo';
    if (formMode === FormMode.SignIn) return 'Welcome Back';
    return 'Reset Password';
  };

  return (
    <Dialog title={getDialogTitle()} onClose={onSubmitted}>
      
      <div className="flex justify-center items-center bg-[#2C2C2E] rounded-full p-1 mb-8">
        <TabButton label="Email" isActive={authTab === AuthTab.Email} onClick={() => setAuthTab(AuthTab.Email)} />
        <TabButton label="Phone" isActive={authTab === AuthTab.Phone} onClick={() => setAuthTab(AuthTab.Phone)} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {authError && <ErrorNotification message={authError} onClose={() => setAuthError('')} />}
        {formMode === FormMode.SignUp && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput label="Firstname *" name="firstname" type="text" value={formData.firstname} onChange={handleInputChange} error={errors.firstname}/>
            <CustomInput label="Lastname *" name="lastname" type="text" value={formData.lastname} onChange={handleInputChange} error={errors.lastname}/>
          </div>
        )}
        
        {authTab === AuthTab.Email ? (
          <CustomInput label="Email *" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email}/>
        ) : (
          <CustomInput label="Phone *" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} error={errors.phone}/>
        )}
        
        {formMode !== FormMode.ForgotPassword && (
          <CustomInput label="Password *" name="password" type="password" value={formData.password || ''} onChange={handleInputChange} error={errors.password}/>
        )}
        
        {formMode === FormMode.SignUp && (
          <div className="space-y-4 pt-2">
            <CustomCheckbox id="newsletter" name="newsletter" label="Sign me up to the CreativeLab newsletter" checked={formData.newsletter} onChange={handleInputChange} />
            <CustomCheckbox id="whatsapp" name="whatsapp" label="I agree to be contacted via WhatsApp" checked={formData.whatsapp} onChange={handleInputChange} />
          </div>
        )}

        <CustomButton type="submit" variant="form" disabled={isLoading}>
          {isLoading ? 'Processing...' : formMode === FormMode.SignUp ? 'Sign Up' : formMode === FormMode.SignIn ? 'Sign In' : 'Reset Password'}
        </CustomButton>
        
        {authTab === AuthTab.Email && formMode !== FormMode.ForgotPassword && (
          <div className="mt-4">
            <button 
              type="button" 
              className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {formMode === FormMode.SignUp ? 'Sign up with Google' : 'Sign in with Google'}
            </button>
          </div>
        )}
        
        {formMode === FormMode.SignIn && (
          <div className="text-center mt-4">
            <CustomButton 
              type="button" 
              variant="text"
              onClick={() => setFormMode(FormMode.ForgotPassword)}
            >
              Forgot password?
            </CustomButton>
            <div className="mt-4 text-gray-400">
              Don't have an account?{' '}
              <CustomButton 
                type="button" 
                variant="text"
                onClick={() => setFormMode(FormMode.SignUp)}
              >
                Sign Up
              </CustomButton>
            </div>
          </div>
        )}
        
        {formMode === FormMode.SignUp && (
          <div className="text-center mt-4">
            <div className="text-gray-400">
              Already have an account?{' '}
              <CustomButton 
                type="button" 
                variant="text"
                onClick={() => setFormMode(FormMode.SignIn)}
              >
                Sign In
              </CustomButton>
            </div>
          </div>
        )}
        
        {formMode === FormMode.ForgotPassword && (
          <div className="text-center mt-4">
            <CustomButton 
              type="button" 
              variant="text"
              onClick={() => setFormMode(FormMode.SignIn)}
            >
              Back to Sign In
            </CustomButton>
          </div>
        )}
      </form>
    </Dialog>
  );
};

export default SignUpForm;
