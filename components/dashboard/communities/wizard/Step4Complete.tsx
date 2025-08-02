"use client";

import React from 'react';
import { colors, fontWeights } from '../../../../styles/theme';
import { CommunityData } from './OnboardingWizard';

interface Step4CompleteProps {
  communityData: CommunityData;
  importedMembers: any[];
}

const Step4Complete: React.FC<Step4CompleteProps> = ({ communityData, importedMembers }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className={`text-[${colors.textPrimary}] ${fontWeights.bold} text-xl mb-2`}>
          Your community is ready to launch!
        </h3>
        <p className={`text-[${colors.textSecondary}] max-w-md mx-auto`}>
          You've successfully set up your community. Click "Create Community" to finish.
        </p>
      </div>
      
      <div className={`bg-[${colors.bgDarker}] rounded-lg p-5`}>
        <h4 className={`text-[${colors.textPrimary}] ${fontWeights.medium} mb-4`}>Community Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center mb-4">
              {communityData.imageUrl ? (
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img 
                    src={communityData.imageUrl} 
                    alt={communityData.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className={`w-16 h-16 rounded-full mr-4 flex items-center justify-center`}
                  style={{ backgroundColor: communityData.primaryColor }}
                >
                  <span className="text-white text-xl font-bold">
                    {communityData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div>
                <h3 className={`text-[${colors.textPrimary}] ${fontWeights.bold}`}>
                  {communityData.name}
                </h3>
                {communityData.location && (
                  <p className={`text-[${colors.textSecondary}] text-sm`}>
                    {countryOptions.find(c => c.value === communityData.location)?.label || communityData.location}
                  </p>
                )}
              </div>
            </div>
            
            {communityData.description && (
              <div className="mb-4">
                <h5 className={`text-sm text-[${colors.textSecondary}] mb-1`}>Description</h5>
                <p className={`text-[${colors.textPrimary}]`}>{communityData.description}</p>
              </div>
            )}
          </div>
          
          <div>
            <div className="mb-4">
              <h5 className={`text-sm text-[${colors.textSecondary}] mb-1`}>Privacy</h5>
              <p className={`text-[${colors.textPrimary}]`}>
                {communityData.privacy === 'public' && 'Public - Anyone can view and join'}
                {communityData.privacy === 'private' && 'Private - Only members can view content'}
                {communityData.privacy === 'invite-only' && 'Invite Only - Members must be invited to join'}
              </p>
            </div>
            
            <div className="mb-4">
              <h5 className={`text-sm text-[${colors.textSecondary}] mb-1`}>Visibility</h5>
              <p className={`text-[${colors.textPrimary}]`}>
                {communityData.visibility === 'visible' 
                  ? 'Visible - Show in community directories' 
                  : 'Hidden - Only accessible via direct link'
                }
              </p>
            </div>
            
            <div className="mb-4">
              <h5 className={`text-sm text-[${colors.textSecondary}] mb-1`}>Member Referrals</h5>
              <p className={`text-[${colors.textPrimary}]`}>
                {communityData.allowReferrals 
                  ? 'Enabled - Members can invite others' 
                  : 'Disabled - Only admins can invite'
                }
              </p>
            </div>
            
            <div className="mb-4">
              <h5 className={`text-sm text-[${colors.textSecondary}] mb-1`}>Community Color</h5>
              <div className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-2" 
                  style={{ backgroundColor: communityData.primaryColor }}
                ></div>
                <span className={`text-[${colors.textPrimary}]`}>{communityData.primaryColor}</span>
              </div>
            </div>
          </div>
        </div>
        
        {importedMembers.length > 0 && (
          <div className="mt-6">
            <h5 className={`text-[${colors.textPrimary}] ${fontWeights.medium} mb-3`}>
              Imported Members ({importedMembers.length})
            </h5>
            
            <div className={`border border-[${colors.borderDark}] rounded-lg overflow-hidden`}>
              <table className="w-full">
                <thead className={`bg-[${colors.bgDarker}] border-b border-[${colors.borderDark}]`}>
                  <tr>
                    <th className={`px-4 py-2 text-left text-sm text-[${colors.textSecondary}]`}>Name</th>
                    <th className={`px-4 py-2 text-left text-sm text-[${colors.textSecondary}]`}>Email</th>
                    <th className={`px-4 py-2 text-left text-sm text-[${colors.textSecondary}]`}>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {importedMembers.slice(0, 3).map((member, index) => (
                    <tr key={index} className={`border-b border-[${colors.borderDark}] last:border-b-0`}>
                      <td className={`px-4 py-2 text-[${colors.textPrimary}]`}>{member.name}</td>
                      <td className={`px-4 py-2 text-[${colors.textPrimary}]`}>{member.email}</td>
                      <td className={`px-4 py-2 text-[${colors.textPrimary}]`}>{member.phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {importedMembers.length > 3 && (
                <div className={`px-4 py-2 text-center text-sm text-[${colors.textSecondary}]`}>
                  +{importedMembers.length - 3} more members
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Country options with flags (same as in Step1BasicInfo)
const countryOptions = [
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'gb', label: '🇬🇧 United Kingdom' },
  { value: 'ca', label: '🇨🇦 Canada' },
  { value: 'au', label: '🇦🇺 Australia' },
  { value: 'de', label: '🇩🇪 Germany' },
  { value: 'fr', label: '🇫🇷 France' },
  { value: 'jp', label: '🇯🇵 Japan' },
  { value: 'cn', label: '🇨🇳 China' },
  { value: 'in', label: '🇮🇳 India' },
  { value: 'br', label: '🇧🇷 Brazil' },
  { value: 'sg', label: '🇸🇬 Singapore' },
  { value: 'hk', label: '🇭🇰 Hong Kong' },
];

export default Step4Complete;
