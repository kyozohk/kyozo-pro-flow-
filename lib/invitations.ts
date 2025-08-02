import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp, 
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

export interface Invitation {
  id?: string;
  token: string;
  email: string;
  name?: string;
  communityId: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: Timestamp;
  expiresAt: Timestamp;
  acceptedAt?: Timestamp;
  customMessage?: string;
}

/**
 * Create a new invitation for a member to join a community
 */
export const createInvitation = async (
  communityId: string, 
  email: string, 
  invitedBy: string,
  name?: string,
  customMessage?: string
): Promise<string> => {
  // Check if an invitation already exists for this email and community
  const existingInvitations = await getDocs(
    query(
      collection(db, 'invitations'),
      where('email', '==', email),
      where('communityId', '==', communityId),
      where('status', '==', 'pending')
    )
  );

  // If an invitation exists, return its token
  if (!existingInvitations.empty) {
    return existingInvitations.docs[0].data().token;
  }

  // Create a new invitation with a unique token
  const token = uuidv4();
  const now = new Date();
  
  // Set expiration to 7 days from now
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invitationData: Omit<Invitation, 'id'> = {
    token,
    email,
    name,
    communityId,
    invitedBy,
    status: 'pending',
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(expiresAt),
    customMessage
  };

  await addDoc(collection(db, 'invitations'), invitationData);
  
  return token;
};

/**
 * Create multiple invitations at once
 */
export const createBulkInvitations = async (
  communityId: string,
  emails: string[],
  invitedBy: string,
  customMessage?: string
): Promise<{ email: string; token: string }[]> => {
  const results: { email: string; token: string }[] = [];
  
  // Process each email
  for (const email of emails) {
    try {
      const token = await createInvitation(communityId, email, invitedBy, undefined, customMessage);
      results.push({ email, token });
    } catch (error) {
      console.error(`Failed to create invitation for ${email}:`, error);
      // Continue with other invitations even if one fails
    }
  }
  
  return results;
};

/**
 * Verify an invitation token and return the invitation data
 */
export const verifyInvitation = async (token: string): Promise<Invitation | null> => {
  const invitationsRef = collection(db, 'invitations');
  const q = query(invitationsRef, where('token', '==', token));
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const invitationDoc = querySnapshot.docs[0];
  const invitation = { id: invitationDoc.id, ...invitationDoc.data() } as Invitation;
  
  // Check if invitation has expired
  const now = new Date();
  if (invitation.expiresAt.toDate() < now && invitation.status === 'pending') {
    // Mark as expired
    await updateDoc(doc(db, 'invitations', invitationDoc.id), {
      status: 'expired'
    });
    invitation.status = 'expired';
    return invitation;
  }
  
  return invitation;
};

/**
 * Accept an invitation and add the user to the community
 */
export const acceptInvitation = async (
  token: string, 
  userId: string
): Promise<boolean> => {
  // Find the invitation
  const invitationsRef = collection(db, 'invitations');
  const q = query(invitationsRef, where('token', '==', token));
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return false;
  }
  
  const invitationDoc = querySnapshot.docs[0];
  const invitation = invitationDoc.data() as Invitation;
  
  // Check if invitation is still valid
  if (invitation.status !== 'pending') {
    return false;
  }
  
  const now = new Date();
  if (invitation.expiresAt.toDate() < now) {
    // Mark as expired
    await updateDoc(doc(db, 'invitations', invitationDoc.id), {
      status: 'expired'
    });
    return false;
  }
  
  // Update invitation status
  await updateDoc(doc(db, 'invitations', invitationDoc.id), {
    status: 'accepted',
    acceptedAt: serverTimestamp()
  });
  
  // Add user to community members
  const communityRef = doc(db, 'communities', invitation.communityId);
  const communityDoc = await getDoc(communityRef);
  
  if (!communityDoc.exists()) {
    return false;
  }
  
  // Add member to the community
  const membersRef = collection(db, 'communities', invitation.communityId, 'members');
  await addDoc(membersRef, {
    userId,
    email: invitation.email,
    name: invitation.name || '',
    role: 'member',
    joinedAt: serverTimestamp(),
    invitedBy: invitation.invitedBy
  });
  
  return true;
};

/**
 * Get all pending invitations for a community
 */
export const getCommunityInvitations = async (communityId: string): Promise<Invitation[]> => {
  const invitationsRef = collection(db, 'invitations');
  const q = query(
    invitationsRef, 
    where('communityId', '==', communityId)
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Invitation));
};

/**
 * Delete an invitation
 */
export const deleteInvitation = async (invitationId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'invitations', invitationId));
    return true;
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return false;
  }
};

/**
 * Resend an invitation (reset expiration date)
 */
export const resendInvitation = async (invitationId: string): Promise<boolean> => {
  try {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await updateDoc(doc(db, 'invitations', invitationId), {
      status: 'pending',
      expiresAt: Timestamp.fromDate(expiresAt)
    });
    
    return true;
  } catch (error) {
    console.error('Error resending invitation:', error);
    return false;
  }
};
