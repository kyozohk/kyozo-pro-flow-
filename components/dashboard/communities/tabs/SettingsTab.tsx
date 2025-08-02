"use client";

import React, { useState } from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../../styles/theme';
import CustomButton from '../../../CustomButton';
import CustomInput from '../../../CustomInput';
import CustomTextarea from '../../../CustomTextarea';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  imageUrl: string | null;
}

interface SettingsTabProps {
  community: Community;
  onUpdate: (updatedCommunity: Community) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ community, onUpdate }) => {
  const [name, setName] = useState(community.name);
  const [description, setDescription] = useState(community.description);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(community.imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Community name is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // In a real implementation, this would update in Firebase
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock image upload if there's a new image
      let imageUrl = community.imageUrl;
      if (imageFile) {
        // In a real implementation, this would upload to Firebase Storage
        imageUrl = imagePreview; // Using preview as mock URL
      }
      
      const updatedCommunity = {
        ...community,
        name,
        description,
        imageUrl
      };
      
      onUpdate(updatedCommunity);
      setSuccessMessage('Community settings updated successfully');
    } catch (err) {
      setError('Failed to update community settings. Please try again.');
      console.error('Error updating community:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCommunity = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would delete from Firebase
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would redirect to communities list
      setSuccessMessage('Community deleted successfully. Redirecting...');
      
      // Simulate redirect delay
      setTimeout(() => {
        window.location.href = '/dashboard/communities';
      }, 2000);
    } catch (err) {
      setError('Failed to delete community. Please try again.');
      console.error('Error deleting community:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] p-6`}>
      <h2 className={`${fontSizes.xl} ${fontWeights.bold} text-[${colors.textPrimary}] mb-6`}>
        Community Settings
      </h2>
      
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="communityImage" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
            Community Image
          </label>
          <div className="flex items-center space-x-4">
            <div className={`w-24 h-24 rounded-full bg-[${colors.bgDarker}] border border-[${colors.borderDark}] flex items-center justify-center overflow-hidden`}>
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className={`text-[${colors.textSecondary}] text-4xl`}>
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <input
                type="file"
                id="communityImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="communityImage">
                <CustomButton
                  type="button"
                  variant="text"
                  className={`border border-[${colors.borderLight}] ${borderRadius.full} px-4`}
                  as="span"
                >
                  Change Image
                </CustomButton>
              </label>
              <p className={`mt-2 text-xs text-[${colors.textSecondary}]`}>
                Recommended: Square image, at least 300x300px
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="communityName" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
            Community Name
          </label>
          <CustomInput
            id="communityName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter community name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="communityDescription" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
            Description
          </label>
          <CustomTextarea
            id="communityDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your community"
            rows={4}
          />
        </div>
        
        <div className="pt-4">
          <CustomButton
            type="submit"
            variant="primary"
            className={`${borderRadius.full} px-6`}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </CustomButton>
        </div>
      </form>
      
      <div className={`mt-12 pt-6 border-t border-[${colors.borderDark}]`}>
        <h3 className={`${fontSizes.lg} ${fontWeights.bold} text-red-500 mb-4`}>
          Danger Zone
        </h3>
        
        {!showDeleteConfirm ? (
          <CustomButton
            type="button"
            variant="text"
            className={`border border-red-500 text-red-500 hover:bg-red-500/10 ${borderRadius.full} px-6`}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Community
          </CustomButton>
        ) : (
          <div className={`bg-red-900/20 border border-red-500/50 p-4 ${borderRadius.md}`}>
            <p className="text-red-100 mb-4">
              Are you sure you want to delete this community? This action cannot be undone.
              All members, messages, and data will be permanently deleted.
            </p>
            <div className="flex space-x-3">
              <CustomButton
                type="button"
                variant="text"
                className={`text-white`}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="button"
                variant="text"
                className={`bg-red-500 text-white hover:bg-red-600 ${borderRadius.full} px-6`}
                onClick={handleDeleteCommunity}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete Community'}
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;
