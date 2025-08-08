"use client";

import React, { useState, useRef } from 'react';
import { CustomButton } from '../index';
import { colors } from '../../styles/theme';

interface CommunityFormData {
  name: string;
  location: string;
  logo: File | null;
  backgroundImage: File | null;
  isPrivate: boolean;
  allowReferrals: boolean;
  isVisible: boolean;
  themeColor: string;
}

interface CommunityFormProps {
  initialData: CommunityFormData;
  onDataChange: (data: CommunityFormData) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

const CommunityForm: React.FC<CommunityFormProps> = ({
  initialData,
  onDataChange,
  onSubmit,
  onBack,
  loading,
  error
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const themeColors = [
    { name: 'Pink', value: colors.accent, class: 'bg-pink-500' },
    { name: 'Purple', value: colors.svg.purple, class: 'bg-purple-500' },
    { name: 'Blue', value: colors.secondary, class: 'bg-blue-500' },
    { name: 'Teal', value: colors.svg.teal, class: 'bg-teal-500' },
    { name: 'Orange', value: colors.svg.orange, class: 'bg-orange-500' },
  ];

  const updateData = (updates: Partial<CommunityFormData>) => {
    onDataChange({ ...initialData, ...updates });
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">Community Profile</h3>
        <p className="text-gray-300 mb-8">Set up your community details</p>
      </div>
      
      {/* Community Name */}
      <div>
        <label className="block text-gray-300 text-sm font-bold mb-2">
          Community Name *
        </label>
        <input
          type="text"
          value={initialData.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="Enter community name"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0407B] focus:border-[#E0407B] transition-colors"
        />
      </div>
      
      {/* Location */}
      <div>
        <label className="block text-gray-300 text-sm font-bold mb-2">
          Location
        </label>
        <select
          value={initialData.location}
          onChange={(e) => updateData({ location: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0407B] focus:border-[#E0407B] transition-colors"
        >
          <option value="">Select location</option>
          <option value="Indonesia">Indonesia</option>
          <option value="Singapore">Singapore</option>
          <option value="Malaysia">Malaysia</option>
          <option value="Thailand">Thailand</option>
          <option value="Philippines">Philippines</option>
          <option value="Vietnam">Vietnam</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      {/* Logo and Background Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Logo
          </label>
          <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 text-center">
            <div className="w-24 h-24 mx-auto bg-gray-700 rounded-xl flex items-center justify-center mb-4">
              {initialData.logo ? (
                <img 
                  src={URL.createObjectURL(initialData.logo)} 
                  alt="Logo preview" 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => logoInputRef.current?.click()}
              className="text-sm"
            >
              Change
            </CustomButton>
            <p className="text-gray-500 text-xs mt-2">800 x 800px</p>
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                updateData({ logo: e.target.files[0] });
              }
            }}
            className="hidden"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Background Image
          </label>
          <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 text-center">
            <div className="w-full h-24 bg-gray-700 rounded-xl flex items-center justify-center mb-4">
              {initialData.backgroundImage ? (
                <img 
                  src={URL.createObjectURL(initialData.backgroundImage)} 
                  alt="Background preview" 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => backgroundInputRef.current?.click()}
              className="text-sm"
            >
              Change
            </CustomButton>
            <p className="text-gray-500 text-xs mt-2">1920 x 1080px</p>
          </div>
          <input
            ref={backgroundInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                updateData({ backgroundImage: e.target.files[0] });
              }
            }}
            className="hidden"
          />
        </div>
      </div>
      
      {/* Privacy Settings */}
      <div className="space-y-4">
        <h4 className="text-white font-semibold text-lg">Member Privacy Setting</h4>
        <div className="space-y-4">
          <label className="flex items-start space-x-4 cursor-pointer p-4 bg-gray-800/30 rounded-xl border border-gray-600 hover:border-gray-500 transition-colors">
            <input
              type="radio"
              name="privacy"
              checked={!initialData.isPrivate}
              onChange={() => updateData({ isPrivate: false })}
              className="w-5 h-5 text-[#E0407B] border-gray-600 focus:ring-[#E0407B] focus:ring-2 mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white font-medium">Public</span>
              </div>
              <p className="text-gray-400 text-sm">Anyone can join your community as soon as they opt in</p>
            </div>
          </label>
          
          <label className="flex items-start space-x-4 cursor-pointer p-4 bg-gray-800/30 rounded-xl border border-gray-600 hover:border-gray-500 transition-colors">
            <input
              type="radio"
              name="privacy"
              checked={initialData.isPrivate}
              onChange={() => updateData({ isPrivate: true })}
              className="w-5 h-5 text-[#E0407B] border-gray-600 focus:ring-[#E0407B] focus:ring-2 mt-0.5"
            />
            <div className="flex-1">
              <span className="text-white font-medium">Private</span>
              <p className="text-gray-400 text-sm">Community owner or community leader needs to approve each member joining. If this is toggled off, members can join as soon as they opt in.</p>
            </div>
          </label>
        </div>
      </div>
      
      {/* Theme Color Selection */}
      <div className="space-y-4">
        <h4 className="text-white font-semibold text-lg">Theme Color</h4>
        <div className="flex space-x-4">
          {themeColors.map((color) => (
            <button
              key={color.name}
              onClick={() => updateData({ themeColor: color.value })}
              className={`w-12 h-12 rounded-full ${color.class} border-3 transition-all duration-200 ${
                initialData.themeColor === color.value 
                  ? 'border-white scale-110 shadow-lg' 
                  : 'border-gray-600 hover:scale-105'
              }`}
              title={color.name}
            />
          ))}
        </div>
      </div>
      
      {/* Additional Settings */}
      <div className="space-y-6">
        <h4 className="text-white font-semibold text-lg">Referral Setting</h4>
        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-600">
          <div className="flex-1">
            <span className="text-white font-medium">Allow</span>
            <p className="text-gray-400 text-sm">This feature allows existing members of your community to send invites to their friends. Referral invites do not need approval by the community owner or community leader.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              checked={initialData.allowReferrals}
              onChange={(e) => updateData({ allowReferrals: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#E0407B]"></div>
          </label>
        </div>
        
        <h4 className="text-white font-semibold text-lg">Visibility Setting</h4>
        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-600">
          <div className="flex-1">
            <span className="text-white font-medium">Visible</span>
            <p className="text-gray-400 text-sm">Turning visibility on means you will be visible on our front end platform. This means new members can discover you.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              checked={initialData.isVisible}
              onChange={(e) => updateData({ isVisible: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#E0407B]"></div>
          </label>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <div className="text-red-400 text-sm text-center">{error}</div>
        </div>
      )}
      
      <div className="flex justify-between pt-6 border-t border-gray-700">
        <CustomButton
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </CustomButton>
        <CustomButton
          type="button"
          variant="form"
          onClick={onSubmit}
          disabled={loading || !initialData.name.trim()}
        >
          {loading ? 'Creating Community...' : 'Save Changes'}
        </CustomButton>
      </div>
    </div>
  );
};

export default CommunityForm;
