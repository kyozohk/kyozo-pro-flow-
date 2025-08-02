"use client";

import React, { useState } from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../styles/theme';
import Dialog from '../../Dialog';
import CustomInput from '../../CustomInput';
import CustomTextarea from '../../CustomTextarea';
import CustomButton from '../../CustomButton';

interface CreateCommunityModalProps {
  onClose: () => void;
  onCreateCommunity: (community: any) => void;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ onClose, onCreateCommunity }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Community name is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would be a call to Firebase or another backend
      const newCommunity = {
        id: Date.now().toString(),
        name,
        description,
        memberCount: 0,
        createdAt: new Date().toISOString(),
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onCreateCommunity(newCommunity);
    } catch (err) {
      setError('Failed to create community. Please try again.');
      console.error('Error creating community:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={true} onClose={onClose} title="Create Community">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className={`bg-red-900/20 border border-red-500/50 text-red-100 p-4 ${borderRadius.md}`}>
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
            Community Name
          </label>
          <CustomInput
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter community name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
            Description
          </label>
          <CustomTextarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your community"
            rows={4}
          />
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
            className={`${borderRadius.full} px-6`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Community'}
          </CustomButton>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateCommunityModal;
