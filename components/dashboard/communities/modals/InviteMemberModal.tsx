"use client";

import React, { useState } from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../../styles/theme';
import Dialog from '../../../Dialog';
import CustomButton from '../../../CustomButton';
import SimpleInput from '../ui/SimpleInput';
import SimpleTextarea from '../ui/SimpleTextarea';
import { createInvitation, createBulkInvitations } from '../../../../lib/invitations';
import { sendInvitationEmail } from '../../../../lib/emailService';
import { useAuth } from '../../../../contexts/AuthContext';

interface InviteMemberModalProps {
  onClose: () => void;
  communityId: string;
  communityName: string;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ onClose, communityId, communityName }) => {
  const { user } = useAuth();
  const [inviteType, setInviteType] = useState<'single' | 'multiple'>('single');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [customMessage, setCustomMessage] = useState(
    `Hi there,\n\nI'd like to invite you to join our community "${communityName}".\n\nClick the link in this email to set up your profile and join us!`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError('');
    setLoading(true);
    
    try {
      // Validate form based on active tab
      if (inviteType === 'single') {
        if (!email) {
          setError('Please enter an email address');
          setLoading(false);
          return;
        }
        
        // Create invitation and send email
        const token = await createInvitation(
          communityId,
          email,
          user?.uid || '',
          name || undefined,
          customMessage || undefined
        );
        
        await sendInvitationEmail(
          email,
          token,
          communityName,
          user?.displayName || 'Community Leader',
          customMessage || undefined
        );
        
      } else {
        if (!bulkEmails) {
          setError('Please enter at least one email address');
          setLoading(false);
          return;
        }
        
        // Process bulk emails
        const emailList = bulkEmails
          .split(/[,;\n]/) // Split by comma, semicolon, or newline
          .map(email => email.trim())
          .filter(email => email.length > 0);
        
        if (emailList.length === 0) {
          setError('Please enter valid email addresses');
          setLoading(false);
          return;
        }
        
        // Create bulk invitations
        const invitations = await createBulkInvitations(
          communityId,
          emailList,
          user?.uid || '',
          customMessage || undefined
        );
        
        // Send emails for each invitation
        for (const invitation of invitations) {
          await sendInvitationEmail(
            invitation.email,
            invitation.token,
            communityName,
            user?.displayName || 'Community Leader',
            customMessage || undefined
          );
        }
      }
      
      // Show success message
      setSuccess(true);
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onClose={onClose} title="Invite Members">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className={`bg-red-900/20 border border-red-500/50 text-red-100 p-4 ${borderRadius.md}`}>
            {error}
          </div>
        )}
        
        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            className={`flex-1 py-3 px-4 ${borderRadius.lg} ${fontSizes.sm} ${fontWeights.semibold} transition-colors duration-300 ease-in-out ${
              inviteType === 'single'
                ? `bg-[${colors.primary}] text-white`
                : `text-[${colors.textSecondary}] border border-[${colors.borderDark}]`
            }`}
            onClick={() => setInviteType('single')}
          >
            Single Invite
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 ${borderRadius.lg} ${fontSizes.sm} ${fontWeights.semibold} transition-colors duration-300 ease-in-out ${
              inviteType === 'multiple'
                ? `bg-[${colors.primary}] text-white`
                : `text-[${colors.textSecondary}] border border-[${colors.borderDark}]`
            }`}
            onClick={() => setInviteType('multiple')}
          >
            Bulk Invite
          </button>
        </div>
        
        {inviteType === 'single' ? (
          <>
            <div>
              <label htmlFor="email" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
                Email Address
              </label>
              <SimpleInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div>
              <label htmlFor="name" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
                Name (Optional)
              </label>
              <SimpleInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter recipient's name"
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="bulkEmails" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
              Email Addresses
            </label>
            <SimpleTextarea
              value={bulkEmails}
              onChange={(e) => setBulkEmails(e.target.value)}
              placeholder="Enter email addresses (separated by commas, semicolons, or new lines)"
              rows={5}
              required
            />
            <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
              Example: john@example.com, sarah@example.com
            </p>
          </div>
        )}
        
        <div>
          <label htmlFor="customMessage" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
            Custom Message (Optional)
          </label>
          <SimpleTextarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Enter a personal message to include in the invitation"
            rows={4}
          />
        </div>
        
        <div className={`bg-[${colors.bgDarker}] ${borderRadius.md} p-4 border border-[${colors.borderDark}]`}>
          <h4 className={`text-[${colors.textPrimary}] ${fontWeights.semibold} mb-2`}>
            What happens next?
          </h4>
          <ul className={`text-[${colors.textSecondary}] text-sm space-y-2`}>
            <li>• Invitees will receive an email with a unique invitation link</li>
            <li>• When they click the link, they'll be prompted to create an account or sign in</li>
            <li>• After authentication, they'll complete their profile and join your community</li>
            <li>• You'll be notified when members accept your invitation</li>
          </ul>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <CustomButton
            type="button"
            variant="text"
            onClick={onClose}
            className={`text-[${colors.textSecondary}]`}
          >
            Cancel
          </CustomButton>
          <CustomButton 
            type="submit" 
            variant="primary" 
            className="w-full" 
            disabled={loading}
          >
            {loading 
              ? 'Sending...' 
              : (inviteType === 'single' ? 'Send Invitation' : 'Send Invitations')
            }
          </CustomButton>
        </div>
      </form>
    </Dialog>
  );
};

export default InviteMemberModal;
