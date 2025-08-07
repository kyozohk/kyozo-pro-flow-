"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  sendEmailVerification,
  updateProfile,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  user: User | null; // Alias for currentUser for easier access
  loading: boolean;
  signUpWithEmail: (email: string, password: string, firstName?: string, lastName?: string) => Promise<any>;
  signUpWithPhone: (phoneNumber: string, countryCode?: string, firstName?: string, lastName?: string) => Promise<any>;
  verifyPhoneCode: (verificationId: string, code: string) => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  completeProfile: (firstName: string, lastName: string, phoneNumber?: string, avatarFile?: File, countryCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout for easier access
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email
  const signUpWithEmail = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      
      // Save user profile data to Firestore if names are provided
      if (firstName || lastName) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          firstName: firstName || '',
          lastName: lastName || '',
          email: email,
          emailVerified: false,
          profileComplete: false,
          createdAt: new Date(),
        });
      }
      
      return userCredential;
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  };

  // Sign up with phone
  const signUpWithPhone = async (phoneNumber: string, countryCode?: string, firstName?: string, lastName?: string) => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      
      // Store user data for later use after phone verification
      if (firstName || lastName || countryCode) {
        sessionStorage.setItem('pendingPhoneUserData', JSON.stringify({
          firstName: firstName || '',
          lastName: lastName || '',
          countryCode: countryCode || 'US',
          phoneNumber
        }));
      }
      
      return confirmationResult;
    } catch (error) {
      console.error("Error signing up with phone:", error);
      throw error;
    }
  };

  // Verify phone code
  const verifyPhoneCode = async (verificationId: string, code: string) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const userCredential = await signInWithCredential(auth, credential);
      
      // Check if there's pending user data from phone signup
      const pendingDataStr = sessionStorage.getItem('pendingPhoneUserData');
      if (pendingDataStr) {
        try {
          const pendingData = JSON.parse(pendingDataStr);
          
          // Save user data to Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            firstName: pendingData.firstName,
            lastName: pendingData.lastName,
            email: userCredential.user.email || '',
            phoneNumber: pendingData.phoneNumber,
            countryCode: pendingData.countryCode,
            photoURL: userCredential.user.photoURL || '',
            emailVerified: userCredential.user.emailVerified,
            profileComplete: false, // Will be completed in profile completion step
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          
          // Update Firebase Auth profile if names are provided
          if (pendingData.firstName || pendingData.lastName) {
            await updateProfile(userCredential.user, {
              displayName: `${pendingData.firstName} ${pendingData.lastName}`.trim()
            });
          }
          
          // Clear pending data
          sessionStorage.removeItem('pendingPhoneUserData');
        } catch (error) {
          console.error('Error saving user data after phone verification:', error);
          // Don't throw here as the main auth succeeded
        }
      }
      
      return userCredential;
    } catch (error) {
      console.error("Error verifying phone code:", error);
      throw error;
    }
  };

  // Sign in with email
  const signInWithEmail = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile already exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create user profile with Google data
        const { displayName, photoURL, email, uid } = result.user;
        const names = displayName ? displayName.split(' ') : ['', ''];
        
        await setDoc(doc(db, 'users', uid), {
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || '',
          email: email,
          photoURL: photoURL,
          createdAt: new Date(),
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  // Complete user profile
  const completeProfile = async (firstName: string, lastName: string, phoneNumber?: string, avatarFile?: File, countryCode?: string) => {
    if (!currentUser) throw new Error("No authenticated user");
    
    try {
      let photoURL = currentUser.photoURL;
      
      // Upload avatar if provided
      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${currentUser.uid}`);
        await uploadBytes(storageRef, avatarFile);
        photoURL = await getDownloadURL(storageRef);
      }
      
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: `${firstName} ${lastName}`,
        photoURL: photoURL
      });
      
      // Save to Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        firstName,
        lastName,
        email: currentUser.email,
        phoneNumber: phoneNumber || currentUser.phoneNumber,
        countryCode: countryCode || 'US',
        photoURL,
        emailVerified: currentUser.emailVerified,
        profileComplete: true,
        updatedAt: new Date(),
      }, { merge: true });
      
    } catch (error) {
      console.error("Error completing profile:", error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    user: currentUser, // Alias for currentUser
    loading,
    signUpWithEmail,
    signUpWithPhone,
    verifyPhoneCode,
    signInWithEmail,
    signInWithGoogle,
    completeProfile,
    logout,
    signOut: logout // Alias for logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
