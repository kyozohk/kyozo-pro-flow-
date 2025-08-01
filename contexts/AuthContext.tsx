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
import { auth, db, storage, storageCustomMetadata } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  user: User | null; // Alias for currentUser for easier access
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithPhone: (phoneNumber: string) => Promise<any>;
  verifyPhoneCode: (verificationId: string, code: string) => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  completeProfile: (firstName: string, lastName: string, avatarFile?: File) => Promise<void>;
  checkEmailVerified: () => Promise<boolean>;
  sendVerificationEmail: () => Promise<void>;
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
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  };
  
  // Check if email is verified
  const checkEmailVerified = async () => {
    if (!currentUser) throw new Error("No authenticated user");
    
    // Reload user to get latest status
    await currentUser.reload();
    return currentUser.emailVerified;
  };
  
  // Send verification email
  const sendVerificationEmail = async () => {
    if (!currentUser) throw new Error("No authenticated user");
    
    try {
      await sendEmailVerification(currentUser);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  };

  // Sign up with phone
  const signUpWithPhone = async (phoneNumber: string) => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
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
      return await signInWithCredential(auth, credential);
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
  const completeProfile = async (firstName: string, lastName: string, avatarFile?: File) => {
    if (!currentUser) throw new Error("No authenticated user");
    
    try {
      let photoURL = currentUser.photoURL;
      
      // Update display name
      await updateProfile(currentUser, {
        displayName: `${firstName} ${lastName}`,
      });
      
      // Upload avatar if provided
      if (avatarFile) {
        const avatarRef = ref(storage, `avatars/${currentUser.uid}`);
        
        // Use custom metadata to handle CORS
        await uploadBytes(avatarRef, avatarFile, { 
          customMetadata: storageCustomMetadata 
        });
        
        photoURL = await getDownloadURL(avatarRef);
        
        // Update profile with avatar URL
        await updateProfile(currentUser, {
          photoURL: photoURL,
        });
      }
      
      // Save to Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        firstName,
        lastName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        photoURL,
        createdAt: new Date(),
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
    checkEmailVerified,
    sendVerificationEmail,
    logout,
    signOut: logout // Alias for logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
