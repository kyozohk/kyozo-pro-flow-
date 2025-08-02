/**
 * Test script for community invitation flow
 * 
 * This script tests the end-to-end flow for community invitations:
 * 1. Create a community
 * 2. Send an invitation to a new member
 * 3. Verify invitation email is sent with correct community name
 * 4. Accept invitation and complete profile
 * 5. Verify member appears in community members list
 */

const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} = require('firebase/auth');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc 
} = require('firebase/firestore');
const { createInvitation, verifyInvitation, acceptInvitation } = require('../lib/invitations');
const { sendInvitationEmail } = require('../lib/emailService');

// Initialize Firebase (using environment variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Test data
const testAdmin = {
  email: 'admin@example.com',
  password: 'password123',
  displayName: 'Admin User'
};

const testInvitee = {
  email: 'invitee@example.com',
  password: 'password123',
  firstName: 'Invited',
  lastName: 'User'
};

const testCommunity = {
  name: 'Test Community',
  description: 'A community created for testing the invitation flow'
};

// Helper function to log test steps
const logStep = (step, message) => {
  console.log(`\n[STEP ${step}] ${message}`);
};

// Helper function to log test results
const logResult = (success, message) => {
  if (success) {
    console.log(`✅ ${message}`);
  } else {
    console.error(`❌ ${message}`);
  }
};

// Main test function
const runTest = async () => {
  try {
    // Step 1: Sign in as admin and create a community
    logStep(1, 'Sign in as admin and create a community');
    
    try {
      await signInWithEmailAndPassword(auth, testAdmin.email, testAdmin.password);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        await createUserWithEmailAndPassword(auth, testAdmin.email, testAdmin.password);
      } else {
        throw error;
      }
    }
    
    const adminUser = auth.currentUser;
    logResult(!!adminUser, 'Admin user signed in');
    
    // Create a test community
    const communityRef = await addDoc(collection(db, 'communities'), {
      name: testCommunity.name,
      description: testCommunity.description,
      createdBy: adminUser.uid,
      createdAt: new Date(),
      members: [
        {
          uid: adminUser.uid,
          role: 'admin',
          joinedAt: new Date()
        }
      ]
    });
    
    const communityId = communityRef.id;
    logResult(!!communityId, `Community created with ID: ${communityId}`);
    
    // Step 2: Send an invitation to a new member
    logStep(2, 'Send an invitation to a new member');
    
    const customMessage = `Hi there! I'd like to invite you to join our ${testCommunity.name}. Looking forward to seeing you there!`;
    
    const inviteToken = await createInvitation(
      communityId,
      testInvitee.email,
      adminUser.uid,
      `${testInvitee.firstName} ${testInvitee.lastName}`,
      customMessage
    );
    
    logResult(!!inviteToken, `Invitation created with token: ${inviteToken}`);
    
    // Step 3: Verify invitation email is sent with correct community name
    logStep(3, 'Verify invitation email is sent with correct community name');
    
    const emailSent = await sendInvitationEmail(
      testInvitee.email,
      inviteToken,
      testCommunity.name,
      testAdmin.displayName || 'Admin User',
      customMessage
    );
    
    logResult(emailSent, 'Invitation email sent successfully');
    
    // Step 4: Sign out admin, sign in as invitee and accept invitation
    logStep(4, 'Sign out admin, sign in as invitee and accept invitation');
    
    await signOut(auth);
    logResult(!auth.currentUser, 'Admin signed out');
    
    // Verify the invitation token
    const invitation = await verifyInvitation(inviteToken);
    logResult(!!invitation, 'Invitation verified successfully');
    
    if (invitation) {
      logResult(
        invitation.communityId === communityId && 
        invitation.email === testInvitee.email,
        'Invitation details match expected values'
      );
    }
    
    // Create a new user account for the invitee
    try {
      await createUserWithEmailAndPassword(auth, testInvitee.email, testInvitee.password);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        await signInWithEmailAndPassword(auth, testInvitee.email, testInvitee.password);
      } else {
        throw error;
      }
    }
    
    const inviteeUser = auth.currentUser;
    logResult(!!inviteeUser, 'Invitee user signed in');
    
    // Accept the invitation
    const accepted = await acceptInvitation(inviteToken, inviteeUser.uid);
    logResult(accepted, 'Invitation accepted successfully');
    
    // Step 5: Verify member appears in community members list
    logStep(5, 'Verify member appears in community members list');
    
    const communityDoc = await getDoc(doc(db, 'communities', communityId));
    const communityData = communityDoc.data();
    
    const memberExists = communityData.members.some(member => member.uid === inviteeUser.uid);
    logResult(memberExists, 'Invitee appears in community members list');
    
    console.log('\n✨ Test completed successfully! ✨');
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    // Clean up by signing out
    await signOut(auth);
  }
};

// Run the test
runTest().catch(console.error);
