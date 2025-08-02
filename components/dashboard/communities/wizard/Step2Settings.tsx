"use client";

import React from 'react';
import { colors, borderRadius, fontWeights } from '../../../../styles/theme';
import SimpleSelect from '../ui/SimpleSelect';
import { CommunityData } from './OnboardingWizard';

interface Step2SettingsProps {
  communityData: CommunityData;
  updateCommunityData: (data: Partial<CommunityData>) => void;
}

const privacyOptions = [
  { value: 'public', label: 'Public - Anyone can view and join' },
  { value: 'private', label: 'Private - Only members can view content' },
  { value: 'invite-only', label: 'Invite Only - Members must be invited to join' },
];

const visibilityOptions = [
  { value: 'visible', label: 'Visible - Show in community directories' },
  { value: 'hidden', label: 'Hidden - Only accessible via direct link' },
];

// Predefined color options
const colorOptions = [
  '#e0407b', // Default pink
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#ef4444', // Red
  '#6366f1', // Indigo
];

const Step2Settings: React.FC<Step2SettingsProps> = ({ communityData, updateCommunityData }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
          Privacy Setting
        </label>
        <SimpleSelect
          value={communityData.privacy}
          onChange={(value) => updateCommunityData({ privacy: value as 'public' | 'private' | 'invite-only' })}
          options={privacyOptions}
        />
        <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
          Control who can view and join your community
        </p>
      </div>
      
      <div>
        <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
          Visibility
        </label>
        <SimpleSelect
          value={communityData.visibility}
          onChange={(value) => updateCommunityData({ visibility: value as 'visible' | 'hidden' })}
          options={visibilityOptions}
        />
        <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
          Control whether your community appears in directories and search results
        </p>
      </div>
      
      <div>
        <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
          Member Referrals
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={communityData.allowReferrals}
              onChange={(e) => updateCommunityData({ allowReferrals: e.target.checked })}
              className="sr-only"
            />
            <div className={`
              w-10 h-5 rounded-full p-1 transition-colors
              ${communityData.allowReferrals ? `bg-[${colors.primary}]` : `bg-[${colors.borderDark}]`}
            `}>
              <div className={`
                w-3 h-3 rounded-full transition-transform
                bg-white
                ${communityData.allowReferrals ? 'translate-x-5' : 'translate-x-0'}
              `}></div>
            </div>
            <span className={`ml-3 text-[${colors.textPrimary}]`}>
              Allow members to invite others
            </span>
          </label>
        </div>
        <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
          When enabled, members can invite friends to join your community
        </p>
      </div>
      
      <div>
        <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
          Community Color
        </label>
        <div className="grid grid-cols-8 gap-3">
          {colorOptions.map((color) => (
            <div
              key={color}
              onClick={() => updateCommunityData({ primaryColor: color })}
              className={`
                w-10 h-10 rounded-full cursor-pointer
                ${communityData.primaryColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''}
              `}
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
        <div className="mt-4">
          <label className={`block mb-2 text-sm text-[${colors.textSecondary}]`}>
            Custom Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={communityData.primaryColor}
              onChange={(e) => updateCommunityData({ primaryColor: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={communityData.primaryColor}
              onChange={(e) => updateCommunityData({ primaryColor: e.target.value })}
              className={`
                w-28 px-3 py-2 bg-[${colors.bgDarker}] rounded-md
                text-[${colors.textPrimary}] border border-[${colors.borderDark}]
                focus:border-[${colors.primary}] focus:outline-none
              `}
              placeholder="#RRGGBB"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Settings;
