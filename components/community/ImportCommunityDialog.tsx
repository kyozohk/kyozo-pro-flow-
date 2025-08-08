"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '../index';
import Dialog from '../ui/Dialog';
import { colors, fonts } from '../../styles/theme';
import Image from 'next/image';

interface ImportCommunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMethodSelect: (method: 'eventbrite' | 'csv' | 'manual') => void;
}

const ImportCommunityDialog: React.FC<ImportCommunityDialogProps> = ({
  isOpen,
  onClose,
  onMethodSelect
}) => {
  const [loading, setLoading] = useState(false);

  const handleMethodSelect = async (method: 'eventbrite' | 'csv' | 'manual') => {
    setLoading(true);
    try {
      onMethodSelect(method);
    } catch (error) {
      console.error('Error selecting method:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="w-full h-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 p-6 lg:p-8">
        {/* Left Side - Text Content & Actions (Card1 Style) */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10">
          <p
            className="text-sm font-bold tracking-[0.2em] uppercase"
            style={{ color: colors.card.tagText, fontFamily: fonts.card }}
          >
            COMMUNITY SETUP
          </p>
          <h2
            className="text-3xl lg:text-5xl font-bold leading-tight tracking-tighter"
            style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
          >
            Create Your First Community
          </h2>
          <p 
            className="text-base lg:text-lg leading-relaxed"
            style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
          >
            Choose how you'd like to set up your community and import your members. You can upload a CSV file, connect your Eventbrite account, or create everything manually.
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Eventbrite Card */}
            <div 
              onClick={() => handleMethodSelect('eventbrite')}
              className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/20 border border-orange-500/30 rounded-xl cursor-pointer hover:border-orange-400/50 hover:bg-gradient-to-br hover:from-orange-500/15 hover:to-orange-600/25 transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Import from Eventbrite</h3>
                  <p className="text-sm text-gray-300 mb-3">Connect your Eventbrite account to automatically import your event attendees and create your community instantly.</p>
                  <div className="text-xs text-orange-400 font-medium">RECOMMENDED</div>
                </div>
              </div>
            </div>

            {/* CSV Card */}
            <div 
              onClick={() => handleMethodSelect('csv')}
              className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/20 border border-blue-500/30 rounded-xl cursor-pointer hover:border-blue-400/50 hover:bg-gradient-to-br hover:from-blue-500/15 hover:to-blue-600/25 transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125.504-1.125 1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Upload CSV File</h3>
                  <p className="text-sm text-gray-300 mb-3">Upload a CSV file with your member data including names, emails, and other details to quickly populate your community.</p>
                  <div className="text-xs text-blue-400 font-medium">BULK IMPORT</div>
                </div>
              </div>
            </div>

            {/* Manual Card */}
            <div 
              onClick={() => handleMethodSelect('manual')}
              className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/20 border border-purple-500/30 rounded-xl cursor-pointer hover:border-purple-400/50 hover:bg-gradient-to-br hover:from-purple-500/15 hover:to-purple-600/25 transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Create Manually</h3>
                  <p className="text-sm text-gray-300 mb-3">Set up your community from scratch and add members one by one. Perfect for smaller groups or custom setups.</p>
                  <div className="text-xs text-purple-400 font-medium">CUSTOM SETUP</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Parallax Image (Card1 Style) */}
            <div className="w-full md:w-3/5 h-[450px] relative">
            <Image 
                              src="/Parallax3.jpg" 
                              alt="Kyozo app on smartphone"
                              width={600}
                              height={1200}
                              className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                           />
            </div>
      </div>
    </Dialog>
  );
};

export default ImportCommunityDialog;
