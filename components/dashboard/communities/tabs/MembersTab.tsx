"use client";

import React, { useState } from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../../styles/theme';
import CustomButton from '../../../CustomButton';
import SimpleInput from '../ui/SimpleInput';
import ImportEventbriteModal from '../modals/ImportEventbriteModal';
import InviteMemberModal from '../modals/InviteMemberModal';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  avatarUrl?: string;
}

interface MembersTabProps {
  communityId: string;
  communityName: string;
}

const MembersTab: React.FC<MembersTabProps> = ({ communityId, communityName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Jane Cooper',
      email: 'jane.cooper@example.com',
      phone: '+1234567890',
      status: 'active',
      joinedAt: '2025-07-28T10:30:00Z'
    },
    {
      id: '2',
      name: 'Alex Smith',
      email: 'alex.smith@example.com',
      status: 'pending',
      joinedAt: '2025-08-01T14:20:00Z'
    }
  ]);

  const handleImportMembers = (newMembers: Member[]) => {
    setMembers([...members, ...newMembers]);
    setIsImportModalOpen(false);
  };

  const handleInviteMembers = (invitationData: any) => {
    // In a real implementation, this would process the invitation data
    // and add new members with 'pending' status
    
    // Create new member entries for each invited email
    const newMembers = invitationData.emails.map((email: string, index: number) => ({
      id: `invite-${Date.now()}-${index}`,
      name: invitationData.name || email.split('@')[0],
      email: email,
      status: 'pending' as 'pending',
      joinedAt: new Date().toISOString()
    }));
    
    setMembers([...members, ...newMembers]);
    setIsInviteModalOpen(false);
  };

  const handleSendInvite = (memberId: string) => {
    // In a real implementation, this would send an email invitation
    console.log(`Sending invite to member ${memberId}`);
    
    // Update member status
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, status: 'pending' } : member
    ));
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:w-64">
          <SimpleInput
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-3">
          <CustomButton
            variant="primary"
            className={`${borderRadius.full} px-4`}
            onClick={() => setIsImportModalOpen(true)}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import from Eventbrite
            </div>
          </CustomButton>
          <CustomButton
            variant="text"
            className={`border border-[${colors.borderLight}] ${borderRadius.full} px-4`}
            onClick={() => setIsInviteModalOpen(true)}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Member
            </div>
          </CustomButton>
        </div>
      </div>

      {/* Members list */}
      <div className={`bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`bg-[${colors.borderDark}] text-[${colors.textPrimary}]`}>
              <tr>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                        member.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : member.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className={`py-4 px-4 text-[${colors.textSecondary}]`}>
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end">
                        {member.status === 'inactive' && (
                          <CustomButton
                            variant="text"
                            className={`text-[${colors.primary}] mr-2`}
                            onClick={() => handleSendInvite(member.id)}
                          >
                            Send Invite
                          </CustomButton>
                        )}
                        <CustomButton
                          variant="text"
                          className={`text-[${colors.textSecondary}]`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </CustomButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[${colors.textSecondary}]">
                    No members found. Import from Eventbrite or add members manually.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <ImportEventbriteModal
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportMembers}
          communityId={communityId}
        />
      )}
      
      {/* Invite Modal */}
      {isInviteModalOpen && (
        <InviteMemberModal
          onClose={() => setIsInviteModalOpen(false)}
          communityId={communityId}
          communityName={communityName}
        />
      )}
    </div>
  );
};

export default MembersTab;
