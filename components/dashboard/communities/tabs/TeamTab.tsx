"use client";

import React, { useState } from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../../styles/theme';
import CustomButton from '../../../CustomButton';
import SimpleInput from '../../communities/ui/SimpleInput';
import SimpleSelect from '../../communities/ui/SimpleSelect';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'contributor';
  status: 'active' | 'pending';
  avatarUrl?: string;
}

interface TeamTabProps {
  communityId: string;
  communityName: string;
}

const TeamTab: React.FC<TeamTabProps> = ({ communityId, communityName }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'tm-1',
      name: 'You',
      email: 'you@example.com',
      role: 'admin',
      status: 'active'
    }
  ]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'moderator' | 'contributor'>('contributor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // In a real implementation, this would send an invitation email
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the new team member to the list
      const newMember: TeamMember = {
        id: `tm-${Date.now()}`,
        name: inviteEmail.split('@')[0], // Use part of email as name until they accept
        email: inviteEmail,
        role: inviteRole,
        status: 'pending'
      };
      
      setTeamMembers([...teamMembers, newMember]);
      setSuccessMessage(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteForm(false);
    } catch (err) {
      setError('Failed to send invitation. Please try again.');
      console.error('Error sending invitation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // In a real implementation, this would update in Firebase
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
      setSuccessMessage('Team member removed successfully');
    } catch (err) {
      setError('Failed to remove team member. Please try again.');
      console.error('Error removing team member:', err);
    }
  };

  const handleChangeRole = async (memberId: string, newRole: 'admin' | 'moderator' | 'contributor') => {
    // In a real implementation, this would update the role in Firebase
    try {
      setIsLoading(true);
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
      
      setSuccessMessage(`Team member role updated successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating role:', error);
      setError('Failed to update team member role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'contributor', label: 'Contributor' }
  ];

  return (
    <div className={`bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`${fontSizes.xl} ${fontWeights.bold} text-[${colors.textPrimary}]`}>
          Team Members
        </h2>
        <CustomButton
          variant="primary"
          className={`${borderRadius.full} px-4`}
          onClick={() => setShowInviteForm(true)}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Invite Team Member
          </div>
        </CustomButton>
      </div>
      
      {error && (
        <div className={`bg-red-900/20 border border-red-500/50 text-red-100 p-4 ${borderRadius.md} mb-6`}>
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className={`bg-green-900/20 border border-green-500/50 text-green-100 p-4 ${borderRadius.md} mb-6`}>
          {successMessage}
        </div>
      )}
      
      {showInviteForm && (
        <div className={`bg-[${colors.bgDarker}] ${borderRadius.lg} border border-[${colors.borderDark}] p-6 mb-6`}>
          <h3 className={`${fontSizes.lg} ${fontWeights.semibold} text-[${colors.textPrimary}] mb-4`}>
            Invite Team Member
          </h3>
          
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label htmlFor="inviteEmail" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
                Email Address
              </label>
              <SimpleInput
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email address"
                required
              />
            </div>
            
            <div>
              <label htmlFor="inviteRole" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
                Role
              </label>
              <SimpleSelect
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'moderator', label: 'Moderator' },
                  { value: 'contributor', label: 'Contributor' }
                ]}
                value={inviteRole}
                onChange={(value) => setInviteRole(value as 'admin' | 'moderator' | 'contributor')}
              />
              <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
                <strong>Admin:</strong> Full control over community settings and members
                <br />
                <strong>Moderator:</strong> Can manage members and content
                <br />
                <strong>Contributor:</strong> Can create content and message members
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <CustomButton
                type="button"
                variant="text"
                onClick={() => setShowInviteForm(false)}
                className={`text-[${colors.textSecondary}]`}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="submit"
                variant="primary"
                className={`${borderRadius.full} px-6`}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Invitation'}
              </CustomButton>
            </div>
          </form>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`bg-[${colors.borderDark}] text-[${colors.textPrimary}]`}>
            <tr>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className={`border-t border-[${colors.borderDark}]`}>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full bg-[${colors.primary}] flex items-center justify-center mr-3`}>
                      {member.avatarUrl ? (
                        <img 
                          src={member.avatarUrl} 
                          alt={member.name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className={`text-[${colors.textPrimary}]`}>{member.name}</span>
                  </div>
                </td>
                <td className={`py-4 px-4 text-[${colors.textSecondary}]`}>{member.email}</td>
                <td className="py-4 px-4">
                  {member.id === 'tm-1' ? (
                    <span className={`text-[${colors.textPrimary}] capitalize`}>
                      {member.role}
                    </span>
                  ) : (
                    <SimpleSelect
                      options={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'moderator', label: 'Moderator' },
                        { value: 'contributor', label: 'Contributor' }
                      ]}
                      value={member.role}
                      onChange={async (value) => await handleChangeRole(member.id, value as 'admin' | 'moderator' | 'contributor')}
                      className="min-w-[120px]"
                    />
                  )}
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  {member.id !== 'tm-1' && (
                    <CustomButton
                      variant="text"
                      className={`text-red-400 hover:text-red-500`}
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </CustomButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className={`mt-6 text-sm text-[${colors.textSecondary}] border-t border-[${colors.borderDark}] pt-4`}>
        <p>Team members will receive an email invitation to join your community management team.</p>
      </div>
    </div>
  );
};

export default TeamTab;
