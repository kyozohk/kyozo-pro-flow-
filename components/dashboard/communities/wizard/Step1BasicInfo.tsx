"use client";

import React, { useState, useRef } from 'react';
import { colors, borderRadius, fontWeights } from '../../../../styles/theme';
import SimpleInput from '../ui/SimpleInput';
import SimpleTextarea from '../ui/SimpleTextarea';
import SimpleSelect from '../ui/SimpleSelect';
import { CommunityData } from './OnboardingWizard';

interface Step1BasicInfoProps {
  communityData: CommunityData;
  updateCommunityData: (data: Partial<CommunityData>) => void;
}

// Country options with flags
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

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ communityData, updateCommunityData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      updateCommunityData({
        image: file,
        imageUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
          Community Name*
        </label>
        <SimpleInput
          type="text"
          value={communityData.name}
          onChange={(e) => updateCommunityData({ name: e.target.value })}
          placeholder="Enter your community name"
          required
        />
        <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
          Choose a name that represents your community's purpose or identity
        </p>
      </div>
      
      <div>
        <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
          Location
        </label>
        <SimpleSelect
          value={communityData.location}
          onChange={(value) => updateCommunityData({ location: value })}
          options={countryOptions}
        />
        <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
          Where is your community primarily based?
        </p>
      </div>
      
      <div>
        <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
          Community Image
        </label>
        
        <div 
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            ${dragActive ? `border-[${colors.primary}] bg-[${colors.primary}]/10` : `border-[${colors.borderDark}]`}
            transition-colors
          `}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {communityData.imageUrl ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <img 
                  src={communityData.imageUrl} 
                  alt="Community preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-sm text-[${colors.primary}]`}>
                Click or drag to change image
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full bg-[${colors.borderDark}] flex items-center justify-center mb-4`}>
                <svg className={`w-8 h-8 text-[${colors.textSecondary}]`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className={`text-[${colors.textPrimary}] mb-1`}>
                Drag and drop an image here
              </p>
              <p className={`text-sm text-[${colors.textSecondary}]`}>
                or <span className={`text-[${colors.primary}]`}>browse files</span>
              </p>
              <p className={`text-xs text-[${colors.textSecondary}] mt-2`}>
                Recommended: Square image, at least 300x300px
              </p>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      
      <div>
        <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
          Description
        </label>
        <SimpleTextarea
          value={communityData.description}
          onChange={(e) => updateCommunityData({ description: e.target.value })}
          placeholder="Describe what your community is about"
          rows={4}
        />
        <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
          A brief description to help members understand your community's purpose
        </p>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
